import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('accessToken') || null,
    }),
    actions: {
        login(user, token) {
            this.user = user
            this.token = token
            localStorage.setItem('accessToken', token)
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('accessToken')
        }
    }
})
