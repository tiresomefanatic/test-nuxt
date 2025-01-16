// composables/useContent.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";

interface ContentEntry {
  content: string;
  path: string;
  lastModified: number;
  sha: string;
  branch: string; // Added branch to track content per branch
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

  // Generate unique key for content based on path and branch
  const getContentKey = (path: string, branch: string) => `${branch}:${path}`;

  const setContent = (
    path: string,
    content: string,
    sha: string,
    branch: string
  ) => {
    const key = getContentKey(path, branch);
    contentCache.value.set(key, {
      content,
      path,
      lastModified: Date.now(),
      sha,
      branch,
    });
  };

  const getContent = (
    path: string,
    branch: string
  ): ContentEntry | undefined => {
    const key = getContentKey(path, branch);
    return contentCache.value.get(key);
  };

  const getContentBySha = (
    sha: string,
    branch: string
  ): ContentEntry | undefined => {
    return Array.from(contentCache.value.values()).find(
      (entry) => entry.sha === sha && entry.branch === branch
    );
  };

  const clearContent = (path: string, branch: string) => {
    const key = getContentKey(path, branch);
    contentCache.value.delete(key);
  };

  const clearBranchContent = (branch: string) => {
    for (const [key, entry] of contentCache.value.entries()) {
      if (entry.branch === branch) {
        contentCache.value.delete(key);
      }
    }
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
    clearBranchContent,
    clearAllContent,
  };
});

export const useContent = (path: string) => {
  const htmlStore = useHtmlContentStore();
  const { getRawContent, saveFileContent, currentBranch } = useGithub();
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const currentSha = ref<string | null>(null);

  const content = computed(() => {
    const cached = htmlStore.getContent(path, currentBranch.value);
    return cached?.content || "";
  });

  const checkGitHubContent = async () => {
    try {
      // Get the latest commit SHA for the file in current branch
      const response = await fetch(
        `https://api.github.com/repos/tiresomefanatic/test-nuxt/commits?path=${path}&sha=${currentBranch.value}`,
        { headers: { Accept: "application/vnd.github.v3+json" } }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch commit info");
      }

      const commits = await response.json();
      const latestSha = commits[0]?.sha;

      // Check if we need to fetch new content
      const needsFetch = !currentSha.value || currentSha.value !== latestSha;

      if (needsFetch) {
        // Check if we have content with this SHA in cache for current branch
        const cachedContent = htmlStore.getContentBySha(
          latestSha,
          currentBranch.value
        );
        if (cachedContent) {
          console.log(
            "Found cached content for SHA:",
            latestSha,
            "in branch:",
            currentBranch.value
          );
          return cachedContent.content;
        }

        // Fetch new content if not in cache
        console.log(
          "Fetching new content for SHA:",
          latestSha,
          "in branch:",
          currentBranch.value
        );
        const newContent = await getRawContent(
          "tiresomefanatic",
          "test-nuxt",
          path,
          currentBranch.value
        );

        // Store new content with SHA and branch
        htmlStore.setContent(path, newContent, latestSha, currentBranch.value);
        currentSha.value = latestSha;
        return newContent;
      }

      // If SHA matches and we're on same branch, use cached content
      return content.value;
    } catch (error) {
      console.error("Error checking GitHub content:", error);
      return content.value; // Use cached content on error
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

      // Check if we have cached content for current branch
      if (content.value) {
        // Check GitHub in background
        checkGitHubContent();
        return content.value;
      }

      // If no cached content for current branch, fetch from GitHub
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

      // Update local cache with new content and SHA for current branch
      if (result && result.commit && result.commit.sha) {
        htmlStore.setContent(
          path,
          newContent,
          result.commit.sha,
          currentBranch.value
        );
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
