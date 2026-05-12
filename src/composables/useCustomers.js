import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

export function useCustomers() {
    const customers = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const getAccessToken = () => localStorage.getItem('accessToken')
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(25)
    

    const getCustomers = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/customers`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.data) {
                customers.value = response.data.data
                totalPages.value = Math.ceil(response.data.total / limit.value)
                
                return response.data 
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
            const refreshSuccess = await refreshAccessToken()
            if (refreshSuccess) return getCustomers(true)
        }
            console.error('Error fetching customers:', err)
            return { draw: params.draw, recordsTotal: 0, recordsFiltered: 0, data: [] }
        }
  }

    const getCustomerById = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/customers/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getCustomerById(id, true)
            }
            error.value = err.message || 'Failed to fetch customer'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createCustomer = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/customers`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return createCustomer(data, true)
            }
            error.value = err.message || 'Failed to create customer'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateCustomer = async (id, data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.put(`${apiBase}/customers/${id}`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updateCustomer(id, data, true)
            }
            error.value = err.message || 'Failed to update customer'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deleteCustomer = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.delete(`${apiBase}/customers/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return deleteCustomer(id, true)
            }
            error.value = err.message || 'Failed to delete customer'
            return null
        } finally {
            isLoading.value = false
        }
    }
    

    
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token found')

            const response = await axios.post(`${apiBase}/auth/refresh`, {
                refreshToken
            })

            if (response.data?.accessToken) {
                localStorage.setItem('accessToken', response.data.accessToken)
                localStorage.setItem('refreshToken', response.data.refreshToken)
                return true
            } else {
                throw new Error('Invalid refresh response')
            }
        } catch (err) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return false
        }
    }

    onMounted(getCustomers)

    return {
        customers,
        isLoading,
        error,
        getCustomers,
        getCustomerById,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        currentPage,
        totalPages,
    }
}
