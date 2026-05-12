import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

export function usePlans() {
    const plans = ref([])
    const outlets = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const getAccessToken = () => localStorage.getItem('accessToken')
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(10)
    
    const getPlans = async () => {
        const params = { 
            page: currentPage.value,
            limit: limit.value,
        }
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/plans`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.data) {
                plans.value = response.data.data
                totalPages.value = Math.ceil(response.data.total / limit.value)
                return response.data 
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
            const refreshSuccess = await refreshAccessToken()
            if (refreshSuccess) return getPlans(true)
        }
            console.error('Error fetching plans:', err)
            
        }
  }

  const getOutlets = async (params) => {
    try {
        const accessToken = getAccessToken()
        if (!accessToken) throw new Error('No access token found')

        const response = await axios.get(`${apiBase}/outlets`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            params: params  
        })

        if (response.data) {
            outlets.value = response.data.data
            return response.data 
        } else {
            throw new Error('Invalid response format')
        }
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshSuccess = await refreshAccessToken()
        if (refreshSuccess) return getOutlets(true)
    }
        console.error('Error fetching outlets:', err)
        
    }
}

    const getPlanById = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/plans/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getPlanById(id, true)
            }
            error.value = err.message || 'Failed to fetch plan'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createPlan = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/plans`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return createPlan(data, true)
            }
            error.value = err.message || 'Failed to create plan'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updatePlan = async (id, data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.put(`${apiBase}/plans/${id}`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updatePlan(id, data, true)
            }
            error.value = err.message || 'Failed to update plan'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deletePlan = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.delete(`${apiBase}/plans/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return deletePlan(id, true)
            }
            error.value = err.message || 'Failed to delete plan'
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
                console.log('Tokens refreshed successfully');
                return true
            } else {
                throw new Error('Invalid refresh response')
            }
        } catch (err) {
            console.error('Error refreshing token:', err)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return false
        }
     }
     

    onMounted(getPlans)

    return {
        plans,
        isLoading,
        error,
        getPlans,
        getPlanById,
        createPlan,
        updatePlan,
        deletePlan,
        currentPage,
        totalPages
    }
}
