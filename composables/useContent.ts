// composables/useContent.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";

interface ContentEntry {
  content: string;
  path: string;
  lastModified: number;
  sha: string;
}

export const useHtmlContentStore = defineStore("html-content", () => {
  const contentCache = ref<Map<string, ContentEntry>>(new Map());

  // Initialize from localStorage
  if (process.client) {
    const saved = localStorage.getItem("html-content-cache");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        contentCache.value = new Map(Object.entries(parsed));
      } catch (error) {
        console.error("Error parsing cached content:", error);
      }
    }

    // Watch for changes and update localStorage
    watch(
      contentCache,
      (newCache) => {
        const serialized = Object.fromEntries(newCache);
        localStorage.setItem("html-content-cache", JSON.stringify(serialized));
      },
      { deep: true }
    );
  }

  const setContent = (path: string, content: string, sha: string) => {
    contentCache.value.set(path, {
      content,
      path,
      lastModified: Date.now(),
      sha,
    });
  };

  const getContent = (path: string): ContentEntry | undefined => {
    return contentCache.value.get(path);
  };

  const getContentBySha = (sha: string): ContentEntry | undefined => {
    return Array.from(contentCache.value.values()).find(
      (entry) => entry.sha === sha
    );
  };

  const clearContent = (path: string) => {
    contentCache.value.delete(path);
  };

  const clearAllContent = () => {
    contentCache.value.clear();
    if (process.client) {
      localStorage.removeItem("html-content-cache");
    }
  };

  return {
    setContent,
    getContent,
    getContentBySha,
    clearContent,
    clearAllContent,
  };
});

// composables/useContent.ts
export const useContent = (path: string) => {
  const htmlStore = useHtmlContentStore();
  const { getRawContent, saveFileContent, currentBranch } = useGithub();
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const currentSha = ref<string | null>(null);

  const content = computed(() => {
    const cached = htmlStore.getContent(path);
    return cached?.content || "";
  });

  const checkGitHubContent = async () => {
    try {
      // Get the latest commit SHA for the file
      const response = await fetch(
        `https://api.github.com/repos/tiresomefanatic/test-nuxt/commits?path=${path}&sha=${currentBranch.value}`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch commit info");
      }

      const commits = await response.json();
      const latestSha = commits[0]?.sha;

      // If we have no SHA or a different SHA, we need to fetch new content
      if (!currentSha.value || currentSha.value !== latestSha) {
        // Check if we already have content with this SHA in cache
        const cachedContent = htmlStore.getContentBySha(latestSha);
        if (cachedContent) {
          console.log("Found cached content for SHA:", latestSha);
          return cachedContent.content;
        }

        // Fetch new content only if we don't have it cached
        console.log("Fetching new content for SHA:", latestSha);
        const newContent = await getRawContent(
          "tiresomefanatic",
          "test-nuxt",
          path,
          currentBranch.value
        );

        // Store new content with SHA
        htmlStore.setContent(path, newContent, latestSha);
        currentSha.value = latestSha;
        return newContent;
      }

      // If SHA matches, use cached content
      return content.value;
    } catch (error) {
      console.error("Error checking GitHub content:", error);
      return content.value;
    }
  };

  const fetchContent = async (force = false) => {
    loading.value = true;
    error.value = null;

    try {
      if (force) {
        const newContent = await checkGitHubContent();
        return newContent;
      }

      // If we have cached content, use it
      if (content.value) {
        // Check GitHub in background
        checkGitHubContent();
        return content.value;
      }

      // If no cached content, fetch from GitHub
      return await checkGitHubContent();
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const saveContent = async (newContent: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Save to GitHub
      const result = await saveFileContent(
        "tiresomefanatic",
        "test-nuxt",
        path,
        newContent,
        `Update ${path}`,
        currentBranch.value
      );

      // Update local cache with new content and SHA
      if (result && result.commit && result.commit.sha) {
        htmlStore.setContent(path, newContent, result.commit.sha);
        currentSha.value = result.commit.sha;
      }
    } catch (e) {
      error.value = e as Error;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    content,
    loading,
    error,
    fetchContent,
    saveContent,
  };
};
