import { ref } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export function useUsers() {
    const users = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const limit = ref(10)

    const getUsers = async () => {
        isLoading.value = true
        error.value = null
        try {
            const res = await axios.get(`${apiBase}/users`, {
                headers: authHeaders(),
                params: { page: currentPage.value, limit: limit.value },
            })
            const data = res.data?.data ?? res.data
            users.value = Array.isArray(data) ? data : (data?.data ?? [])
            const total = res.data?.total ?? res.data?.meta?.total ?? users.value.length
            totalPages.value = Math.ceil(total / limit.value) || 1
            return res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch users.'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createUser = async (data) => {
        isLoading.value = true
        error.value = null
        try {
            const res = await axios.post(`${apiBase}/users`, data, { headers: authHeaders() })
            return res.data?.data ?? res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to create user.'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateUser = async (id, data) => {
        isLoading.value = true
        error.value = null
        try {
            const res = await axios.patch(`${apiBase}/users/${id}`, data, { headers: authHeaders() })
            return res.data?.data ?? res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to update user.'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deleteUser = async (id) => {
        isLoading.value = true
        error.value = null
        try {
            const res = await axios.delete(`${apiBase}/users/${id}`, { headers: authHeaders() })
            return res.data?.data ?? res.data
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to delete user.'
            return null
        } finally {
            isLoading.value = false
        }
    }

    return { users, isLoading, error, currentPage, totalPages, getUsers, createUser, updateUser, deleteUser }
}
