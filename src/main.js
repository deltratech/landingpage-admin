import SimpleBar from 'simplebar-vue'
import "preline/preline"
import '@fontsource/inter'

import './assets/scss/icons.scss'
import './assets/scss/plugins.scss'
import './assets/scss/tailwind.scss'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
