import { ref } from "vue"
import axios from "axios"

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem("accessToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useContacts() {
    const loading = ref(false)
    const error = ref("")

    const getContacts = async () => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.get(`${apiBase}/contact`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to fetch contacts."
            return []
        } finally {
            loading.value = false
        }
    }

    const createContact = async (data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.post(`${apiBase}/contact`, data)
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to submit contact."
            return null
        } finally {
            loading.value = false
        }
    }

    const updateContact = async (id, data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.patch(`${apiBase}/contact/${id}`, data, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to update contact."
            return null
        } finally {
            loading.value = false
        }
    }

    const deleteContact = async (id) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.delete(`${apiBase}/contact/${id}`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to delete contact."
            return null
        } finally {
            loading.value = false
        }
    }

    return { getContacts, createContact, updateContact, deleteContact, loading, error }
}
