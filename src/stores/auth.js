import { defineStore } from 'pinia'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('accessToken') || null,
    }),
    getters: {
        displayName: (state) => state.user?.name ?? state.user?.email ?? 'Admin',
        initials: (state) => {
            const name = state.user?.name ?? state.user?.email ?? 'A'
            return name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
        },
    },
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
            localStorage.removeItem('refreshToken')
        },
        async fetchMe() {
            const accessToken = localStorage.getItem('accessToken')
            if (!accessToken) return
            try {
                const res = await axios.get(`${apiBase}/auth/me`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                })
                this.user = res.data.data ?? res.data
            } catch {
                // token may be expired — leave user as null
            }
        },
    },
})
