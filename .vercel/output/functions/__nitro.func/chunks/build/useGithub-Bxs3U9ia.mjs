import { Octokit } from '@octokit/rest';
import { ref, computed } from 'vue';
import { e as useState } from './server.mjs';

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
  const createNewBranch = async (owner, repo, base, newBranch) => {
    if (!isLoggedIn.value) return null;
    try {
      const { data: ref2 } = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${base}`
      });
      await octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha: ref2.object.sha
      });
      return true;
    } catch (error) {
      console.error("Error creating branch:", error);
      return null;
    }
  };
  const createNewPullRequest = async (owner, repo, base, head, title, body) => {
    if (!isLoggedIn.value) return null;
    try {
      const { data } = await octokit.rest.pulls.create({
        owner,
        repo,
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
  const saveFileContent = async (owner, repo, path, content, message, branch) => {
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
      let sha;
      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path,
          ref: targetBranch
        });
        if ("sha" in data) {
          sha = data.sha;
          console.log(
            `Found existing file in branch ${targetBranch}, sha: ${sha}`
          );
        }
      } catch (error) {
        console.log(
          `No existing file found in branch ${targetBranch}, creating new file`
        );
      }
      const result = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message: `${message} [branch: ${targetBranch}]`,
        content: btoa(unescape(encodeURIComponent(content))),
        branch: targetBranch,
        sha
      });
      console.log(`Successfully saved to branch: ${targetBranch}`);
      return result.data;
    } catch (error) {
      console.error(`Error saving to branch ${targetBranch}:`, error);
      throw error;
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
  const fetchFileContent = async (owner, repo, path, ref2) => {
    if (!isLoggedIn.value) return null;
    const targetRef = ref2 || currentBranch.value;
    try {
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          repo,
          path,
          ref: targetRef,
          headers: {
            Accept: "application/vnd.github.raw+json",
            "X-GitHub-Api-Version": "2022-11-28"
          }
        }
      );
      return data;
    } catch (error) {
      console.error("Error getting file content:", error);
      return null;
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
  const resolveConflictInFile = async (prNumber, filePath, resolution) => {
    if (!isLoggedIn.value) return null;
    try {
      const { data: pr } = await octokit.rest.pulls.get({
        owner: "tiresomefanatic",
        repo: "test-nuxt",
        pull_number: prNumber
      });
      const resolutionBranch = `conflict-resolution-${prNumber}-${Date.now()}`;
      await createNewBranch(
        "tiresomefanatic",
        "test-nuxt",
        pr.base.ref,
        resolutionBranch
      );
      const content = resolution === "ours" ? await fetchFileContent(
        "tiresomefanatic",
        "test-nuxt",
        filePath,
        pr.base.ref
      ) : await fetchFileContent(
        "tiresomefanatic",
        "test-nuxt",
        filePath,
        pr.head.ref
      );
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
  const fetchBranches = async () => {
    if (!isLoggedIn.value) return [];
    try {
      console.log("Fetching branches...");
      const { data } = await octokit.rest.repos.listBranches({
        owner: "tiresomefanatic",
        repo: "test-nuxt"
      });
      console.log(
        "Fetched branches:",
        data.map((b) => b.name)
      );
      branches.value = data.map((branch) => branch.name);
      if (!branches.value.includes(currentBranch.value)) {
        console.log(
          `Current branch ${currentBranch.value} not found, switching to main`
        );
        currentBranch.value = "main";
      }
      return data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      return [];
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
  const switchBranch = async (branchName) => {
    if (!isLoggedIn.value) return false;
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
//# sourceMappingURL=useGithub-Bxs3U9ia.mjs.map
