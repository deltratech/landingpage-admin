import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

export function useUsers() {
    const users = ref([])
    const outlets = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const getAccessToken = () => localStorage.getItem('accessToken')
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(10)
    
    const getUsers = async (params) => {
        
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/user`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })

            if (response.data) {
                users.value = response.data.data
                
                return response.data 
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            console.log('Error fetching users:', err,response)
            if (err.response?.statusCode === '401') {
                const refreshSuccess = await refreshAccessToken()
                console.log('refreshSuccess',refreshSuccess)
                if (refreshSuccess) return getUsers(params)
                
            }            
            
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

    const loadUsers = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }
        try {
            const [usersResp, outletsResp] = await Promise.all([
                getUsers(params),
                getOutlets(params2)
            ])

            const outletsMap = outletsResp.data.reduce((map, outlet) => {
                map[outlet.id] = outlet.name;
                return map;
            }, {});


            const usersWithOutletName = usersResp.data.map(user => ({
                ...user,
                outletName: outletsMap[user.outlet_id] || 'Outlet tidak ditemukan'
            }))            
            totalPages.value = Math.ceil(usersResp.total / limit.value)            
            users.value = usersWithOutletName
        } catch (err) {
            console.error('Error saat memuat data booth dengan outlet name:', err);
            throw err;
        }
    } 

    const getUserById = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/user/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.statusCode === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getUserById(id, true)
            }
            error.value = err.message || 'Failed to fetch user'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const createUser = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/auth/register`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return createUser(data, true)
            }
            error.value = err.message || 'Failed to create user'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const updateUser = async (id, data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.patch(`${apiBase}/user/${id}`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updateUser(id, data, true)
            }
            error.value = err.message || 'Failed to update user'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deleteUser = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.delete(`${apiBase}/user/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return deleteUser(id, true)
            }
            error.value = err.message || 'Failed to delete user'
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
            console.error('Error refreshing token:', err)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
       
            return false
        }
    }

    onMounted(getUsers)

    return {
        users,
        isLoading,
        error,
        getUsers,
        loadUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        currentPage,
        totalPages
    }
}
