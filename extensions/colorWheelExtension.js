// extensions/colorWheelExtension.js
import { Node } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import ColorWheelNode from "../components/ColorWheelNode.vue";

export default Node.create({
  name: "colorWheel",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      sportColor: {
        default: "#FF6B6B",
      },
      cruiserColor: {
        default: "#4ECDC4",
      },
      urbanColor: {
        default: "#FFD93D",
      },
      offroadColor: {
        default: "#95E1D3",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="color-wheel"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "color-wheel", ...HTMLAttributes }, 0];
  },

  addNodeView() {
    return VueNodeViewRenderer(ColorWheelNode);
  },
});
