import { ref } from "vue"
import axios from "axios"

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem("accessToken")
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function usePosts() {
    const loading = ref(false)
    const error = ref("")

    const getPosts = async () => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.get(`${apiBase}/posts`)
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to fetch posts."
            return []
        } finally {
            loading.value = false
        }
    }

    const getPostBySlug = async (slug) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.get(`${apiBase}/posts/${slug}`)
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to fetch post."
            return null
        } finally {
            loading.value = false
        }
    }

    const createPost = async (data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.post(`${apiBase}/posts`, data, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to create post."
            return null
        } finally {
            loading.value = false
        }
    }

    const updatePost = async (id, data) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.patch(`${apiBase}/posts/${id}`, data, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to update post."
            return null
        } finally {
            loading.value = false
        }
    }

    const deletePost = async (id) => {
        loading.value = true
        error.value = ""
        try {
            const response = await axios.delete(`${apiBase}/posts/${id}`, {
                headers: authHeaders(),
            })
            return response.data.data ?? response.data
        } catch (err) {
            error.value = err.response?.data?.message || "Failed to delete post."
            return null
        } finally {
            loading.value = false
        }
    }

    return { getPosts, getPostBySlug, createPost, updatePost, deletePost, loading, error }
}
