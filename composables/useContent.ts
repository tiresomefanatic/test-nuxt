// composables/useContent.ts
import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useGithub } from "./useGithub";

interface SaveEntry {
  id: string;
  content: string;
  path: string;
  timestamp: number;
  branch: string;
  committed: boolean;
  commitMessage?: string;
  previewContent: string;
}

export const useContentStore = defineStore("content", () => {
  const saves = ref<SaveEntry[]>([]);
  const currentContent = ref<string>("");
  const isDirty = ref(false);
  const { octokit, currentBranch } = useGithub();

  // Load saves from localStorage on initialization
  const initializeSaves = () => {
    if (process.client) {
      const savedEntries = Object.entries(localStorage)
        .filter(([key]) => key.startsWith("content_save_"))
        .map(([_, value]) => JSON.parse(value) as SaveEntry)
        .sort((a, b) => b.timestamp - a.timestamp);

      saves.value = savedEntries;
    }
  };

  // Load content directly from GitHub
  const loadContent = async (
    path: string,
    branch: string = currentBranch.value
  ) => {
    try {
      const response = await octokit.rest.repos.getContent({
        owner: "your-owner",
        repo: "your-repo",
        path,
        ref: branch,
      });

      if ("content" in response.data) {
        const content = Buffer.from(response.data.content, "base64").toString();
        currentContent.value = content;
        isDirty.value = false;
        return content;
      }
      throw new Error("Invalid content response");
    } catch (error) {
      console.error("Failed to load content:", error);
      throw error;
    }
  };

  // Save content locally
  const saveContent = (
    path: string,
    content: string,
    branch: string = currentBranch.value
  ) => {
    const saveId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const saveEntry: SaveEntry = {
      id: saveId,
      content,
      path,
      timestamp: Date.now(),
      branch,
      committed: false,
      previewContent: content.slice(0, 200),
    };

    // Store in localStorage
    if (process.client) {
      localStorage.setItem(`content_save_${saveId}`, JSON.stringify(saveEntry));
      saves.value.unshift(saveEntry);
      isDirty.value = false;
    }

    return saveId;
  };

  // Commit a specific save to GitHub
  const commitSave = async (saveId: string, commitMessage: string) => {
    const save = saves.value.find((s) => s.id === saveId);
    if (!save) throw new Error("Save not found");

    try {
      const result = await octokit.rest.repos.createOrUpdateFileContents({
        owner: "your-owner",
        repo: "your-repo",
        path: save.path,
        message: commitMessage,
        content: Buffer.from(save.content).toString("base64"),
        branch: save.branch,
      });

      // Mark save as committed and update
      save.committed = true;
      save.commitMessage = commitMessage;

      if (process.client) {
        localStorage.setItem(`content_save_${saveId}`, JSON.stringify(save));
      }

      return result;
    } catch (error) {
      console.error("Commit failed:", error);
      throw error;
    }
  };

  // Delete a save
  const deleteSave = (saveId: string) => {
    const index = saves.value.findIndex((s) => s.id === saveId);
    if (index !== -1) {
      saves.value.splice(index, 1);
      if (process.client) {
        localStorage.removeItem(`content_save_${saveId}`);
      }
    }
  };

  // Get saves for a specific path
  const getSavesForPath = (path: string) => {
    return saves.value.filter((save) => save.path === path);
  };

  // Initialize saves if in client
  if (process.client) {
    initializeSaves();
  }

  return {
    currentContent,
    saves,
    isDirty,
    loadContent,
    saveContent,
    commitSave,
    deleteSave,
    getSavesForPath,
  };
});
