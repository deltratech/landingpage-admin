import { ref } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const apiBase = import.meta.env.VITE_API_BASE_URL

export function useAuth() {
    const router = useRouter()
    const loading = ref(false)
    const errorMessage = ref("")

    const login = async (email, password) => {
        loading.value = true
        errorMessage.value = ""

        try {
            const response = await axios.post(`${apiBase}/auth/login`, {
                email,
                password,
            })

            const { accessToken, refreshToken } = response.data.data ?? response.data
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)

            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
            router.push("/dashboard")
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || "Login failed. Please try again."
        } finally {
            loading.value = false
        }
    }

    const getMe = async () => {
        loading.value = true
        errorMessage.value = ""

        try {
            const accessToken = localStorage.getItem("accessToken")
            if (!accessToken) throw new Error("No access token found")

            const response = await axios.get(`${apiBase}/auth/me`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            return response.data.data ?? response.data
        } catch (error) {
            errorMessage.value = error.response?.data?.message || "Failed to fetch user."
            return null
        } finally {
            loading.value = false
        }
    }

    const logout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        delete axios.defaults.headers.common["Authorization"]
        router.push("/login")
    }

    return { login, getMe, logout, loading, errorMessage }
}
