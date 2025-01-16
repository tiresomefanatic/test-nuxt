// stores/htmlContentStore.ts
import { defineStore } from "pinia";
import { ref, watch } from "vue";

interface ContentEntry {
  content: string;
  path: string;
  lastModified: number;
}

export const useHtmlContentStore = defineStore("html-content", () => {
  const contentCache = ref<Map<string, ContentEntry>>(new Map());

  // Initialize from localStorage on store creation
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

  const setContent = (path: string, content: string) => {
    contentCache.value.set(path, {
      content,
      path,
      lastModified: Date.now(),
    });
  };

  const getContent = (path: string): ContentEntry | undefined => {
    return contentCache.value.get(path);
  };

  const clearContent = (path: string) => {
    contentCache.value.delete(path);
    if (process.client) {
      const cache = JSON.parse(
        localStorage.getItem("html-content-cache") || "{}"
      );
      delete cache[path];
      localStorage.setItem("html-content-cache", JSON.stringify(cache));
    }
  };

  const clearAllContent = () => {
    contentCache.value.clear();
    if (process.client) {
      localStorage.removeItem("html-content-cache");
    }
  };

  const isCacheFresh = (path: string): boolean => {
    const entry = contentCache.value.get(path);
    if (!entry) return false;

    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - entry.lastModified < fiveMinutes;
  };

  return {
    setContent,
    getContent,
    clearContent,
    clearAllContent,
    isCacheFresh,
  };
});
