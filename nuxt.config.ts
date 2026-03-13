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

  modules: [
    "@nuxtjs/supabase",
    "@nuxt/icon",
    "@nuxtjs/google-fonts",
    "shadcn-nuxt",
  ],

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

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_API_KEY,
    secretKey: process.env.SUPABASE_SECRET_KEY,
    redirect: false
  },
});
