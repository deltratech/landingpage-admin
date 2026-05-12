import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL
const apiKey = 'sHCEtVx2mVXIa6ZUkigfd'

export function useTransactions() {
    const transactions = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const isError = ref(false)

    const getAccessToken = () => localStorage.getItem('accessToken')
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(25)

    const getTransactions = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.data) {
                const transactionsList = response.data.data        

                // Store the latest transaction in `transactions.value` and update totalPages
                transactions.value = transactionsList                       
                totalPages.value = Math.ceil(response.data.total / limit.value)
                
                
                return response.data 
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
            const refreshSuccess = await refreshAccessToken()
            if (refreshSuccess) return getTransactions(true)
        }
            console.error('Error fetching transactions:', err)
            return { draw: params.draw, recordsTotal: 0, recordsFiltered: 0, data: [] }
        }
    }

    const getTransactionById = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getTransactionById(id, true)
            }
            error.value = err.message || 'Failed to fetch transaction'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createTransaction = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/transactions`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })
            
            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return createTransaction(data, true)
            }
            error.value = err.message || 'Failed to create transaction'
            console.error("Error in createTransaction: ", error.value) 
            return null
        } finally {
            isLoading.value = false
        }
    }
    
    const updatePayment = async (transactionId, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.put(`${apiBase}/transactions/${transactionId}/manual-payment`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })
            
            return response
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return createTransaction(data, true)
            }
            error.value = err.message || 'Failed to create transaction'
            console.error("Error in createTransaction: ", error.value) 
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateTransaction = async (id, data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.put(`${apiBase}/transactions/${id}`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updateTransaction(id, data, true)
            }
            error.value = err.message || 'Failed to update transaction'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deleteTransaction = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.delete(`${apiBase}/transactions/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return deleteTransaction(id, true)
            }
            error.value = err.message || 'Failed to delete transaction'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const changeStartSessionStatus = async (id, status, retry = false) => {
        
        isLoading.value = true
        error.value = null
        let response = null
        
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')
            
            if (status == 'in_booth') {
                response = await axios.put(`${apiBase}/transactions/${id}/start-session`, {
                    headers: { 'x-api-key': `${apiKey}` }
                })
            } else if (status == 'editing') {
                response = await axios.put(`${apiBase}/transactions/${id}/complete-session`, {
                    headers: { 'x-api-key': `${apiKey}` }
                })
            } else if (status == 'payment_success') {
                response = await axios.put(`${apiBase}/transactions/${id}/complete-session`, {
                    headers: { 'x-api-key': `${apiKey}` }
                })
            }

            
            if (response.data) {                
                return response.data
            }
            
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return changeStartSessionStatus(id, status, true)
            }
            error.value = err.message || 'Failed to change transaction status'
            return null
        } finally {
            isLoading.value = false
        }
    }

    // 🔹 Fungsi Refresh Token
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

    onMounted(getTransactions)

    return {
        transactions,
        isLoading,
        error,
        getTransactions,
        getTransactionById,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        changeStartSessionStatus,
        updatePayment,
        currentPage,
        totalPages,

    }
}
