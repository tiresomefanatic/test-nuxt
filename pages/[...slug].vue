# [...slug].vue
<template>
  <div class="page-wrapper">
    <ClientOnly>
      <div v-if="data">
        <Header />
        <div class="content-area" :class="{ 'editing-mode': isEditing }">
          <!-- Mobile menu wrapper -->
          <div class="mobile-menu-wrapper">
            <DesignSidebar />
          </div>

          <!-- Desktop sidebar shown only in non-editing mode -->
          <aside v-if="!isEditing && showSidebar" class="sidebar">
            <DesignSidebar />
          </aside>

          <div
            class="main-content"
            :class="{ 'with-sidebar': !isEditing && showSidebar }"
          >
            <!-- Content header with edit controls - only show when logged in -->
            <div v-if="isLoggedIn" class="content-header">
              <ClientOnly>
                <button
                  v-if="!isEditing"
                  @click="handleEditClick"
                  class="edit-button"
                >
                  Edit
                </button>
                <button v-else @click="exitEditor" class="edit-button">
                  Exit
                </button>
              </ClientOnly>
            </div>

            <!-- Main content area -->
            <ClientOnly>
              <div v-if="isEditing" class="editor-container">
                <TiptapEditor
                  :content="editorContent"
                  :filePath="contentPath"
                  @update:content="handleContentChange"
                  @save="handleSave"
                  @error="handleEditorError"
                />
              </div>
              <div v-else class="prose-content">
                <div :key="contentKey">
                  <ContentDoc :path="path" :head="false">
                    <template #empty>
                      <p>No content found.</p>
                    </template>
                    <template #not-found>
                      <p>Content not found. Path: {{ path }}</p>
                    </template>
                  </ContentDoc>
                </div>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { queryContent } from "#imports";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";
import { useAsyncData } from "#app";
import TiptapEditor from "~/components/TiptapEditor.vue";
import DesignSidebar from "~/components/DesignSidebar.vue";
import Header from "~/components/Header.vue";
import { useRuntimeConfig, useNuxtApp } from "#app";

// Initialize GitHub functionality and services
const { getRawContent, saveFileContent, isLoggedIn, currentBranch } =
  useGithub();
const { showToast } = useToast();

// State management
const loading = ref(false);
const isEditing = ref(false);
const editorContent = ref("");
const contentLastModified = ref<string | null>(null);

// Route handling setup
const route = useRoute();
const slug = route.params.slug || [];
const path = Array.isArray(slug) ? slug.join("/") : slug;

// Compute whether to show sidebar based on path
const showSidebar = computed(() => path !== "");
const contentKey = computed(() => `${path}-${Date.now()}`);

// Content queries for initial page load
const { data } = await useAsyncData(
  `content-${path}`,
  () => {
    if (!path) {
      return queryContent().where({ _path: "/" }).findOne();
    }
    return queryContent()
      .where({ _path: `/${path}` })
      .findOne();
  },
  {
    immediate: true,
    server: true,
  }
);

// Compute the content file path
const contentPath = computed(() => {
  if (!path) return "content/index.md";
  return `content/${path}.md`;
});

/**
 * Check if content needs to be refreshed by checking latest commit
 */
const checkContentFreshness = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/tiresomefanatic/test-nuxt/commits?path=${contentPath.value}&sha=${currentBranch.value}`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch commit info");
    }

    const commits = await response.json();
    const latestCommitSha = commits[0]?.sha;

    if (latestCommitSha !== contentLastModified.value) {
      console.log("New commit detected, refreshing content...");
      contentLastModified.value = latestCommitSha;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking content freshness:", error);
    return true; // Refresh on error to be safe
  }
};

/**
 * Loads fresh content from GitHub.
 */
const loadContent = async (force = false) => {
  loading.value = true;
  try {
    const needsRefresh = force || (await checkContentFreshness());

    if (needsRefresh) {
      console.log(`Fetching fresh content at ${new Date().toISOString()}`);
      console.log(`Branch: ${currentBranch.value}, Path: ${contentPath.value}`);

      const content = await getRawContent(
        "tiresomefanatic",
        "test-nuxt",
        contentPath.value,
        currentBranch.value
      );

      editorContent.value = content;

      if (process.client) {
        const nuxtApp = useNuxtApp();
        const storage = nuxtApp.$content?.storage;

        if (storage) {
          await storage.clearAll();
        }

        const query = !path
          ? queryContent().where({ _path: "/" })
          : queryContent().where({ _path: `/${path}` });

        const newData = await query.findOne();
        data.value = newData;
      }
    }
  } catch (error) {
    console.error("Content loading error:", error);
    showToast({
      title: "Error",
      message: `Failed to load content from branch: ${currentBranch.value}`,
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

/**
 * Handle visibility change event
 */
const handleVisibilityChange = async () => {
  if (document.visibilityState === "visible" && !isEditing.value) {
    await loadContent();
  }
};

/**
 * Handles the edit button click.
 */
const handleEditClick = async () => {
  if (!isLoggedIn.value) {
    showToast({
      title: "Authentication Required",
      message: "Please sign in with GitHub to edit content",
      type: "warning",
    });
    return;
  }

  isEditing.value = true;
  await loadContent(true);
};

const handleContentChange = (newContent: string) => {
  editorContent.value = newContent;
};

/**
 * Handles saving content to GitHub.
 */
const handleSave = async (content: string) => {
  if (!content || !isLoggedIn.value) {
    showToast({
      title: "Error",
      message: "Please sign in to save changes",
      type: "error",
    });
    return;
  }

  try {
    const result = await saveFileContent(
      "tiresomefanatic",
      "test-nuxt",
      contentPath.value,
      content,
      `Update ${contentPath.value}`,
      currentBranch.value
    );

    if (result) {
      showToast({
        title: "Success",
        message: `Content saved successfully to branch: ${currentBranch.value}`,
        type: "success",
      });

      await loadContent(true);
      isEditing.value = false;
    } else {
      throw new Error(`Failed to save to branch: ${currentBranch.value}`);
    }
  } catch (error) {
    console.error(`Error saving content:`, error);
    showToast({
      title: "Error",
      message: `Failed to save to branch: ${currentBranch.value}`,
      type: "error",
    });
  }
};

const handleEditorError = (error: Error) => {
  showToast({
    title: "Editor Error",
    message: error.message,
    type: "error",
  });
};

const exitEditor = async () => {
  await loadContent(true);
  isEditing.value = false;
};

// Watch for editing mode changes
watch(isEditing, async (newValue, oldValue) => {
  if (newValue && !oldValue) {
    await loadContent(true);
  }
});

// Watch for branch changes
watch(currentBranch, async (newBranch, oldBranch) => {
  if (newBranch !== oldBranch) {
    await loadContent(true);
  }
});

// Watch for path changes
watch(contentPath, async (newPath, oldPath) => {
  if (newPath !== oldPath) {
    await loadContent(true);
  }
});

// Setup content refresh and event handlers
onMounted(() => {
  if (process.client) {
    loadContent(true);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const contentRefreshInterval = setInterval(async () => {
      if (!isEditing.value) {
        await loadContent();
      }
    }, 30000);

    onBeforeUnmount(() => {
      clearInterval(contentRefreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    });
  }
});
</script>

# [...slug].vue

<style>
/* Global prose styles - these are essential */
.prose-content {
  max-width: 100%;
  width: 100%;
  margin: 0;
  color: #000000;
  font-size: 16px;
  line-height: 1.6;
}

.prose-content h1 {
  font-size: 2em;
  margin: 1.2em 0 0.6em;
  font-weight: 600;
  line-height: 1.2;
  color: #000000;
}

.prose-content h2 {
  font-size: 1.5em;
  margin: 1em 0 0.5em;
  font-weight: 600;
  line-height: 1.3;
  color: #000000;
}

.prose-content h3 {
  font-size: 1.25em;
  margin: 0.8em 0 0.4em;
  font-weight: 600;
  line-height: 1.4;
  color: #000000;
}

.prose-content p {
  margin: 1em 0;
  color: #000000;
}

.prose-content ul,
.prose-content ol {
  margin: 1em 0;
  padding-left: 1.5em;
  color: #000000;
}

.prose-content li {
  margin: 0.5em 0;
}

.prose-content a {
  color: #4361ee;
  text-decoration: underline;
}

.prose-content blockquote {
  border-left: 4px solid #e5e7eb;
  margin: 1.5em 0;
  padding-left: 1em;
  color: #4b5563;
}

.prose-content code {
  background: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: ui-monospace, monospace;
}

.prose-content pre {
  background: #f3f4f6;
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 1.5em 0;
}

.prose-content pre code {
  background: none;
  padding: 0;
  font-size: 0.9em;
  color: #000000;
}

.prose-content img {
  max-width: 100%;
  height: auto;
  margin: 1.5em 0;
}

.prose-content hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 2em 0;
}
</style>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  position: relative;
  width: 100%;
  overflow-x: hidden;
}

.content-area {
  display: flex;
  background: white;
  min-height: calc(100vh - 64px);
  position: relative;
  width: 100%;
}

.content-area.editing-mode {
  padding: 0;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e5e7eb;
  position: sticky;
  top: 64px;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.main-content {
  flex: 1;
  min-width: 0; /* Prevent flex item from overflowing */
  padding: 32px;
  position: relative;
}

.main-content.with-sidebar {
  width: calc(100% - 280px);
}

.content-header {
  padding: 24px 32px;
  display: flex;
  justify-content: flex-end;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  margin: -32px -32px 32px -32px;
}

.edit-button {
  padding: 8px 16px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.edit-button:hover {
  background: #3651d4;
}

.editor-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px);
  margin: 0;
  padding: 20px;
  width: 100%;
}

/* Loading state styles */
.loading {
  opacity: 0.7;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* Toast container styles */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1050;
}

/* Mobile menu wrapper styles */
.mobile-menu-wrapper {
  display: none;
  position: relative;
  z-index: 1000;
}

@media (max-width: 768px) {
  .mobile-menu-wrapper {
    display: block;
  }

  .sidebar {
    display: none;
  }

  .main-content {
    width: 100%;
    padding: 16px;
    padding-top: 80px;
  }

  .main-content.with-sidebar {
    width: 100%;
  }

  .content-header {
    margin: -16px -16px 16px -16px;
    padding: 16px;
  }

  .editor-container {
    padding: 16px;
    margin: -16px;
    width: calc(100% + 32px);
    border-radius: 0;
  }
}

/* Fix for mobile safari bottom bar */
@supports (-webkit-touch-callout: none) {
  .content-area {
    min-height: -webkit-fill-available;
  }

  .sidebar {
    height: -webkit-fill-available;
  }

  .editor-container {
    min-height: -webkit-fill-available;
  }
}
</style>
