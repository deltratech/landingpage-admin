import { ref } from "vue"
import axios from "axios"

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem("accessToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useRequestDemo() {
    const loading = ref(false)
    const error = ref("")

    const getRequestDemos = async () => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.get(`${apiBase}/request-demo`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to fetch demo requests."
            return []
        } finally {
            loading.value = false
        }
    }

    return { getRequestDemos, loading, error }
}
