// composables/useComponentRegistry.ts
import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

export interface ComponentConfig {
  name: string;
  attributes: string[];
  defaults?: Record<string, any>;
}

// Register your MDC components here
export const availableComponents: ComponentConfig[] = [
  {
    name: "color-wheel",
    attributes: ["sportColor", "cruiserColor", "urbanColor", "offroadColor"],
    defaults: {
      sportColor: "#FF6B6B",
      cruiserColor: "#4ECDC4",
      urbanColor: "#FFD93D",
      offroadColor: "#95E1D3",
    },
  },
  // Add other components here following the same pattern
  {
    name: "hero-banner",
    attributes: ["title", "subtitle", "backgroundImage"],
    defaults: {
      title: "Welcome",
      subtitle: "This is a hero banner",
      backgroundImage: "/placeholder.jpg",
    },
  },
];

export function useComponentRegistry() {
  // Convert HTML to MDC format for all registered components
  const convertToMDC = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;

    availableComponents.forEach((component) => {
      const elements = div.querySelectorAll(
        `div[data-type="${component.name}"]`
      );

      elements.forEach((element) => {
        const attrs = component.attributes
          .map((attr) => {
            const value =
              element.getAttribute(attr.toLowerCase()) ||
              element.getAttribute(attr);
            return value ? `${attr.toLowerCase()}="${value}"` : null;
          })
          .filter(Boolean)
          .join(" ");

        const mdcComponent = `::${component.name}{${attrs}}\n::`;
        const replacement = document.createElement("div");
        replacement.textContent = mdcComponent;
        element.replaceWith(replacement);
      });
    });

    return div.textContent || "";
  };

  // Generate Tiptap extensions for all components
  const generateExtensions = () => {
    return availableComponents.map((component) => {
      // Create attributes configuration
      const attributes = component.attributes.reduce((acc, attr) => {
        acc[attr] = {
          default: component.defaults?.[attr] || null,
          parseHTML: (element) =>
            element.getAttribute(attr.toLowerCase()) ||
            element.getAttribute(attr),
          renderHTML: (attributes) => {
            if (!attributes[attr]) return {};
            return { [attr.toLowerCase()]: attributes[attr] };
          },
        };
        return acc;
      }, {});

      // Create and return the Node extension
      return Node.create({
        name: component.name,
        group: "block",
        atom: true,
        addAttributes: () => attributes,
        parseHTML: () => [
          { tag: `div[data-type="${component.name}"]` },
          { tag: component.name }, // For parsing MDC format
        ],
        renderHTML: ({ HTMLAttributes }) => {
          const attrs = {
            "data-type": component.name,
            ...HTMLAttributes,
          };
          return ["div", attrs];
        },
        addNodeView() {
          // Dynamic import of component node view
          const nodeViewComponent = defineAsyncComponent(
            () => import(`../components/editor/${component.name}Node.vue`)
          );
          return VueNodeViewRenderer(nodeViewComponent);
        },
      });
    });
  };

  // Convert MDC to HTML format
  const convertToHTML = (markdown: string): string => {
    let result = markdown;

    availableComponents.forEach((component) => {
      const regex = new RegExp(`::${component.name}{([^}]+)}\\n::`, "g");

      result = result.replace(regex, (_, attrs) => {
        // Parse attributes
        const parsedAttrs = attrs.split(" ").reduce((acc, attr) => {
          const [key, value] = attr.split("=");
          if (key && value) {
            acc[key] = value.replace(/"/g, "");
          }
          return acc;
        }, {});

        // Create HTML with data-type
        const attrString = Object.entries(parsedAttrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ");

        return `<div data-type="${component.name}" ${attrString}></div>`;
      });
    });

    return result;
  };

  return {
    availableComponents,
    convertToMDC,
    convertToHTML,
    generateExtensions,
  };
}
