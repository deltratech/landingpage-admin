import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL
const transactionData = ref([])
const isLoading = ref(false)
const error = ref(null)

const currentPage = ref(1)
const totalPages = ref(0)
const limit = ref(25)



export function useReports() {
    const users = ref([])    
    const getAccessToken = () => localStorage.getItem('accessToken')
   
    const getReportTransaction = async (params) => {
        

        const getAccessToken = () => localStorage.getItem('accessToken')
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions/statistics`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.status === 200) {
                transactionData.value = response.data.data.items
                totalPages.value = Math.ceil(response.data.total / limit.value)
                console.log(response)
                return response.data

            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getReportTransaction(true)
            }
            console.error('Error fetching users:', err)
            
        }
    }

    const getUserTransactionsReport = async (params) => {
        const getAccessToken = () => localStorage.getItem('accessToken')
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions/user-statistics`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.status === 200) {
                console.log(response)
                return response.data

            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getUserTransactionsReport(true)
            }
            console.error('Error fetching users:', err)
        }
    }

    const getPlanStatistics = async (params) => {
        const getAccessToken = () => localStorage.getItem('accessToken')
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions/plan-statistics`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.status === 200) {
                console.log(response)
                return response.data

            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getUserTransactionsReport(true)
            }
            console.error('Error fetching users:', err)
        }
    }

    const getPaymentMethodStatistics = async (params) => {
        const getAccessToken = () => localStorage.getItem('accessToken')
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions/payment-method-statistics`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.status === 200) {
                console.log(response)
                return response.data

            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getUserTransactionsReport(true)
            }
            console.error('Error fetching users:', err)
        }
    }

    const getOutletStatistcs = async (params) => {
        const getAccessToken = () => localStorage.getItem('accessToken')
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions/outlet-statistics`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.status === 200) {
                console.log(response)
                return response.data

            } else {
                throw new Error('Invalid response format')
            }
        }
        catch (err) {
            if (err.response?.status === 401) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getUserTransactionsReport(true)
            }
            console.error('Error fetching users:', err)
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

    

    return {
       getReportTransaction,
       getUserTransactionsReport,
       getPlanStatistics,
       getPaymentMethodStatistics,
       getOutletStatistcs,
       transactionData,
       currentPage,
        totalPages,
         
    }

}