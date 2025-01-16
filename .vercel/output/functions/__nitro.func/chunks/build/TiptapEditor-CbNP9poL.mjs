import { defineComponent, createElementBlock, ref, computed, watch, nextTick, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
import { VueNodeViewRenderer, EditorContent } from '@tiptap/vue-3';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import { Node } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import ColorWheelNode from './ColorWheelNode-LlNQdGPh.mjs';
import CollaborationSidebar from './CollaborationSidebar-CHJWyzm2.mjs';
import { u as useGithub } from './useGithub-Bxs3U9ia.mjs';
import AddContentDialog from './AddContentDialog-_ja4enoB.mjs';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import '@iconify/utils';
import 'consola/core';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import './useToast-CuZrFQgt.mjs';
import './CreatePullRequest-oLrf17ey.mjs';
import '@octokit/rest';

const __nuxt_component_0 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});

Node.create({
  name: "colorWheel",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      sportColor: {
        default: "#FF6B6B"
      },
      cruiserColor: {
        default: "#4ECDC4"
      },
      urbanColor: {
        default: "#FFD93D"
      },
      offroadColor: {
        default: "#95E1D3"
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="color-wheel"]'
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "color-wheel", ...HTMLAttributes }, 0];
  },
  addNodeView() {
    return VueNodeViewRenderer(ColorWheelNode);
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TiptapEditor",
  __ssrInlineRender: true,
  props: {
    content: {},
    filePath: {}
  },
  emits: ["update:content", "save", "error"],
  setup(__props, { emit: __emit }) {
    const handleInsertComponent = (componentId) => {
      if (!editor.value) return;
      switch (componentId) {
        case "colorwheel":
          editor.value.chain().focus().insertContent({
            type: "colorWheel"
          }).run();
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
  `
    };
    const handleInsertSection = (sectionId) => {
      if (!editor.value) return;
      const template = templates[sectionId];
      if (template) {
        editor.value.chain().focus().createParagraphNear().insertContent(template).focus().run();
      }
    };
    Node.create({
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
            }
          },
          class: {
            default: null,
            parseHTML: (element) => element.getAttribute("class"),
            renderHTML: (attributes) => {
              if (!attributes.class) return {};
              return { class: attributes.class };
            }
          },
          "data-type": {
            default: null,
            parseHTML: (element) => element.getAttribute("data-type"),
            renderHTML: (attributes) => {
              if (!attributes["data-type"]) return {};
              return { "data-type": attributes["data-type"] };
            }
          }
        };
      },
      parseHTML() {
        return [{ tag: "div" }];
      },
      renderHTML({ HTMLAttributes }) {
        return ["div", HTMLAttributes, 0];
      }
    });
    Node.create({
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
            }
          }
        };
      },
      parseHTML() {
        return [
          {
            tag: "div",
            getAttrs: (node) => {
              const style = node.getAttribute("style") || "";
              return style.includes("grid") ? {} : false;
            }
          }
        ];
      },
      renderHTML({ HTMLAttributes }) {
        return ["div", HTMLAttributes, 0];
      }
    });
    Paragraph.extend({
      addAttributes() {
        var _a;
        return {
          ...(_a = this.parent) == null ? undefined : _a.call(this),
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            }
          }
        };
      }
    });
    Heading.extend({
      addAttributes() {
        var _a;
        return {
          ...(_a = this.parent) == null ? undefined : _a.call(this),
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            }
          }
        };
      }
    });
    Image.extend({
      addAttributes() {
        var _a;
        return {
          ...(_a = this.parent) == null ? undefined : _a.call(this),
          style: {
            default: null,
            parseHTML: (element) => element.getAttribute("style"),
            renderHTML: (attributes) => {
              if (!attributes.style) return {};
              return { style: attributes.style };
            }
          }
        };
      }
    });
    const props = __props;
    const emit = __emit;
    const localContent = ref("");
    const originalContent = ref("");
    const isSaving = ref(false);
    const previewMode = ref(false);
    const rawMode = ref(false);
    const editor = ref(null);
    const editorInitialized = ref(false);
    const previewContent = ref("");
    const monacoEditor = ref(null);
    const github = useGithub();
    const { isLoggedIn } = github;
    computed(() => {
      return false;
    });
    const editorOptions = {
      theme: "vs-dark",
      // Enhanced visibility for syntax highlighting
      language: "html",
      fontSize: 13,
      lineNumbers: "on",
      renderWhitespace: "selection",
      minimap: {
        enabled: true,
        scale: 1,
        showSlider: "mouseover",
        maxColumn: 120,
        renderCharacters: true
      },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      lineHeight: 20,
      padding: { top: 16, bottom: 16 },
      folding: true,
      foldingHighlight: true,
      foldingStrategy: "indentation",
      showFoldingControls: "always",
      bracketPairColorization: {
        enabled: true,
        independentColorPoolPerBracketType: true
      },
      autoClosingBrackets: "always",
      autoClosingQuotes: "always",
      autoClosingTags: true,
      formatOnType: true,
      formatOnPaste: true,
      autoIndent: "advanced",
      tabSize: 2,
      automaticLayout: true,
      colorDecorators: true,
      semanticHighlighting: {
        enabled: true
      },
      scrollbar: {
        vertical: "visible",
        horizontal: "visible",
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
        alwaysConsumeMouseWheel: false
      },
      suggest: {
        snippetsPreventQuickSuggestions: false,
        showWords: true,
        showClasses: true,
        showTags: true,
        showAttributes: true,
        showValues: true,
        showCSSProperties: true,
        preview: true,
        maxVisibleSuggestions: 12,
        filterGraceful: true
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
      html: {
        format: {
          enable: true,
          wrapLineLength: 120,
          unformatted: "",
          contentUnformatted: "pre,code,textarea",
          indentInnerHtml: true,
          preserveNewLines: true,
          maxPreserveNewLines: null,
          indentHandlebars: false,
          endWithNewline: false,
          extraLiners: "head, body, /html",
          wrapAttributes: "auto"
        },
        suggest: {
          html5: true
        }
      },
      contextmenu: true,
      mouseWheelZoom: true,
      links: true,
      hover: {
        enabled: true,
        delay: 300,
        sticky: true
      },
      occurrencesHighlight: true,
      renderLineHighlight: "all",
      renderIndentGuides: true,
      matchBrackets: "always",
      guides: {
        bracketPairs: true,
        indentation: true,
        highlightActiveIndentation: true,
        highlightActiveBracketPair: true
      },
      renderControlCharacters: false,
      roundedSelection: true,
      rulers: [],
      wordBasedSuggestions: true,
      wordWrapColumn: 120,
      find: {
        addExtraSpaceOnTop: false,
        autoFindInSelection: "never",
        seedSearchStringFromSelection: "never"
      }
    };
    Document.extend({
      content: "block+"
    });
    const parseMarkdownToHTML = (content) => {
      if (!content) return "";
      return content.replace(/::color-wheel\s*::/g, '<div data-type="color-wheel"></div>').replace(
        /::test-component\s*::/g,
        '<div data-type="test-component"></div>'
      );
    };
    const handleRawContentChange = (value) => {
      localContent.value = value;
      previewContent.value = value;
      emit("update:content", value);
    };
    watch(rawMode, (newValue) => {
      if (editor.value) {
        if (!newValue) {
          editor.value.commands.setContent(localContent.value, false, {
            preserveWhitespace: "full"
          });
          previewContent.value = localContent.value;
        }
      }
    });
    watch(
      () => props.content,
      (newContent) => {
        if (!editor.value || newContent === undefined) return;
        const { from, to } = editor.value.state.selection;
        const parsedContent = parseMarkdownToHTML(newContent);
        const currentContent = editor.value.getHTML();
        if (currentContent !== parsedContent) {
          editor.value.commands.setContent(parsedContent, false);
          setTimeout(() => {
            if (editor.value) {
              editor.value.commands.setTextSelection({ from, to });
            }
          }, 0);
        }
        localContent.value = parsedContent;
        previewContent.value = parsedContent;
      },
      { deep: true }
    );
    watch(rawMode, (newValue) => {
      if (editor.value) {
        if (!newValue) {
          editor.value.commands.setContent(localContent.value, false, {
            preserveWhitespace: "full"
          });
          previewContent.value = localContent.value;
        } else {
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
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_MonacoEditor = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "editor-wrapper" }, _attrs))}>`);
      if (!unref(isLoggedIn)) {
        _push(`<div class="login-prompt"><p class="login-message">Please sign in with GitHub to edit this file</p><button class="login-button"> Sign in with GitHub </button></div>`);
      } else {
        _push(`<div class="editor-layout"><div class="editor-main"><div class="editor-toolbar"><div class="toolbar-left"><span class="file-path">${ssrInterpolate(props.filePath)}</span></div><div class="toolbar-right">`);
        if (!previewMode.value && !rawMode.value) {
          _push(`<!--[--><button class="toolbar-button"> Raw </button><button class="toolbar-button"> Preview </button>`);
          if (hasChanges.value && !isSaving.value) {
            _push(`<button class="toolbar-button primary"> Commit Changes </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (rawMode.value) {
          _push(`<!--[--><button class="toolbar-button"> Normal </button><button class="toolbar-button"> Preview </button>`);
          if (hasChanges.value && !isSaving.value) {
            _push(`<button class="toolbar-button primary"> Commit Changes </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (previewMode.value) {
          _push(`<!--[--><button class="toolbar-button"> Edit </button>`);
          if (hasChanges.value && !isSaving.value) {
            _push(`<button class="toolbar-button primary"> Commit Changes </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (isSaving.value) {
          _push(`<button class="toolbar-button loading" disabled> Saving... </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="editor-content">`);
        if (!previewMode.value && !rawMode.value) {
          _push(`<!--[-->`);
          if (editor.value) {
            _push(`<div class="tiptap-toolbar"><button class="${ssrRenderClass({ "is-active": editor.value.isActive("bold") })}"> Bold </button><button class="${ssrRenderClass({ "is-active": editor.value.isActive("italic") })}"> Italic </button><button class="${ssrRenderClass({
              "is-active": editor.value.isActive("heading", { level: 1 })
            })}"> H1 </button><button class="${ssrRenderClass({
              "is-active": editor.value.isActive("heading", { level: 2 })
            })}"> H2 </button><button class="${ssrRenderClass({ "is-active": editor.value.isActive("bulletList") })}"> List </button>`);
            _push(ssrRenderComponent(AddContentDialog, {
              onInsertComponent: handleInsertComponent,
              onInsertSection: handleInsertSection
            }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (editorInitialized.value) {
            _push(ssrRenderComponent(unref(EditorContent), {
              editor: editor.value,
              class: ["markdown-editor", { "has-changes": hasChanges.value }]
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        } else if (rawMode.value) {
          _push(`<div class="raw-content-wrapper">`);
          _push(ssrRenderComponent(_component_MonacoEditor, {
            modelValue: localContent.value,
            "onUpdate:modelValue": ($event) => localContent.value = $event,
            class: "monaco-editor",
            options: editorOptions,
            onChange: handleRawContentChange,
            onMount: (editor2) => monacoEditor.value = editor2
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<div class="preview-wrapper"><div class="prose">${(_a = previewContent.value) != null ? _a : ""}</div></div>`);
        }
        _push(`</div></div>`);
        _push(ssrRenderComponent(CollaborationSidebar, null, null, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TiptapEditor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : undefined;
};

export { _sfc_main as default };
//# sourceMappingURL=TiptapEditor-CbNP9poL.mjs.map
