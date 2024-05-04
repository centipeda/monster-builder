// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-primevue',
  ],
  primevue: {

  },
  app: {
    head: {
      link: [
        { 
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Noto+Sans:400,700,400italic,700italic',
          crossorigin: 'anonymous',
        },
        { 
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Libre+Baskerville:700',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap',
          crossorigin: 'anonymous',
        }
      ],
      script: [
      ]
    }
  },
  devtools: { enabled: true },
  vue: {
  }
})
