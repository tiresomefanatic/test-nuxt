// composables/useToast.ts
import { ref } from "vue";

// Define interface for toast configuration
export interface ToastConfig {
  title?: string; // Optional title for more structured toasts
  message: string; // Main toast message
  type: "success" | "error" | "warning" | "info"; // Added more types for flexibility
  duration?: number; // Optional custom duration
}

// Define the internal toast object structure
interface Toast extends ToastConfig {
  id: number;
  created: Date;
}

// Create a reactive reference to store toasts
const toasts = ref<Toast[]>([]);
let nextId = 0;

export const useToast = () => {
  // Show toast can now accept either a string or a toast config
  const showToast = (
    configOrMessage: ToastConfig | string,
    type: "success" | "error" | "warning" | "info" = "success"
  ) => {
    // Create the toast object based on input type
    const toastConfig: ToastConfig =
      typeof configOrMessage === "string"
        ? { message: configOrMessage, type }
        : configOrMessage;

    // Create the full toast object
    const toast: Toast = {
      id: nextId++,
      created: new Date(),
      duration: 3000, // Default duration
      ...toastConfig,
    };

    // Add toast to the list
    toasts.value.push(toast);

    // Remove toast after duration
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);
  };

  // Helper function to remove a specific toast
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  // Allow manual removal of toasts
  const clearToasts = () => {
    toasts.value = [];
  };

  return {
    toasts,
    showToast,
    removeToast,
    clearToasts,
  };
};
