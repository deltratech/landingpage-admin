import "preline/preline"
import '@fontsource/inter'

import './assets/scss/icons.scss'
import './assets/scss/plugins.scss'
import './assets/scss/tailwind.scss'
import { createPinia } from 'pinia'
import axios from 'axios'
import { createGtag } from 'vue-gtag'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(createGtag({ tagId: import.meta.env.VITE_GA_MEASUREMENT_ID ?? '' }), router)

app.mount('#app')
