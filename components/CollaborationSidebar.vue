<template>
  <div class="collaboration-sidebar" :class="{ open }">
    <!-- Toggle button -->
    <button class="toggle-button" @click="toggleSidebar">
      <span v-if="!open">☰</span>
      <span v-else>×</span>
    </button>

    <div class="sidebar-content">
      <!-- Navigation tabs -->
      <div class="tabs">
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="handleTabClick(tab.id)"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Content area -->
      <div class="tab-content">
        <!-- History Tab -->
        <div v-if="activeTab === 'history'" class="history-tab">
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            Loading commits...
          </div>
          <div v-else-if="commits.length === 0" class="empty-state">
            No commit history available
          </div>
          <div v-else class="commit-list">
            <div
              v-for="commit in commits"
              :key="commit.sha"
              class="commit-item"
              @click="openCommit(commit)"
              :title="'Click to view on GitHub'"
            >
              <div class="commit-header">
                <div class="commit-message">{{ commit.commit.message }}</div>
              </div>
              <div class="commit-meta">
                <div class="commit-author">
                  <img
                    v-if="commit.author?.avatar_url"
                    :src="commit.author.avatar_url"
                    :alt="commit.commit.author.name"
                    class="author-avatar"
                  />
                  <span>{{ commit.commit.author.name }}</span>
                </div>
                <div class="commit-sha">
                  {{ commit.sha.substring(0, 7) }}
                </div>
                <div class="commit-date">
                  {{ formatDate(commit.commit.author.date) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pull Requests Tab -->
        <div v-if="activeTab === 'prs'">
          <div class="pr-actions-header">
            <button
              class="create-pr-button"
              @click="showCreatePR = true"
              v-if="!showCreatePR"
            >
              Create Pull Request
            </button>
          </div>

          <CreatePullRequest
            v-if="showCreatePR"
            :branches="branches"
            :currentBranch="currentBranch"
            @created="handlePRCreated"
            @cancel="showCreatePR = false"
          />

          <div v-else-if="loading" class="loading-state">
            Loading pull requests...
          </div>
          <div v-else-if="pullRequests.length === 0" class="empty-state">
            No open pull requests
          </div>
          <div v-else class="pr-list">
            <div
              v-for="pr in pullRequests"
              :key="pr.number"
              class="pr-item"
              :class="{ 'has-conflicts': pr.mergeable === false }"
            >
              <div class="pr-header">
                <span class="pr-number">#{{ pr.number }}</span>
                <span class="pr-title">{{ pr.title }}</span>
              </div>
              <div class="pr-meta">
                <span class="pr-author">
                  <img
                    :src="pr.user.avatar_url"
                    :alt="pr.user.login"
                    class="author-avatar"
                  />
                  {{ pr.user.login }}
                </span>
                <span class="pr-status" :class="pr.mergeable_state">
                  {{ getPRStatus(pr) }}
                </span>
              </div>
              <div class="pr-actions">
                <button class="action-button" @click="openPR(pr.html_url)">
                  View on GitHub
                </button>
                <!-- <button
                  v-if="pr.mergeable === false"
                  class="action-button resolve"
                  @click="handleResolveConflicts(pr)"
                >
                  Resolve Conflicts
                </button> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Branches Tab -->
        <div v-if="activeTab === 'branches'">
          <div v-if="isLoggedIn" class="branch-controls">
            <div class="branch-select-wrapper">
              <label>Current Branch:</label>
              <select
                :value="currentBranch"
                @change="handleBranchChange"
                class="branch-select"
              >
                <option
                  v-for="branch in branches"
                  :key="branch"
                  :value="branch"
                >
                  {{ branch }}
                </option>
              </select>
            </div>

            <button
              v-if="!showNewBranchInput"
              @click="showNewBranchInput = true"
              class="create-branch-button"
            >
              Create New Branch
            </button>

            <div v-if="showNewBranchInput" class="new-branch-form">
              <input
                v-model="newBranchName"
                placeholder="Enter branch name"
                class="branch-input"
              />
              <div class="branch-actions">
                <button
                  @click="createNewBranch"
                  :disabled="!newBranchName"
                  class="create-button"
                >
                  Create
                </button>
                <button
                  @click="showNewBranchInput = false"
                  class="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <div v-else class="login-prompt">
            Please log in to manage branches
          </div>
        </div>

        <!-- Saves Tab -->
        <div v-if="activeTab === 'saves'">
          <div v-if="localSaves.length === 0" class="empty-state">
            No saved changes available
          </div>
          <div v-else class="saves-list">
            <div
              v-for="save in localSaves"
              :key="save.timestamp"
              class="save-item"
            >
              <div class="save-info">
                <span class="save-timestamp">{{
                  formatDate(save.timestamp)
                }}</span>
                <span class="save-branch">on branch {{ save.branch }}</span>
              </div>
              <div class="save-actions">
                <button
                  @click="$emit('load-save', save.content)"
                  class="action-button"
                >
                  Load
                </button>
                <button
                  @click="
                    editorStore.deleteSave(props.filePath, save.timestamp)
                  "
                  class="action-button delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";
import { useEditorStore } from "~/stores/editor";
import CreatePullRequest from "./CreatePullRequest.vue";

// Type definitions
interface PullRequest {
  number: number;
  title: string;
  user: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  mergeable: boolean;
  mergeable_state: string;
}

interface Commit {
  sha: string;
  html_url?: string; // Add this property
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    avatar_url: string;
  };
}

// Props & Emits
const props = defineProps<{
  filePath: string;
}>();

const emit = defineEmits<{
  (e: "load-save", content: string): void;
}>();

// State
const open = ref(false);
const activeTab = ref("history");
const loading = ref(false);
const commits = ref([]);
const pullRequests = ref<PullRequest[]>([]);
const showNewBranchInput = ref(false);
const newBranchName = ref("");
const showCreatePR = ref(false);

// Composables
const {
  isLoggedIn,
  currentBranch,
  branches,
  getCommits,
  getPullRequests,
  fetchBranches,
  switchBranch,
  createBranch,
  resolveConflict,
} = useGithub();

const { showToast } = useToast();
const editorStore = useEditorStore();

// Computed
const localSaves = computed(() => {
  return editorStore.getSavedContents(props.filePath);
});

const availableTabs = computed(() => [
  { id: "history", label: "History", count: commits.value.length },
  { id: "branches", label: "Branches", count: branches.value?.length || 0 },
  { id: "prs", label: "Pull Requests", count: pullRequests.value?.length || 0 },
  { id: "saves", label: "Saves", count: localSaves.value?.length || 0 },
]);

// Methods
const toggleSidebar = () => {
  open.value = !open.value;
};

const handleTabClick = async (tabId: string) => {
  activeTab.value = tabId;
  if (tabId === "history") {
    await loadCommits();
  } else if (tabId === "prs") {
    await loadPullRequests();
  }
};

const loadCommits = async () => {
  if (!isLoggedIn.value) return;

  loading.value = true;
  try {
    const result = await getCommits();
    if (result && Array.isArray(result)) {
      commits.value = result;
      console.log("Loaded commits:", commits.value);
    }
  } catch (error) {
    console.error("Error loading commits:", error);
    showToast({
      title: "Error",
      message: "Failed to load commit history",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

const openCommit = (commit: Commit) => {
  if (!commit.html_url) {
    const url = `https://github.com/tiresomefanatic/test-nuxt/commit/${commit.sha}`;
    window.open(url, "_blank");
  } else {
    window.open(commit.html_url, "_blank");
  }
};

const loadPullRequests = async () => {
  if (!isLoggedIn.value) return;

  loading.value = true;
  try {
    const result = await getPullRequests();
    if (result && Array.isArray(result)) {
      pullRequests.value = result;
      console.log("Loaded pull requests:", pullRequests.value);
    }
  } catch (error) {
    console.error("Error loading pull requests:", error);
    showToast({
      title: "Error",
      message: "Failed to load pull requests",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

const handleBranchChange = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const branchName = target.value;

  if (!branchName || branchName === currentBranch.value) return;

  loading.value = true;
  try {
    const success = await switchBranch(branchName);
    if (success) {
      await loadCommits();
      showToast({
        title: "Success",
        message: `Switched to branch: ${branchName}`,
        type: "success",
      });
    }
  } catch (error) {
    console.error("Error switching branch:", error);
    showToast({
      title: "Error",
      message: "Failed to switch branch",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

const createNewBranch = async () => {
  if (!newBranchName.value) return;

  loading.value = true;
  try {
    const result = await createBranch(newBranchName.value);
    if (result) {
      showToast({
        title: "Success",
        message: `Created branch: ${newBranchName.value}`,
        type: "success",
      });
      newBranchName.value = "";
      showNewBranchInput.value = false;
      await loadCommits();
    }
  } catch (error) {
    console.error("Error creating branch:", error);
    showToast({
      title: "Error",
      message: "Failed to create branch",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

const getPRStatus = (pr: PullRequest): string => {
  if (pr.mergeable === false) return "Has Conflicts";
  if (pr.mergeable === true) return "Ready to Merge";
  return "Checking";
};

const openPR = (url: string) => {
  window.open(url, "_blank");
};

const handlePRCreated = async () => {
  showCreatePR.value = false;
  await loadPullRequests();
};

const handleResolveConflicts = async (pr: PullRequest) => {
  loading.value = true;
  try {
    await resolveConflict(pr.number);
    await loadPullRequests();
    showToast({
      title: "Success",
      message: "Conflicts resolved successfully",
      type: "success",
    });
  } catch (error) {
    console.error("Error resolving conflicts:", error);
    showToast({
      title: "Error",
      message: "Failed to resolve conflicts",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return "Today";
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
};

// Watch for login state
watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    await fetchBranches();
    await loadCommits();
    await loadPullRequests();
  }
});

// Initialize
onMounted(async () => {
  if (isLoggedIn.value) {
    await fetchBranches();
    await loadCommits();
    await loadPullRequests();
  }
});
</script>

<style scoped>
/* Base sidebar structure */
.collaboration-sidebar {
  position: fixed;
  top: 64px;
  right: -400px;
  width: 400px;
  height: calc(100vh - 64px);
  background: #ffffff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 90;
  display: flex;
}

.collaboration-sidebar.open {
  right: 0;
}

.toggle-button {
  position: absolute;
  left: -40px;
  top: 1rem;
  width: 40px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-right: none;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #374151;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Tabs navigation */
.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-button:hover {
  background: #f9fafb;
}

.tab-button.active {
  background: #f3f4f6;
  font-weight: 500;
}

.count {
  margin-left: 6px;
  padding: 2px 6px;
  background: #e5e7eb;
  border-radius: 12px;
  font-size: 12px;
}

/* Content area */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Loading and empty states */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #6b7280;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px dashed #e5e7eb;
}

/* Commit styles */
.commit-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.commit-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.commit-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.commit-header {
  margin-bottom: 0.75rem;
}

.commit-message {
  color: #111827;
  font-weight: 500;
  line-height: 1.4;
}

.commit-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
}

.commit-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.commit-sha {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: #4b5563;
  padding: 0.125rem 0.375rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Pull request styles */
.pr-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pr-actions-header {
  margin-bottom: 1rem;
}

.create-pr-button {
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-pr-button:hover {
  background: #e5e7eb;
}

.pr-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
}

.pr-item:hover {
  background: #f9fafb;
}

.pr-item.has-conflicts {
  border-color: #fca5a5;
  background: #fee2e2;
}

.pr-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.pr-number {
  color: #6b7280;
  font-size: 0.875rem;
}

.pr-title {
  color: #111827;
  font-weight: 500;
}

.pr-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.pr-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  background: #f3f4f6;
}

.pr-status.clean {
  background: #dcfce7;
  color: #166534;
}

.pr-status.dirty {
  background: #fee2e2;
  color: #991b1b;
}

.pr-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

/* Branch styles */
.branch-controls {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.branch-select-wrapper {
  margin-bottom: 1rem;
}

.branch-select-wrapper label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-size: 14px;
}

.branch-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
}

.create-branch-button {
  width: 100%;
  padding: 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-branch-button:hover {
  background: #e5e7eb;
}

.new-branch-form {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 4px;
}

.branch-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  font-size: 14px;
}

.branch-actions {
  display: flex;
  gap: 0.5rem;
}

.branch-actions button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-button {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.create-button:hover:not(:disabled) {
  background: #e5e7eb;
}

.create-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-button {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.cancel-button:hover {
  background: #f9fafb;
}

/* Saves styles */
.saves-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.save-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;
}

.save-item:hover {
  background: #f9fafb;
}

.save-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.save-timestamp {
  color: #111827;
  font-weight: 500;
  font-size: 0.875rem;
}

.save-branch {
  color: #6b7280;
  font-size: 0.75rem;
}

.save-actions {
  display: flex;
  gap: 0.5rem;
}

/* Common action buttons */
.action-button {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #f9fafb;
}

.action-button.delete {
  border-color: #fca5a5;
  color: #991b1b;
}

.action-button.delete:hover {
  background: #fee2e2;
}

.action-button.resolve {
  background: #f3f4f6;
  border-color: #e5e7eb;
  color: #374151;
}

.action-button.resolve:hover {
  background: #e5e7eb;
}

/* Login prompt */
.login-prompt {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px dashed #e5e7eb;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .collaboration-sidebar {
    width: 100%;
    right: -100%;
  }

  .toggle-button {
    width: 48px;
    height: 48px;
    left: -48px;
  }

  .tab-content {
    padding: 0.75rem;
  }

  .commit-meta,
  .pr-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .commit-item,
  .pr-item,
  .save-item {
    padding: 0.75rem;
  }

  .branch-controls,
  .new-branch-form {
    padding: 0.75rem;
  }
}
</style>
