import { Octokit } from '@octokit/rest';
import { ref, computed } from 'vue';
import { f as useState } from './server.mjs';

const useGithub = () => {
  const user = ref(null);
  const loading = ref(false);
  const currentBranch = useState("github-current-branch", () => "main");
  const branches = ref([]);
  const octokit = new Octokit({
    auth: undefined
  });
  const initiateLogin = () => {
    return;
  };
  const handleLogout = () => {
    return;
  };
  const isLoggedIn = computed(() => {
    return false;
  });
  const fetchBranches = async () => {
    if (!isLoggedIn.value) {
      console.log("Not logged in, skipping branch fetch");
      return [];
    }
    try {
      console.log("Fetching branches...");
      const { data } = await octokit.rest.repos.listBranches({
        owner: "tiresomefanatic",
        repo: "test-nuxt"
      });
      const branchNames = data.map((branch) => branch.name);
      console.log("Fetched branches:", branchNames);
      branches.value = branchNames;
      if (!branchNames.includes(currentBranch.value)) {
        console.log(
          `Current branch ${currentBranch.value} not found, switching to main`
        );
        currentBranch.value = "main";
      }
      return data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      branches.value = ["main"];
      throw error;
    }
  };
  const switchBranch = async (branchName) => {
    if (!isLoggedIn.value) {
      console.log("Not logged in, cannot switch branches");
      return false;
    }
    try {
      console.log(`Switching to branch: ${branchName}`);
      const { data } = await octokit.rest.repos.getBranch({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        branch: branchName
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
  const createBranch = async (branchName) => {
    if (!isLoggedIn.value) return null;
    try {
      console.log(
        `Creating new branch: ${branchName} from ${currentBranch.value}`
      );
      const { data: currentRef } = await octokit.rest.git.getRef({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        ref: `heads/${currentBranch.value}`
      });
      await octokit.rest.git.createRef({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        ref: `refs/heads/${branchName}`,
        sha: currentRef.object.sha
      });
      console.log(`Created branch ${branchName}, fetching updated branch list`);
      await fetchBranches();
      console.log(`Switching to new branch: ${branchName}`);
      currentBranch.value = branchName;
      return true;
    } catch (error) {
      console.error("Error creating branch:", error);
      return null;
    }
  };
  const getRawContent = async (owner, repo, path, branch) => {
    try {
      const targetBranch = branch || currentBranch.value;
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
      console.log("Content fetched:", {
        length: content.length,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return content;
    } catch (error) {
      console.error("Error fetching content:", error);
      throw error;
    }
  };
  const saveFileContent = async (owner, repo, path, content, message, branch, force, sha) => {
    var _a;
    if (!isLoggedIn.value) {
      throw new Error("Authentication required to save content");
    }
    const targetBranch = branch || currentBranch.value;
    console.log(
      `Saving to branch: ${targetBranch}, currentBranch is: ${currentBranch.value}`
    );
    try {
      await octokit.rest.repos.getBranch({
        owner,
        repo,
        branch: targetBranch
      });
      let fileSha = sha;
      if (!force && !fileSha) {
        try {
          const { data } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path,
            ref: targetBranch
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
      const updateParams = {
        owner,
        repo,
        path,
        message: `${message} [branch: ${targetBranch}]`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: targetBranch,
        sha: !force && fileSha ? fileSha : void 0
      };
      const result = await octokit.rest.repos.createOrUpdateFileContents(
        updateParams
      );
      console.log(`Successfully saved to branch: ${targetBranch}`);
      return result.data;
    } catch (error) {
      console.error(`Error saving to branch ${targetBranch}:`, {
        status: error.status,
        message: error.message,
        response: (_a = error.response) == null ? undefined : _a.data
      });
      throw error;
    }
  };
  const fetchPullRequests = async () => {
    if (!isLoggedIn.value) return [];
    try {
      const { data } = await octokit.rest.pulls.list({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        state: "open"
      });
      const detailedPRs = await Promise.all(
        data.map(async (pr) => {
          const { data: prDetails } = await octokit.rest.pulls.get({
            owner: "tiresomefanatic",
            repo: "test-nuxt",
            pull_number: pr.number
          });
          return prDetails;
        })
      );
      return detailedPRs;
    } catch (error) {
      console.error("Error fetching pull requests:", error);
      return [];
    }
  };
  const fetchCommits = async () => {
    if (!isLoggedIn.value) return [];
    try {
      const { data } = await octokit.rest.repos.listCommits({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        per_page: 10
      });
      return data;
    } catch (error) {
      console.error("Error fetching commits:", error);
      return [];
    }
  };
  const createNewPullRequest = async (base, head, title, body) => {
    if (!isLoggedIn.value) return null;
    try {
      const { data } = await octokit.rest.pulls.create({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        base,
        head,
        title,
        body
      });
      return data;
    } catch (error) {
      console.error("Error creating pull request:", error);
      return null;
    }
  };
  const resolveConflictInFile = async (prNumber, filePath, resolution) => {
    if (!isLoggedIn.value) return null;
    try {
      const { data: pr } = await octokit.rest.pulls.get({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        pull_number: prNumber
      });
      const resolutionBranch = `conflict-resolution-${prNumber}-${Date.now()}`;
      await createBranch(resolutionBranch);
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
    createNewPullRequest
  };
};

export { useGithub as u };
//# sourceMappingURL=useGithub-BP8ohDRV.mjs.map
