import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/tailwind.css"],

  vite: {
    plugins: [tailwindcss() as any],
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },

  supabase: {
    redirect: true,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ["/", "/dashboard(/*)?"],
      exclude: ["/login", "/register"],
    },
  },

  modules: [
    "@nuxtjs/supabase",
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@vite-pwa/nuxt",
  ],

  pwa: {
    manifest: {
      name: "Lapis",
      short_name: "Lapis",
      description: "A modern Nuxt 4 note taking app utilizing Tailwind CSS v4 and shadcn-vue.",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
      start_url: "/",
      icons: [
        {
          src: "/lapis_logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/lapis_logo.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/lapis_logo.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/",
    },
    devOptions: {
      enabled: true,
      type: "module",
    },
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
    display: "swap",
  },

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
  },

  components: [
    {
      path: "~/components",
      pathPrefix: true,
      pattern: "**/*.vue",
    },
  ],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./app/components/ui",
  },
});
