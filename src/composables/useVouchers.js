import { ref, onMounted } from 'vue'
import axios from 'axios'


const apiBase = import.meta.env.VITE_API_BASE_URL

export function useVouchers() {
    const vouchers = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const getAccessToken = () => localStorage.getItem('accessToken')
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(10)
    

    const getVouchers = async (params) => {        
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/vouchers`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.data) {
                vouchers.value = response.data.data
                totalPages.value = Math.ceil(response.data.total / limit.value)
                return response.data 
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
            const refreshSuccess = await refreshAccessToken()
            if (refreshSuccess) return getVouchers(true)
        }
            console.error('Error fetching vouchers:', err)
            return { draw: params.draw, recordsTotal: 0, recordsFiltered: 0, data: [] }
        }
    }
    const getPlans = async (params) => {        
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/plans`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.data) {                                
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

    const loadVoucherPlans = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }
        const accessToken = getAccessToken()
        if (!accessToken) throw new Error('No access token found')
        
        try {
            const [voucherResponse, planResponse] = await Promise.all([
                getVouchers(params),
                getPlans(params)
            ])

            const planMap = planResponse.data.reduce((map, plan) => {
                map[plan.id] = plan
                return map
            }, {})

            const voucherPlans = voucherResponse.data.map(voucher => {
                const plan = planMap[voucher.planId]
                return {
                    ...voucher,
                    planName: plan ? plan.name : 'Unknown Plan',
                    planPrice: plan ? plan.price : 0,
                }
            })
            console.log('voucherPlans',voucherPlans)
            vouchers.value = voucherPlans
            totalPages.value = Math.ceil(voucherResponse.total / limit.value)
            return voucherPlans

        } catch (err) {
            if (err.response?.status === 401) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getVouchers(true)
            }
        }
    }
            

    const getVoucherById = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/vouchers/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getVoucherById(id, true)
            }
            error.value = err.message || 'Failed to fetch voucher'
            return null
        } finally {
            isLoading.value = false
        }
    }


    const createVoucher = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/vouchers`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return createVoucher(data, true)
            }
            error.value = err.message || 'Failed to create voucher'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateVoucher = async (id, data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.put(`${apiBase}/vouchers/${id}`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updateVoucher(id, data, true)
            }
            error.value = err.message || 'Failed to update voucher'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deleteVoucher = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.delete(`${apiBase}/vouchers/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return deleteVoucher(id, true)
            }
            error.value = err.message || 'Failed to delete voucher'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const redeemedCode = async(data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')


            const response = await axios.get(`${apiBase}/vouchers/redeem`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })
            
           return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updateVoucher(id, data, true)
            }
            error.value = err.message || 'Failed to redeem voucher'
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
    
    onMounted(getVouchers)

    return {
        vouchers,
        isLoading,
        error,
        getVouchers,
        getVoucherById,
        createVoucher,
        updateVoucher,
        deleteVoucher,
        redeemedCode,
        currentPage,
        totalPages,
        loadVoucherPlans
    }
        
}
