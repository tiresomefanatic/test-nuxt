import { ref } from 'vue';

const toasts = ref([]);
let nextId = 0;
const useToast = () => {
  const showToast = (configOrMessage, type = "success") => {
    const toastConfig = typeof configOrMessage === "string" ? { message: configOrMessage, type } : configOrMessage;
    const toast = {
      id: nextId++,
      created: /* @__PURE__ */ new Date(),
      duration: 3e3,
      // Default duration
      ...toastConfig
    };
    toasts.value.push(toast);
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);
  };
  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };
  const clearToasts = () => {
    toasts.value = [];
  };
  return {
    toasts,
    showToast,
    removeToast,
    clearToasts
  };
};

export { useToast as u };
//# sourceMappingURL=useToast-CuZrFQgt.mjs.map
