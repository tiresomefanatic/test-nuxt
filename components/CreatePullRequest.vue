# CreatePullRequest.vue
<template>
  <div class="create-pr-form">
    <h3 class="form-title">Create Pull Request</h3>

    <div class="form-group">
      <label for="base">Base Branch</label>
      <select
        id="base"
        v-model="baseBranch"
        class="form-select"
        :disabled="loading"
      >
        <option value="">Select base branch</option>
        <option v-for="branch in props.branches" :key="branch" :value="branch">
          {{ branch }}
        </option>
      </select>
      <span class="helper-text" v-if="!baseBranch"
        >This is the branch where changes will be merged into</span
      >
    </div>

    <div class="form-group">
      <label for="head">Source Branch</label>
      <select
        id="head"
        v-model="headBranch"
        class="form-select"
        :disabled="loading"
      >
        <option value="">Select source branch</option>
        <option v-for="branch in props.branches" :key="branch" :value="branch">
          {{ branch }}
        </option>
      </select>
      <span class="helper-text" v-if="!headBranch"
        >This is the branch containing your changes</span
      >
    </div>

    <div class="form-group">
      <label for="title">Title</label>
      <input
        id="title"
        v-model="title"
        type="text"
        class="form-input"
        placeholder="Enter PR title"
        :disabled="loading"
      />
      <span class="validation-error" v-if="showValidation && !title.trim()">
        Title is required
      </span>
    </div>

    <div class="form-group">
      <label for="description">Description</label>
      <textarea
        id="description"
        v-model="description"
        class="form-textarea"
        placeholder="Enter PR description"
        rows="4"
        :disabled="loading"
      ></textarea>
    </div>

    <div class="validation-summary" v-if="showValidation && !isValid">
      <p>Please fix the following issues:</p>
      <ul>
        <li v-if="!baseBranch">Select a base branch</li>
        <li v-if="!headBranch">Select a source branch</li>
        <li v-if="baseBranch === headBranch && baseBranch">
          Base and source branches must be different
        </li>
        <li v-if="!title.trim()">Enter a title for the pull request</li>
      </ul>
    </div>

    <div class="form-actions">
      <button
        class="cancel-button"
        @click="$emit('cancel')"
        :disabled="loading"
      >
        Cancel
      </button>
      <button
        class="submit-button"
        @click="handleSubmit"
        :disabled="!isValid || loading"
      >
        {{ loading ? "Creating..." : "Create Pull Request" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";

// Define props
const props = defineProps<{
  branches: string[];
  currentBranch: string;
}>();

const { createNewPullRequest } = useGithub();
const { showToast } = useToast();

const emit = defineEmits<{
  (e: "created"): void;
  (e: "cancel"): void;
}>();

// Form state
const loading = ref(false);
const baseBranch = ref("main");
const headBranch = ref("");
const title = ref("");
const description = ref("");
const showValidation = ref(false);

// Initialize with current branch
onMounted(() => {
  headBranch.value = props.currentBranch;
});

// Computed properties
const isValid = computed(() => {
  return (
    baseBranch.value &&
    headBranch.value &&
    title.value.trim() &&
    baseBranch.value !== headBranch.value
  );
});

// Form submission
const handleSubmit = async () => {
  showValidation.value = true;

  if (!isValid.value || loading.value) return;

  loading.value = true;
  try {
    const result = await createNewPullRequest(
      "tiresomefanatic",
      "test-nuxt",
      baseBranch.value,
      headBranch.value,
      title.value,
      description.value
    );

    if (result) {
      showToast({
        title: "Success",
        message: "Pull request created successfully",
        type: "success",
      });
      emit("created");
    } else {
      throw new Error("Failed to create pull request");
    }
  } catch (error) {
    console.error("Error creating pull request:", error);
    showToast({
      title: "Error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to create pull request",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.create-pr-form {
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #000;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #000;
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-select:hover,
.form-input:hover,
.form-textarea:hover {
  border-color: #d1d5db;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-select:disabled,
.form-input:disabled,
.form-textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.helper-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.validation-error {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #dc2626;
}

.validation-summary {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
}

.validation-summary p {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.validation-summary ul {
  margin: 0;
  padding-left: 1.5rem;
}

.validation-summary li {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.cancel-button,
.submit-button {
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.cancel-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.submit-button {
  background: #2563eb;
  border: 1px solid #2563eb;
  color: white;
}

.submit-button:hover:not(:disabled) {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
