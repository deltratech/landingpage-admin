import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL
const apiKey = 'sHCEtVx2mVXIa6ZUkigfd'

export function usePhotos() {
    const photos = ref([])    
    const dirs = ref([])    
    const isLoading = ref(false)
    const error = ref(null)
    const getAccessToken = () => localStorage.getItem('accessToken')
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(10)
    
    const getPhotos = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/photos`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params  
            })
            
            if (response.data) {
                photos.value = response.data.data
                
                totalPages.value = Math.ceil(response.data.total / limit.value)
                console.log("totalPages", totalPages.value)
                return response.data 
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
            const refreshSuccess = await refreshAccessToken()
            if (refreshSuccess) return getPlans(true)
        }
            console.error('Error fetching photos:', err)
            
        }
    }

    const getTransactions = async () => {
        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/transactions`, {
                headers: { 'x-api-key': `${apiKey}` }            
            })

            if (response.data) {           
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
            
        }
    }

    const loadPhotos = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }

        try {
            const [photosResponse, transactionsResponse] = await Promise.all([
                getPhotos(params),
                getTransactions(),
            ]);

            totalPages.value = Math.ceil(photosResponse.total / limit.value);

            const transactionMap = transactionsResponse.data.reduce((map, transaction) => {
                map[transaction.id] = {
                    planName: transaction.planName,
                    customerName: transaction.customerName,
                    customerEmail: transaction.customerEmail
                  }
                
                return map;
            }, {});
            
            const photosWithPlanName = photosResponse.data
            .map((photo) => {
                const transaction = transactionMap[photo.transactionId?.toString()];
                if (!transaction) return null; // tandai untuk disaring nanti
                return {
                    ...photo,
                    planName: transaction.planName,
                    customerName: transaction.customerName,
                    customerEmail: transaction.customerEmail
                };
            })
            .filter(photo => photo !== null);

            photos.value = photosWithPlanName
            console.log("photos", photos.value)
        } catch (err) {
            console.error('Error loading booths:', err);
        }
    }

    const getUserPhotos = async (id) => {
        try {
            const response = await axios.get(`${apiBase}/transactions/${id}`, {
                headers: { 'x-api-key': `${apiKey}` },                
            })

            if (response.data) {           
                photos.value = response.data.data.photos
                
                return response.data.data.photos
            } else {
                throw new Error('Invalid response format')
            }
        } catch (err) {
            if (err.response?.status === 401) {
            
                console.error('Error fetching photo:', err)
            }
            
            
        }
    }
    

    const loadDirs = async () => {
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
                const transactions = response.data.data

                // Ambil total photos dari masing-masing transaksi
                const photoFetches = await Promise.all(transactions.map(async (t) => {
                    try {
                        const detailRes = await axios.get(`${apiBase}/transactions/${t.id}`, {
                            headers: { 'x-api-key': `${apiKey}` }            
                        })
                        return {
                            ...t,
                            totalPhotos: detailRes.data?.data?.photos?.length || 0 // tergantung struktur respons detail
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch detail for transaction ${t.id}`)
                        return { ...t, totalPhotos: 0 }
                    }
                }))

                dirs.value = photoFetches
                totalPages.value = Math.ceil(response.data.dtotal / limit.value)

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
      

    

    const getPhotoId = async (id, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.get(`${apiBase}/photos/${id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return getPlanById(id, true)
            }
            error.value = err.message || 'Failed to fetch photo'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const uploadPhoto = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/photos/upload`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}`, 
                           'Content-Type': 'multipart/form-data' 
                        },             
                
            })

            return response.data
        } catch (err) {
           
            error.value = err.message || 'Failed to create photo'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const deletePhoto = async (id, data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.delete(`${apiBase}/photos/${id}`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                if (refreshSuccess) return updatePlan(id, data, true)
            }
            error.value = err.message || 'Failed to update photo'
            return null
        } finally {
            isLoading.value = false
        }
    }

    const bulkUpload = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/photos/bulk-upload`, data, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            })

            return response.data
        } catch (err) {
            if (err.response?.status === 401 && !retry) {
                const refreshSuccess = await refreshAccessToken()
                
            }
            error.value = err.message || 'Failed to delete photo'
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
     

    

    return {
        photos,
        dirs,
        isLoading,
        error,
        getPhotos,
        getPhotoId,
        uploadPhoto,
        deletePhoto,
        getUserPhotos,
        bulkUpload,
        loadPhotos,
        loadDirs,
        currentPage,
        totalPages,
        limit
    }
}
