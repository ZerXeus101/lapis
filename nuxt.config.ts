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
    plugins: [tailwindcss()],
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
});
