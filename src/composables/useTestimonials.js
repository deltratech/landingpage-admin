import { ref } from "vue"
import axios from "axios"

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem("accessToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useTestimonials() {
    const loading = ref(false)
    const error = ref("")

    const getTestimonials = async () => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.get(`${apiBase}/testimonials`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to fetch testimonials."
            return []
        } finally {
            loading.value = false
        }
    }

    const createTestimonial = async (data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.post(`${apiBase}/testimonials`, data, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to create testimonial."
            return null
        } finally {
            loading.value = false
        }
    }

    const updateTestimonial = async (id, data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.patch(`${apiBase}/testimonials/${id}`, data, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to update testimonial."
            return null
        } finally {
            loading.value = false
        }
    }

    const deleteTestimonial = async (id) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.delete(`${apiBase}/testimonials/${id}`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to delete testimonial."
            return null
        } finally {
            loading.value = false
        }
    }

    return { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, loading, error }
}
