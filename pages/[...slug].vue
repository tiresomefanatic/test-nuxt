# [...slug].vue
<template>
  <div class="page-wrapper">
    <ClientOnly>
      <div v-if="data">
        <Header />
        <div class="content-area" :class="{ 'editing-mode': isEditing }">
          <!-- Sidebar shown only in non-editing mode -->
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
    // Use GitHub API to get latest commit for the file
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
 * This function ensures we always get the latest content by forcing a new fetch
 * and refreshing the local content state.
 */
const loadContent = async (force = false) => {
  loading.value = true;
  try {
    const needsRefresh = force || (await checkContentFreshness());

    if (needsRefresh) {
      console.log(`Fetching fresh content at ${new Date().toISOString()}`);
      console.log(`Branch: ${currentBranch.value}, Path: ${contentPath.value}`);

      // Get raw content from GitHub
      const content = await getRawContent(
        "tiresomefanatic",
        "test-nuxt",
        contentPath.value,
        currentBranch.value
      );

      console.log("Raw content fetched:", {
        length: content?.length || 0,
        preview: content?.substring(0, 500),
      });

      // Update editor content
      editorContent.value = content;

      if (process.client) {
        // Access Nuxt's content storage directly
        const nuxtApp = useNuxtApp();
        const storage = nuxtApp.$content?.storage;

        console.log("Current content storage:", storage);

        // Force Nuxt to clear its content cache
        if (storage) {
          await storage.clearAll();
          console.log("Cleared content storage");
        }

        // Reload the page content
        const query = !path
          ? queryContent().where({ _path: "/" })
          : queryContent().where({ _path: `/${path}` });

        const newData = await query.findOne();
        console.log("New content fetched:", newData);

        // Update the data reference
        data.value = newData;

        // Add debug log for final data state
        console.log("Final data state:", {
          dataValue: data.value,
          path: path,
          contentPath: contentPath.value,
        });
      }

      console.log("Content loaded and refreshed successfully");
    }
  } catch (error) {
    console.error("Content loading error:", error);
    console.error("Full error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
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
    console.log(`Saving content to branch: ${currentBranch.value}`);
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
    console.log(
      `Branch changed from ${oldBranch} to ${newBranch}, reloading content...`
    );
    await loadContent(true);
  }
});

// Watch for path changes
watch(contentPath, async (newPath, oldPath) => {
  if (newPath !== oldPath) {
    await loadContent(true);
  }
});

// Setup content refresh and event handlers only on client side
onMounted(() => {
  if (process.client) {
    // Initial content load
    loadContent(true);

    // Setup visibility change handler
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Setup polling only on client side
    const contentRefreshInterval = setInterval(async () => {
      if (!isEditing.value) {
        await loadContent();
      }
    }, 30000);

    // Cleanup function
    onBeforeUnmount(() => {
      clearInterval(contentRefreshInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    });
  }
});
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  position: relative;
}

.content-area {
  display: flex;
  min-height: calc(100vh - 64px);
}

.content-area.editing-mode {
  padding: 0;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  max-width: 100%;
  padding: 0;
}

.content-header {
  padding: 24px 32px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #e5e7eb;
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
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: calc(100vh - 200px);
  margin: 0;
}

/* Remove all content styling */
.prose-content {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
