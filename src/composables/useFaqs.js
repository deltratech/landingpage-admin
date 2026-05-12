import { ref } from "vue"
import axios from "axios"

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem("accessToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useFaqs() {
    const loading = ref(false)
    const error = ref("")

    const getFaqs = async () => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.get(`${apiBase}/faqs`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to fetch FAQs."
            return []
        } finally {
            loading.value = false
        }
    }

    const createFaq = async (data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.post(`${apiBase}/faqs`, data, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to create FAQ."
            return null
        } finally {
            loading.value = false
        }
    }

    const updateFaq = async (id, data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.patch(`${apiBase}/faqs/${id}`, data, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to update FAQ."
            return null
        } finally {
            loading.value = false
        }
    }

    const deleteFaq = async (id) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.delete(`${apiBase}/faqs/${id}`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to delete FAQ."
            return null
        } finally {
            loading.value = false
        }
    }

    return { getFaqs, createFaq, updateFaq, deleteFaq, loading, error }
}
