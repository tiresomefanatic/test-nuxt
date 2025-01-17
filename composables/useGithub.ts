// useGithub.ts
import { Octokit } from "@octokit/rest";
import { useRuntimeConfig, navigateTo, useState } from "#app";
import { ref, onMounted, computed } from "vue";

// Define interfaces for all GitHub-related data structures
export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  id: number;
}

export interface PullRequest {
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
  base: {
    ref: string;
  };
  head: {
    ref: string;
  };
}

export interface Commit {
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

// Main composable function for GitHub functionality
export const useGithub = () => {
  // Initialize runtime configuration and state
  const config = useRuntimeConfig();
  const user = ref<GitHubUser | null>(null);
  const loading = ref(false);
  // Make currentBranch persistent
  const currentBranch = useState<string>("github-current-branch", () => "main");
  const branches = ref<string[]>([]);

  // Initialize Octokit with stored token if available
  const octokit = new Octokit({
    auth: process.client ? localStorage.getItem("github_token") : undefined,
  });

  // Handle GitHub OAuth login
  const initiateLogin = () => {
    if (!process.client) return;

    const params = new URLSearchParams({
      client_id: config.public.githubClientId,
      redirect_uri: `${config.public.siteUrl}/auth/callback`,
      scope: "user repo",
      response_type: "code",
      allow_signup: "true",
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  };

  // Handle user logout
  const handleLogout = () => {
    if (!process.client) return;
    localStorage.removeItem("github_token");
    user.value = null;
  };

  // Check if user is logged in
  const isLoggedIn = computed(() => {
    if (!process.client) return false;
    return !!localStorage.getItem("github_token");
  });

  // Fetch authenticated user data
  const fetchUserData = async (): Promise<GitHubUser | null> => {
    if (!process.client) return null;

    const token = localStorage.getItem("github_token");
    if (!token) return null;

    loading.value = true;
    try {
      const { data } = await octokit.rest.users.getAuthenticated();
      user.value = data as GitHubUser;
      return data as GitHubUser;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Fetch branches with improved error handling and logging
  const fetchBranches = async () => {
    if (!isLoggedIn.value) {
      console.log("Not logged in, skipping branch fetch");
      return [];
    }

    try {
      console.log("Fetching branches...");
      const { data } = await octokit.rest.repos.listBranches({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
      });

      const branchNames = data.map((branch) => branch.name);
      console.log("Fetched branches:", branchNames);

      // Update the branches ref
      branches.value = branchNames;

      // Verify current branch exists, if not switch to main
      if (!branchNames.includes(currentBranch.value)) {
        console.log(
          `Current branch ${currentBranch.value} not found, switching to main`
        );
        currentBranch.value = "main";
      }

      return data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      // Initialize with at least 'main' branch if fetch fails
      branches.value = ["main"];
      throw error;
    }
  };

  // Switch branch with improved error handling
  const switchBranch = async (branchName: string) => {
    if (!isLoggedIn.value) {
      console.log("Not logged in, cannot switch branches");
      return false;
    }

    try {
      console.log(`Switching to branch: ${branchName}`);

      // Verify branch exists
      const { data } = await octokit.rest.repos.getBranch({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        branch: branchName,
      });

      if (data) {
        currentBranch.value = branchName;
        console.log(
          `Successfully switched to branch: ${branchName}, currentBranch is now: ${currentBranch.value}`
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error switching to branch ${branchName}:`, error);
      return false;
    }
  };

  // Create a new branch
  const createBranch = async (branchName: string) => {
    if (!isLoggedIn.value) return null;

    try {
      console.log(
        `Creating new branch: ${branchName} from ${currentBranch.value}`
      );

      // Get current branch's latest commit
      const { data: currentRef } = await octokit.rest.git.getRef({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        ref: `heads/${currentBranch.value}`,
      });

      // Create new branch from current branch
      await octokit.rest.git.createRef({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        ref: `refs/heads/${branchName}`,
        sha: currentRef.object.sha,
      });

      console.log(`Created branch ${branchName}, fetching updated branch list`);
      await fetchBranches();

      // Switch to new branch
      console.log(`Switching to new branch: ${branchName}`);
      currentBranch.value = branchName;

      return true;
    } catch (error) {
      console.error("Error creating branch:", error);
      return null;
    }
  };

  // Get raw content with improved caching and error handling
  const getRawContent = async (
    owner: string,
    repo: string,
    path: string,
    branch?: string
  ) => {
    try {
      const targetBranch = branch || currentBranch.value;

      // Add timestamp to bypass cache
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${targetBranch}/${path}?t=${Date.now()}`;

      console.log("Fetching content from URL:", url);

      const response = await fetch(url);

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        if (response.status === 404) {
          console.log("File not found, returning empty content");
          return "";
        }
        throw new Error(`Failed to fetch content: ${response.statusText}`);
      }

      const content = await response.text();

      // Log content details
      console.log("Content fetched:", {
        length: content.length,
        timestamp: new Date().toISOString(),
      });

      return content;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  };

  // Save file content with improved error handling
  const saveFileContent = async (
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string,
    force?: boolean,
    sha?: string | null
  ) => {
    if (!isLoggedIn.value) {
      throw new Error("Authentication required to save content");
    }

    // Use provided branch or current branch
    const targetBranch = branch || currentBranch.value;
    console.log(
      `Saving to branch: ${targetBranch}, currentBranch is: ${currentBranch.value}`
    );

    try {
      // First verify branch exists
      await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch: targetBranch,
      });

      let fileSha = sha;

      // If no SHA provided and not forcing, try to get current file's SHA
      if (!force && !fileSha) {
        try {
          const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref: targetBranch,
          });

          if ("sha" in data) {
            fileSha = data.sha;
            console.log(
              `Found existing file in branch ${targetBranch}, sha: ${fileSha}`
            );
          }
        } catch (error) {
          if (error.status !== 404) {
            throw error;
          }
          console.log(
            `No existing file found in branch ${targetBranch}, creating new file`
          );
        }
      }

      // Prepare create/update params
      const updateParams = {
        owner,
        repo,
        path,
        message: `${message} [branch: ${targetBranch}]`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: targetBranch,
        sha: !force && fileSha ? fileSha : undefined,
      };

      // Create or update the file
      const result = await octokit.rest.repos.createOrUpdateFileContents(
        updateParams
      );

      console.log(`Successfully saved to branch: ${targetBranch}`);
      return result.data;
    } catch (error) {
      // Log detailed error information
      console.error(`Error saving to branch ${targetBranch}:`, {
        status: error.status,
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  };

  // Get list of pull requests
  const fetchPullRequests = async () => {
    if (!isLoggedIn.value) return [];

    try {
      const { data } = await octokit.rest.pulls.list({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        state: "open",
      });

      const detailedPRs = await Promise.all(
        data.map(async (pr) => {
          const { data: prDetails } = await octokit.rest.pulls.get({
            owner: "tiresomefanatic",
            repo: "test-nuxt",
            pull_number: pr.number,
          });
          return prDetails;
        })
      );

      return detailedPRs as PullRequest[];
    } catch (error) {
      console.error("Error fetching pull requests:", error);
      return [];
    }
  };

  // Get list of commits
  const fetchCommits = async () => {
    if (!isLoggedIn.value) return [];

    try {
      const { data } = await octokit.rest.repos.listCommits({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        per_page: 10,
      });

      return data as Commit[];
    } catch (error) {
      console.error("Error fetching commits:", error);
      return [];
    }
  };

  // Create a new pull request
  const createNewPullRequest = async (
    base: string,
    head: string,
    title: string,
    body: string
  ) => {
    if (!isLoggedIn.value) return null;

    try {
      // Validate both branches exist
      try {
        await octokit.rest.repos.getBranch({
          owner: "tiresomefanatic",
          repo: "test-nuxt",
          branch: base,
        });
        await octokit.rest.repos.getBranch({
          owner: "tiresomefanatic",
          repo: "test-nuxt",
          branch: head,
        });
      } catch (error) {
        console.error("Branch validation failed:", error);
        throw new Error(`One or both branches (${base}, ${head}) do not exist`);
      }

      const { data } = await octokit.rest.pulls.create({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        base,
        head,
        title,
        body,
      });
      return data;
    } catch (error) {
      console.error("Error creating pull request:", error);
      throw error;
    }
  };

  // Resolve merge conflicts
  const resolveConflictInFile = async (
    prNumber: number,
    filePath: string,
    resolution: "ours" | "theirs"
  ) => {
    if (!isLoggedIn.value) return null;

    try {
      const { data: pr } = await octokit.rest.pulls.get({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        pull_number: prNumber,
      });

      const resolutionBranch = `conflict-resolution-${prNumber}-${Date.now()}`;

      await createBranch(resolutionBranch);

      // Get content based on resolution choice
      let content;
      if (resolution === "ours") {
        content = await getRawContent(
          "tiresomefanatic",
          "test-nuxt",
          filePath,
          pr.base.ref
        );
      } else {
        content = await getRawContent(
          "tiresomefanatic",
          "test-nuxt",
          filePath,
          pr.head.ref
        );
      }

      if (!content) {
        throw new Error("Could not get file content");
      }

      await saveFileContent(
        "tiresomefanatic",
        "test-nuxt",
        filePath,
        content,
        `Resolve conflict in ${filePath} using ${resolution} changes`,
        resolutionBranch
      );

      return true;
    } catch (error) {
      console.error("Error resolving conflict:", error);
      return null;
    }
  };

  // Initial setup
  if (process.client) {
    // Fetch user data on initialization if logged in
    if (isLoggedIn.value) {
      fetchUserData();
      fetchBranches();
    }
  }

  // Return the composable API
  return {
    user,
    loading,
    currentBranch,
    branches,
    login: initiateLogin,
    logout: handleLogout,
    isLoggedIn,
    getRawContent,
    saveFileContent,
    getPullRequests: fetchPullRequests,
    getCommits: fetchCommits,
    resolveConflict: resolveConflictInFile,
    fetchBranches,
    createBranch,
    switchBranch,
    createNewPullRequest,
  };
};
