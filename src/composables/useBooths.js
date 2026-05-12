import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL;

export function useBooths() {
    const booths = ref([]);
    const outlets = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const currentPage = ref(1)
    const totalPages = ref(0)
    const limit = ref(10)

    const getAccessToken = () => localStorage.getItem('accessToken');

    const getBooths = async (params) => {
        try {
            const accessToken = getAccessToken();
            if (!accessToken) throw new Error('No access token found');

            const response = await axios.get(`${apiBase}/booths`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params,
            });

            if (response.data) {
                return response.data;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching booths:', err);
        }
    };

    const getOutlets = async (params) => {
        try {
            const accessToken = getAccessToken();
            if (!accessToken) throw new Error('No access token found');

            const response = await axios.get(`${apiBase}/outlets`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
                params: params,
            });

            if (response.data) {
                return response.data;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching outlets:', err);
        }
    }

    const createBooth = async (data, retry = false) => {
        isLoading.value = true
        error.value = null

        try {
            const accessToken = getAccessToken()
            if (!accessToken) throw new Error('No access token found')

            const response = await axios.post(`${apiBase}/booths`, data, {
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

    const loadBooths = async () => {
        const params = {
            page: currentPage.value,
            limit: limit.value,
        }

        try {
            const [boothsResponse, outletsResponse] = await Promise.all([
                getBooths(params),
                getOutlets(),
            ]);

            totalPages.value = Math.ceil(boothsResponse.total / limit.value);

            const outletsMap = outletsResponse.data.reduce((map, outlet) => {
                map[outlet.id] = outlet.name;
                return map;
            }, {});

            const boothsWithOutletName = boothsResponse.data.map((booth) => ({
                ...booth,
                outletName: outletsMap[booth.outletId] || 'Outlet tidak ditemukan',
            }));

            booths.value = boothsWithOutletName;
        } catch (err) {
            console.error('Error loading booths:', err);
        }
    }

    const getBoothByOutletId = async (outletId) => {
        try {
            const accessToken = getAccessToken();
            if (!accessToken) throw new Error('No access token found');
            
            const [boothsResponse, outletsResponse] = await Promise.all([
                getBooths(),
                getOutlets(),
            ]);
            
            const outletsMap = outletsResponse.data.reduce((map, outlet) => {
                map[outlet.id] = outlet.name
                return map
            }, {});

            console.log(outletId)
            

            const boothsWithOutletName = boothsResponse.data.map((booth) => ({
                ...booth,
                outletName: outletsMap[booth.outletId] || 'Outlet tidak ditemukan',
            }))

            
            return boothsWithOutletName.filter(booth => booth.outletId === outletId)
            
            
        } catch (err) {
            console.error('Error fetching booths by outlet ID:', err);
        }
    }

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token found');

            const response = await axios.post(`${apiBase}/auth/refresh`, { token: refreshToken });
            localStorage.setItem('accessToken', response.data.accessToken);
            return true;
        } catch (err) {
            console.error('Error refreshing access token:', err);
            return false;
        }
    }

 

    onMounted(loadBooths);

    return {
        booths,
        isLoading,
        error,
        getBooths,
        loadBooths,
        currentPage,
        totalPages,
        createBooth,
        getBoothByOutletId,
    };
}
