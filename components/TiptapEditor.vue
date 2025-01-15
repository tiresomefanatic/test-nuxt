# TiptapEditor.vue
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import { Node } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import ColorWheelExtension from "../extensions/colorWheelExtension";
import CollaborationSidebar from "~/components/CollaborationSidebar.vue";
import { useGithub } from "~/composables/useGithub";
import { useToast } from "~/composables/useToast";
import { useNuxtApp } from "#app";
import AddContentDialog from "./AddContentDialog.vue";
import type { editor as MonacoEditor } from "monaco-editor";

interface Props {
  content?: string;
  filePath: string;
}

const handleInsertComponent = (componentId: string) => {
  if (!editor.value) return;

  switch (componentId) {
    case "colorwheel":
      editor.value
        .chain()
        .focus()
        .insertContent({
          type: "colorWheel",
        })
        .run();
      break;
  }
};

const templates = {
  "split-with-image": `
    <div style="display: flex; gap: 2rem; margin: 3rem 0;">
      <div style="flex: 1;">
        <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600; line-height: 1.4;">Section Title</h2>
      </div>
      <div style="flex: 2;">
        <div style="background: #f5f5f5; padding: 2rem; border-radius: 4px;">
          <img src="/api/placeholder/800/400" alt="Section Image" style="width: 100%; height: auto; display: block;" />
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 600; margin: 1rem 0;">Add Subtitle</h3>
        <p style="margin: 1rem 0; line-height: 1.6;">Add your description here.</p>
        <p style="margin: 1rem 0; line-height: 1.6;">Add additional details here.</p>
      </div>
    </div>
  `,
  "split-with-list": `
    <div style="display: flex; gap: 2rem; margin: 3rem 0;">
      <div style="flex: 1;">
        <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600; line-height: 1.4;">Section Title</h2>
      </div>
      <div style="flex: 2;">
        <img src="/api/placeholder/800/400" alt="Section Image" style="width: 100%; height: auto; display: block; padding: 2rem; border-radius: 4px;" />
        <p style="margin: 1rem 0; line-height: 1.6;">Add your description here.</p>
        <ul style="list-style: none; padding: 0; margin: 1rem 0;">
          <li style="margin: 0.5rem 0; line-height: 1.6;">List item one</li>
          <li style="margin: 0.5rem 0; line-height: 1.6;">List item two</li>
          <li style="margin: 0.5rem 0; line-height: 1.6;">List item three</li>
          <li style="margin: 0.5rem 0; line-height: 1.6;">List item four</li>
        </ul>
      </div>
    </div>
  `,
};

const handleInsertSection = (sectionId: string) => {
  if (!editor.value) return;

  const template = templates[sectionId];
  if (template) {
    editor.value
      .chain()
      .focus()
      .createParagraphNear()
      .insertContent(template)
      .focus()
      .run();
  }
};

// Node extensions with style support
const StyledDiv = Node.create({
  name: "styledDiv",
  group: "block",
  content: "block+",
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
      "data-type": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          if (!attributes["data-type"]) return {};
          return { "data-type": attributes["data-type"] };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "div" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },
});

const GridContainer = Node.create({
  name: "gridContainer",
  group: "block",
  content: "block+",
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "div",
        getAttrs: (node) => {
          const style = node.getAttribute("style") || "";
          return style.includes("grid") ? {} : false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },
});

const StyledParagraph = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

const StyledHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

const StyledImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:content", value: string): void;
  (e: "save", value: string): void;
  (e: "error", error: Error): void;
}>();

// State management
const localContent = ref("");
const originalContent = ref("");
const isSaving = ref(false);
const previewMode = ref(false);
const rawMode = ref(false);
const editor = ref<Editor | null>(null);
const editorInitialized = ref(false);
const previewContent = ref("");
const monacoEditor = ref<MonacoEditor.IStandaloneCodeEditor | null>(null);

// Initialize composables
const { showToast } = useToast();
const github = useGithub();
const { isLoggedIn } = github;

// Debug mode detection
const showDebugInfo = computed(() => {
  return process.env.NODE_ENV === "development";
});

/**
 * Helper function to normalize HTML content by handling HTML entities consistently
 */
const normalizeHTML = (html: string): string => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerHTML;
};

const formatHTML = (html: string): string => {
  if (!html) return "";

  html = html
    .replace(
      /<div[^>]*data-type="color-wheel"[^>]*>.*?<\/div>/g,
      "\n::color-wheel\n::\n"
    )
    .replace(
      /<div[^>]*data-type="test-component"[^>]*>.*?<\/div>/g,
      "\n::test-component\n::\n"
    );

  let formattedHTML = html
    .replace(/<strong>/g, "§§STRONG§§")
    .replace(/<\/strong>/g, "§§/STRONG§§")
    .replace(/<em>/g, "§§EM§§")
    .replace(/<\/em>/g, "§§/EM§§");

  formattedHTML = formattedHTML
    .replace(/></g, ">\n<")
    .replace(
      /(<div[^>]*>|<\/div>|<p>|<\/p>|<h[1-6]>|<\/h[1-6]>|<ul>|<\/ul>|<ol>|<\/ol>|<li>|<\/li>)/g,
      (match) => `\n${match}\n`
    )
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  formattedHTML = formattedHTML
    .replace(/§§STRONG§§/g, "<strong>")
    .replace(/§§\/STRONG§§/g, "</strong>")
    .replace(/§§EM§§/g, "<em>")
    .replace(/§§\/EM§§/g, "</em>");

  return formattedHTML.replace(/\n{3,}/g, "\n\n").trim();
};

const editorOptions = {
  theme: "vs-dark",
  language: "html",
  fontSize: 13,
  formatOnPaste: true,
  formatOnType: true,
  autoClosingTags: true,
  autoClosingBrackets: "always",
  autoIndent: "advanced",
  tabSize: 2,
  minimap: { enabled: true },
  wordWrap: "on",
  bracketPairColorization: { enabled: true },
  // Add these HTML-specific formatting options
  "editor.defaultFormatter": "vscode.html-language-features",
  "html.format.enable": true,
  "html.format.preserveNewLines": true,
  "html.format.maxPreserveNewLines": 2,
  "html.format.indentInnerHtml": true,
};

const CustomDocument = Document.extend({
  content: "block+",
});

const parseMarkdownToHTML = (content: string): string => {
  if (!content) return "";

  return content
    .replace(/::color-wheel\s*::/g, '<div data-type="color-wheel"></div>')
    .replace(
      /::test-component\s*::/g,
      '<div data-type="test-component"></div>'
    );
};

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({
        document: false,
        paragraph: false,
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      CustomDocument,
      StyledParagraph,
      StyledHeading,
      StyledImage.configure({
        inline: true,
      }),
      StyledDiv,
      GridContainer,
      ColorWheelExtension.configure({
        HTMLAttributes: {
          class: "color-wheel-node",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose-editor",
        spellcheck: "false",
      },
      transformPastedHTML: (html) => {
        return html;
      },
      handleDrop: false,
      handleClick: () => {
        // Prevent default click behavior that might cause unwanted selection
        return true;
      },
      handleKeyDown: ({ event }) => {
        // Allow default keyboard behavior but prevent unwanted selection
        if (event.key === "Tab") {
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      const content = ed.getHTML();
      if (content === localContent.value) return;

      // Capture cursor position
      const { from, to } = ed.state.selection;

      // Schedule content update
      setTimeout(() => {
        //const formattedContent = formatHTML(content);
        // localContent.value = formattedContent;
        // previewContent.value = formattedContent;
        // emit("update:content", formattedContent);

        localContent.value = content;
        previewContent.value = content;
        emit("update:content", content);

        // Restore cursor position after state updates
        if (editor.value) {
          editor.value.commands.setTextSelection({ from, to });
        }
      }, 0);
    },
    parseOptions: {
      preserveWhitespace: "full",
    },
  });

  if (props.content) {
    const parsedContent = parseMarkdownToHTML(props.content);
    //const formattedContent = formatHTML(parsedContent);
    editor.value.commands.setContent(parsedContent, false, {
      preserveWhitespace: "full",
    });
    // localContent.value = formattedContent;
    // originalContent.value = formattedContent;
    // previewContent.value = formattedContent;
    localContent.value = parsedContent;
    originalContent.value = parsedContent;
    previewContent.value = parsedContent;
  }

  const initialContent = editor.value.getHTML();
  if (initialContent) {
    //  const formattedContent = formatHTML(initialContent);
    emit("update:content", initialContent);
  }

  editorInitialized.value = true;
});

// Handle raw content changes
const handleRawContentChange = (value: string) => {
  localContent.value = value;
  previewContent.value = value;
  emit("update:content", value);
};
// Watch raw mode changes
watch(rawMode, (newValue) => {
  if (editor.value) {
    if (!newValue) {
      // When switching from raw mode back to normal mode
      editor.value.commands.setContent(localContent.value, false, {
        preserveWhitespace: "full",
      });
      previewContent.value = localContent.value;
    }
  }
});

// Watch content prop changes
watch(
  () => props.content,
  (newContent) => {
    if (!editor.value || newContent === undefined) return;

    const { from, to } = editor.value.state.selection;
    const parsedContent = parseMarkdownToHTML(newContent);

    // Only update if content actually changed
    const currentContent = editor.value.getHTML();
    if (currentContent !== parsedContent) {
      editor.value.commands.setContent(parsedContent, false);

      setTimeout(() => {
        if (editor.value) {
          editor.value.commands.setTextSelection({ from, to });
        }
      }, 0);
    }

    // Update local state without affecting original content
    // const formattedContent = formatHTML(parsedContent);
    localContent.value = parsedContent;
    previewContent.value = parsedContent;
  },
  { deep: true }
);

watch(rawMode, (newValue) => {
  if (editor.value) {
    if (!newValue) {
      // When switching from raw mode back to normal mode
      editor.value.commands.setContent(localContent.value, false, {
        preserveWhitespace: "full",
      });
      previewContent.value = localContent.value;
    } else {
      // When switching to raw mode, ensure Monaco editor gets latest content
      nextTick(() => {
        if (monacoEditor.value) {
          monacoEditor.value.setValue(localContent.value);
        }
      });
    }
  }
});

const hasChanges = computed(() => {
  return localContent.value !== originalContent.value;
});

const saveToDisk = async () => {
  if (!hasChanges.value || isSaving.value) return;

  isSaving.value = true;
  try {
    if (!isLoggedIn.value) {
      throw new Error("Please log in to GitHub first");
    }

    if (process.client) {
      const nuxtApp = useNuxtApp();
      const storage = nuxtApp.$content?.storage;
      if (storage) {
        await storage.clearAll();
      }
    }

    emit("save", localContent.value);
    originalContent.value = localContent.value;
  } catch (error) {
    console.error("Save error:", error);
    showToast({
      title: "Error",
      message:
        error instanceof Error ? error.message : "Failed to save changes",
      type: "error",
    });
    emit("error", error as Error);
  } finally {
    isSaving.value = false;
  }
};

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
  if (monacoEditor.value) {
    monacoEditor.value.dispose();
  }
});
</script>

<template>
  <div class="editor-wrapper">
    <!-- <div v-if="showDebugInfo" class="debug-info">
      <div class="debug-panel">
        <pre>Has changes: {{ hasChanges }}</pre>
        <pre>Local content length: {{ localContent?.length }}</pre>
        <pre>Original content length: {{ originalContent?.length }}</pre>
        <pre>Preview mode: {{ previewMode }}</pre>
        <pre>Raw mode: {{ rawMode }}</pre>
        <pre>Editor initialized: {{ editorInitialized }}</pre>
      </div>
    </div> -->

    <div v-if="!isLoggedIn" class="login-prompt">
      <p class="login-message">Please sign in with GitHub to edit this file</p>
      <button @click="github.login" class="login-button">
        Sign in with GitHub
      </button>
    </div>

    <div v-else class="editor-layout">
      <div class="editor-main">
        <div class="editor-toolbar">
          <div class="toolbar-left">
            <span class="file-path">{{ props.filePath }}</span>
          </div>

          <div class="toolbar-right">
            <!-- Editor View -->
            <template v-if="!previewMode && !rawMode">
              <button class="toolbar-button" @click="rawMode = true">
                Raw
              </button>
              <button class="toolbar-button" @click="previewMode = true">
                Preview
              </button>
              <button
                v-if="hasChanges && !isSaving"
                class="toolbar-button primary"
                @click="saveToDisk"
              >
                Commit Changes
              </button>
            </template>

            <!-- Raw View -->
            <template v-if="rawMode">
              <button class="toolbar-button" @click="rawMode = false">
                Normal
              </button>
              <button
                class="toolbar-button"
                @click="
                  previewMode = true;
                  rawMode = false;
                "
              >
                Preview
              </button>
              <button
                v-if="hasChanges && !isSaving"
                class="toolbar-button primary"
                @click="saveToDisk"
              >
                Commit Changes
              </button>
            </template>

            <!-- Preview View -->
            <template v-if="previewMode">
              <button class="toolbar-button" @click="previewMode = false">
                Edit
              </button>
              <button
                v-if="hasChanges && !isSaving"
                class="toolbar-button primary"
                @click="saveToDisk"
              >
                Commit Changes
              </button>
            </template>

            <button v-if="isSaving" class="toolbar-button loading" disabled>
              Saving...
            </button>
          </div>
        </div>

        <div class="editor-content">
          <!-- Editor View -->
          <template v-if="!previewMode && !rawMode">
            <div class="tiptap-toolbar" v-if="editor">
              <button
                @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }"
              >
                Bold
              </button>
              <button
                @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }"
              >
                Italic
              </button>
              <button
                @click="
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                "
                :class="{
                  'is-active': editor.isActive('heading', { level: 1 }),
                }"
              >
                H1
              </button>
              <button
                @click="
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                "
                :class="{
                  'is-active': editor.isActive('heading', { level: 2 }),
                }"
              >
                H2
              </button>
              <button
                @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }"
              >
                List
              </button>
              <AddContentDialog
                :onInsertComponent="handleInsertComponent"
                :onInsertSection="handleInsertSection"
              />
            </div>
            <editor-content
              v-if="editorInitialized"
              :editor="editor"
              class="markdown-editor"
              :class="{ 'has-changes': hasChanges }"
            />
          </template>

          <!-- Raw View -->
          <div v-else-if="rawMode" class="raw-content-wrapper">
            <MonacoEditor
              v-model="localContent"
              class="monaco-editor"
              :options="editorOptions"
              @change="handleRawContentChange"
              @mount="(editor) => (monacoEditor = editor)"
            />
          </div>

          <!-- Preview View -->
          <div v-else class="preview-wrapper">
            <div class="prose" v-html="previewContent"></div>
          </div>
        </div>
      </div>

      <CollaborationSidebar />
    </div>
  </div>
</template>

<style>
.editor-wrapper {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background: white;
}

.editor-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.editor-content {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Remove padding from editor and preview containers */
.markdown-editor {
  flex: 1;
  overflow-y: auto;
}

.preview-wrapper {
  flex: 1;
  overflow-y: auto;
}

/* Toolbar styles */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tiptap-toolbar {
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  border-bottom: 1px solid #e5e7eb;
}

.tiptap-toolbar button,
.toolbar-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.tiptap-toolbar button:hover,
.toolbar-button:hover {
  background: #f9fafb;
}

.tiptap-toolbar button.is-active {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.toolbar-button.primary {
  background: #4361ee;
  color: white;
  border-color: #4361ee;
}

.toolbar-button.primary:hover {
  background: #3651d4;
}

.file-path {
  color: #374151;
  font-size: 0.875rem;
}

/* Raw editor styles */
.raw-content-wrapper {
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.monaco-editor {
  width: 100%;
  height: 100%;
}
</style>
