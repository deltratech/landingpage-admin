import { ref } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useTags() {
    const tags = ref([])
    const loading = ref(false)
    const error = ref(null)

    const getTags = async () => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.get(`${apiBase}/tags`, { headers: authHeaders() })
            tags.value = res.data?.data ?? res.data ?? []
            return tags.value
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch tags.'
            return []
        } finally {
            loading.value = false
        }
    }

    const createTag = async (data) => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.post(`${apiBase}/tags`, data, { headers: authHeaders() })
            return res.data?.data ?? res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to create tag.'
            return null
        } finally {
            loading.value = false
        }
    }

    const updateTag = async (id, data) => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.patch(`${apiBase}/tags/${id}`, data, { headers: authHeaders() })
            return res.data?.data ?? res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to update tag.'
            return null
        } finally {
            loading.value = false
        }
    }

    const deleteTag = async (id) => {
        loading.value = true
        error.value = null
        try {
            const res = await axios.delete(`${apiBase}/tags/${id}`, { headers: authHeaders() })
            return res.data?.data ?? res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to delete tag.'
            return null
        } finally {
            loading.value = false
        }
    }

    return { tags, loading, error, getTags, createTag, updateTag, deleteTag }
}
