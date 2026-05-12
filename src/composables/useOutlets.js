import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

export function useOutlets() {
    const outlets = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const getAccessToken = () => localStorage.getItem('accessToken')
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(10)
    

    const getOutlets = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/outlets`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.data) {
                outlets.value = response.data.data
                totalPages.value = Math.ceil(response.data.total / limit.value)
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
            return { draw: params.draw, recordsTotal: 0, recordsFiltered: 0, data: [] }
        }
  }

    const loadBoothsWithOutletName = async (boothsParams, outletsParams) => {
        try {
        // Panggil kedua endpoint secara bersamaan
        const [boothsResponse, outletsResponse] = await Promise.all([
            getBooths(boothsParams),
            getOutlets(outletsParams)
        ]);
    
        // Buat objek map untuk outlet dengan id sebagai key dan name sebagai value
        const outletsMap = outletsResponse.data.reduce((map, outlet) => {
            map[outlet.id] = outlet.name;
            return map;
        }, {});
    
        // Mapping data booth dan tambahkan outletName berdasarkan outletId
        const boothsWithOutletName = boothsResponse.data.map(booth => ({
            ...booth,
            outletName: outletsMap[booth.outletId] || 'Outlet tidak ditemukan'
        }));
    
        return boothsWithOutletName;
        } catch (err) {
        console.error('Error saat memuat data booth dengan outlet name:', err);
        throw err;
        }
    }
  

    const getOutletById = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/outlets/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getOutletById(id, true)
            }
            error.value = err.message || 'Failed to fetch outlet'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createOutlet = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/outlets`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return createOutlet(data, true)
            }
            error.value = err.message || 'Failed to create outlet'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateOutlet = async (id, data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.put(`${apiBase}/outlets/${id}`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updateOutlet(id, data, true)
            }
            error.value = err.message || 'Failed to update outlet'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deleteOutlet = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.delete(`${apiBase}/outlets/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return deleteOutlet(id, true)
            }
            error.value = err.message || 'Failed to delete outlet'
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

    onMounted(getOutlets)

    return {
        outlets,
        isLoading,
        error,
        getOutlets,
        getOutletById,
        createOutlet,
        updateOutlet,
        deleteOutlet,
        currentPage,
        totalPages,
    }
}
