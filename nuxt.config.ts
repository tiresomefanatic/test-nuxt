// nuxt.config.ts
export default defineNuxtConfig({
  // Essential modules that your application needs
  modules: [
    "@nuxt/content", // Handles markdown content
    "@nuxt/ui", // Provides UI components
    "nuxt-monaco-editor", // Code editor
    "@pinia/nuxt", // State management
  ],

  css: ["~/assets/css/content.css"],

  // Components configuration
  components: {
    dirs: [
      {
        path: "~/components",
        global: true,
      },
      {
        path: "~/components/content",
        global: true,
        prefix: "Content",
      },
    ],
  },

  content: {
    navigation: {
      fields: ["navigation"],
    },
    highlight: {
      theme: "github-dark",
      preload: ["vue", "javascript", "typescript"],
    },
    markdown: {
      remarkPlugins: [],
      rehypePlugins: [],
      tags: {
        p: "p",
        a: "a",
        blockquote: "blockquote",
        "code-inline": "code",
        code: "pre",
        em: "em",
        h1: "h1",
        h2: "h2",
        h3: "h3",
        h4: "h4",
        h5: "h5",
        h6: "h6",
        hr: "hr",
        img: "img",
        ul: "ul",
        ol: "ol",
        li: "li",
        strong: "strong",
        table: "table",
        thead: "thead",
        tbody: "tbody",
        td: "td",
        th: "th",
        tr: "tr",
      },
      componentType: true,
      mdc: true,
      toc: {
        depth: 3,
        searchDepth: 3,
      },
      anchorLinks: false,
    },
    components: {
      global: true,
      dirs: ["~/components/content"],
    },
  },

  // Configuration that changes based on environment
  runtimeConfig: {
    github: {
      clientId: process.env.NUXT_GITHUB_CLIENT_ID,
      clientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
    },
    public: {
      githubClientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID,
      siteUrl: process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      githubOwner: "tiresomefanatic",
      githubRepo: "test-nuxt",
    },
  },

  monacoEditor: {
    // These are default values:
    locale: "en",
    componentName: {
      codeEditor: "MonacoEditor",
      diffEditor: "MonacoDiffEditor",
    },
  },

  // Development server configuration
  devServer: {
    port: 3000,
  },

  // Vercel deployment configuration
  nitro: {
    preset: "vercel",
    prerender: {
      crawlLinks: false,
    },
  },

  compatibilityDate: "2025-01-07",
});
