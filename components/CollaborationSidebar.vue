<template>
  <div class="collaboration-sidebar" :class="{ open }">
    <!-- Toggle button -->
    <button class="toggle-button" @click="toggleSidebar">
      <svg class="icon" viewBox="0 0 24 24" width="24" height="24">
        <path
          v-if="!open"
          fill="currentColor"
          d="M21 15.75c0-.414-.336-.75-.75-.75H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 .75-.75ZM21 12c0-.414-.336-.75-.75-.75H3.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 .75-.75ZM3.75 9h16.5a.75.75 0 0 0 0-1.5H3.75a.75.75 0 0 0 0 1.5Z"
        />
        <path
          v-else
          fill="currentColor"
          d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.75.75 0 1 1 1.06 1.06L13.06 12l5.22 5.22a.75.75 0 1 1-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 0 1-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z"
        />
      </svg>
    </button>

    <div class="sidebar-content">
      <!-- Navigation tabs -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.count" class="count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Pull Requests Tab -->
      <div v-if="activeTab === 'prs'" class="tab-content">
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

        <div v-else-if="loading" class="loading">
          <div class="spinner"></div>
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
              <button class="action-button view" @click="openPR(pr.html_url)">
                View on GitHub
              </button>
              <button
                v-if="pr.mergeable === false"
                class="action-button resolve"
                @click="resolveConflicts(pr)"
              >
                Resolve Conflicts
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- History Tab -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          Loading commit history...
        </div>
        <div v-else-if="commits.length === 0" class="empty-state">
          No commit history available
        </div>
        <div v-else class="commit-list">
          <div v-for="commit in commits" :key="commit.sha" class="commit-item">
            <div class="commit-header">
              <span class="commit-message">{{ commit.commit.message }}</span>
            </div>
            <div class="commit-meta">
              <span class="commit-author">
                <img
                  v-if="commit.author?.avatar_url"
                  :src="commit.author.avatar_url"
                  :alt="commit.commit.author.name"
                  class="author-avatar"
                />
                {{ commit.commit.author.name }}
              </span>
              <span class="commit-date">
                {{ formatDate(commit.commit.author.date) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Conflicts Tab -->
      <div v-if="activeTab === 'conflicts'" class="tab-content">
        <div v-if="currentConflict" class="conflict-resolver">
          <div class="conflict-header">
            <h3>Resolve Conflicts</h3>
            <p>Choose which changes to keep for {{ currentConflict.file }}</p>
          </div>
          <div class="conflict-diff">
            <div class="diff-header">
              <button
                class="diff-button"
                :class="{ active: selectedVersion === 'current' }"
                @click="selectedVersion = 'current'"
              >
                Current Changes
              </button>
              <button
                class="diff-button"
                :class="{ active: selectedVersion === 'incoming' }"
                @click="selectedVersion = 'incoming'"
              >
                Incoming Changes
              </button>
            </div>
            <div class="diff-content">
              <pre
                v-if="selectedVersion === 'current'"
                class="diff-view current"
              >
                {{ currentConflict.current }}
              </pre>
              <pre v-else class="diff-view incoming">
                {{ currentConflict.incoming }}
              </pre>
            </div>
          </div>
          <div class="conflict-actions">
            <button
              class="action-button cancel"
              @click="cancelConflictResolution"
            >
              Cancel
            </button>
            <button class="action-button resolve" @click="resolveConflict">
              Accept
              {{ selectedVersion === "current" ? "Current" : "Incoming" }}
              Changes
            </button>
          </div>
        </div>
        <div v-else class="empty-state">No conflicts to resolve</div>
      </div>

      <!-- Branch Management Tab -->
      <div v-if="activeTab === 'branches'" class="tab-content">
        <div class="section">
          <h3>Branch Management</h3>
          <div v-if="isLoggedIn" class="branch-controls">
            <div class="branch-controls">
              <div class="current-branch">
                <span class="label">Current Branch:</span>
                <select :value="currentBranch" @change="handleBranchChange">
                  <option
                    v-for="branch in branches"
                    :key="branch"
                    :value="branch"
                  >
                    {{ branch }}
                  </option>
                </select>
              </div>
              <div class="new-branch">
                <input
                  v-model="newBranchName"
                  placeholder="New branch name"
                  @keyup.enter="createNewBranch"
                />
                <button
                  class="create-branch"
                  :disabled="!newBranchName || loading"
                  @click="createNewBranch"
                >
                  Create Branch
                </button>
              </div>
            </div>
          </div>
          <div v-else class="login-prompt">
            <p>Please log in to manage branches</p>
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
import CreatePullRequest from "./CreatePullRequest.vue";

// Define TypeScript interfaces for our data structures
interface GitHubUser {
  login: string;
  avatar_url: string;
  name?: string;
}

interface PullRequest {
  number: number;
  title: string;
  user: GitHubUser;
  html_url: string;
  mergeable: boolean;
  mergeable_state: string;
  files?: Array<{
    filename: string;
    patch?: string;
  }>;
}

interface Commit {
  sha: string;
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

interface Conflict {
  file: string;
  current: string;
  incoming: string;
  pr: PullRequest;
}

// Component state management
const open = ref(false);
const activeTab = ref("branches");
const loading = ref(false);
const pullRequests = ref<PullRequest[]>([]);
const commits = ref<Commit[]>([]);
const currentConflict = ref<Conflict | null>(null);
const selectedVersion = ref<"current" | "incoming">("current");
const newBranchName = ref("");
const showCreatePR = ref(false);

// Initialize composables
const { showToast } = useToast();
const {
  getPullRequests,
  getCommits,
  resolveConflict: resolveGitHubConflict,
  fetchBranches,
  createBranch,
  switchBranch,
  currentBranch,
  branches,
  isLoggedIn,
} = useGithub();

// Computed properties for navigation tabs
const tabs = computed(() => [
  {
    id: "prs",
    label: "Pull Requests",
    count: pullRequests.value.length,
  },
  {
    id: "history",
    label: "History",
    count: commits.value.length,
  },
  {
    id: "conflicts",
    label: "Conflicts",
    count: pullRequests.value.filter((pr) => pr.mergeable === false).length,
  },
  {
    id: "branches",
    label: "Branches",
    count: branches.value.length,
  },
]);

// Watch for login state changes
watch(isLoggedIn, async (newValue) => {
  if (newValue) {
    await fetchBranches();
  }
});

// Utility function to format dates consistently
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Get the status text for a pull request based on its mergeable state
const getPRStatus = (pr: PullRequest): string => {
  if (pr.mergeable === false) return "Has Conflicts";
  if (pr.mergeable === true) return "Ready to Merge";
  return "Checking";
};

// Toggle sidebar visibility
const toggleSidebar = () => {
  open.value = !open.value;
};

// Handle external link clicks
const openPR = (url: string) => {
  window.open(url, "_blank");
};

// Handle PR creation success
const handlePRCreated = async () => {
  showCreatePR.value = false;
  await loadPullRequests();
};

// Conflict resolution handling
const resolveConflicts = (pr: PullRequest) => {
  if (!pr.files?.[0]) {
    showToast("No files found in pull request", "error");
    return;
  }

  currentConflict.value = {
    file: pr.files[0].filename,
    current: pr.files[0].patch || "",
    incoming: pr.files[0].patch || "",
    pr,
  };
  activeTab.value = "conflicts";
};

const resolveConflict = async () => {
  if (!currentConflict.value) return;

  loading.value = true;
  try {
    await resolveGitHubConflict(
      currentConflict.value.pr.number,
      currentConflict.value.file,
      selectedVersion.value === "current" ? "ours" : "theirs"
    );

    showToast("Conflict resolved successfully!", "success");
    currentConflict.value = null;
    await loadPullRequests(); // Refresh PR list
  } catch (error) {
    console.error("Error resolving conflict:", error);
    showToast("Failed to resolve conflict. Please try again.", "error");
  } finally {
    loading.value = false;
  }
};

const cancelConflictResolution = () => {
  currentConflict.value = null;
  selectedVersion.value = "current";
};

// Data loading functions
const loadPullRequests = async () => {
  loading.value = true;
  try {
    const prs = await getPullRequests();
    pullRequests.value = prs;
  } catch (error) {
    console.error("Error loading pull requests:", error);
    showToast("Failed to load pull requests", "error");
  } finally {
    loading.value = false;
  }
};

const loadCommits = async () => {
  loading.value = true;
  try {
    const commitHistory = await getCommits();
    commits.value = commitHistory;
  } catch (error) {
    console.error("Error loading commits:", error);
    showToast("Failed to load commits", "error");
  } finally {
    loading.value = false;
  }
};

// Initialize data when component mounts
onMounted(async () => {
  if (isLoggedIn.value) {
    loading.value = true;
    try {
      await Promise.all([loadPullRequests(), loadCommits(), fetchBranches()]);
    } finally {
      loading.value = false;
    }
  }
});

// Handle branch switching
const handleBranchChange = async (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const branchName = select.value;

  try {
    loading.value = true;
    console.log(`Attempting to switch to branch: ${branchName}`);
    const success = await switchBranch(branchName);

    if (success) {
      showToast({
        title: "Success",
        message: `Switched to branch: ${branchName}`,
        type: "success",
      });
      await fetchBranches(); // Refresh branch list
    } else {
      throw new Error("Failed to switch branch");
    }
  } catch (error) {
    console.error("Error switching branch:", error);
    showToast({
      title: "Error",
      message:
        error instanceof Error ? error.message : "Failed to switch branch",
      type: "error",
    });
    // Reset selection on error
    select.value = currentBranch.value;
  } finally {
    loading.value = false;
  }
};

// Create new branch
const createNewBranch = async () => {
  if (!newBranchName.value) return;

  try {
    loading.value = true;
    console.log(`Creating new branch: ${newBranchName.value}`);
    const result = await createBranch(newBranchName.value);

    if (result) {
      showToast({
        title: "Success",
        message: `Created and switched to branch: ${newBranchName.value}`,
        type: "success",
      });
      await fetchBranches(); // Refresh branch list
      newBranchName.value = ""; // Clear input
    } else {
      throw new Error("Failed to create branch");
    }
  } catch (error) {
    console.error("Error creating branch:", error);
    showToast({
      title: "Error",
      message:
        error instanceof Error ? error.message : "Failed to create branch",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.collaboration-sidebar {
  position: fixed;
  top: 64px;
  right: -400px;
  width: 400px;
  height: calc(100vh - 64px);
  background: white;
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
  background: white;
  border: 1px solid #eee;
  border-right: none;
  border-radius: 0.5rem 0 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.toggle-button:hover {
  color: var(--echo-orange);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: none;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab-button.active {
  color: var(--echo-orange);
}

.tab-button.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--echo-orange);
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 0.5rem;
  background: #eee;
  border-radius: 10px;
  font-size: 0.75rem;
  color: #666;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.loading {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #666;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #eee;
  border-right-color: var(--echo-orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.pr-list,
.commit-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pr-item,
.commit-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  background: white;
}

.pr-item.has-conflicts {
  border-color: #fecaca;
  background: #fff5f5;
}

.pr-header,
.commit-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.pr-number {
  color: #666;
  font-size: 0.875rem;
}

.pr-title,
.commit-message {
  font-weight: 500;
  color: #333;
}

.pr-meta,
.commit-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.pr-author,
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

.pr-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.pr-status.clean {
  background: #dcfce7;
  color: #166534;
}

.pr-status.unstable {
  background: #fef9c3;
  color: #854d0e;
}

.pr-status.dirty {
  background: #fecaca;
  color: #991b1b;
}

.pr-actions,
.commit-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 0.25rem;
  background: white;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  border-color: var(--echo-orange);
  color: var(--echo-orange);
}

.action-button.resolve {
  background: var(--echo-orange);
  color: white;
  border-color: var(--echo-orange);
}

.action-button.resolve:hover {
  background: white;
}

.conflict-resolver {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.conflict-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.conflict-diff {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.diff-header {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
}

.diff-button {
  padding: 0.5rem 1rem;
  border: 1px solid #eee;
  border-radius: 0.25rem;
  background: white;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.diff-button.active {
  background: var(--echo-orange);
  color: white;
  border-color: var(--echo-orange);
}

.diff-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.diff-view {
  margin: 0;
  font-family: "Monaco", monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.diff-view.current {
  color: #059669;
}

.diff-view.incoming {
  color: #2563eb;
}

.conflict-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.section {
  margin-bottom: 2rem;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #343a40;
}

.branch-controls {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #000;
}

.current-branch {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.current-branch .label {
  color: #000;
  font-weight: 500;
}

.current-branch select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  color: #000;
  font-size: 14px;
}

.new-branch {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.new-branch input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  color: #000;
  font-size: 14px;
}

.create-branch {
  padding: 0.5rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.create-branch:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-branch:hover:not(:disabled) {
  background: #333;
}

.loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #000;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ccc;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.section h3 {
  color: #000;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0 1rem;
}

.login-prompt {
  color: #6c757d;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
  background: #e9ecef;
  border-radius: 4px;
}

.pr-actions-header {
  margin-bottom: 1rem;
  padding: 0 0 1rem;
  border-bottom: 1px solid #eee;
}

.create-pr-button {
  padding: 0.5rem 1rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.create-pr-button:hover {
  background: #1a1a1a;
}
</style>
