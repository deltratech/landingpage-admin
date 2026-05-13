import { ref } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE_URL

function authHeaders() {
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

async function get(path, params = {}) {
    const res = await axios.get(`${apiBase}/analytics/${path}`, {
        headers: authHeaders(),
        params,
    })
    return res.data?.data ?? res.data
}

export function useAnalytics() {
    const loading = ref(false)
    const error = ref(null)

    const wrap = async (fn) => {
        loading.value = true
        error.value = null
        try {
            return await fn()
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch analytics.'
            return null
        } finally {
            loading.value = false
        }
    }

    const checkStatus = () => wrap(() => get('status'))
    const getOverview = (startDate = '30daysAgo', endDate = 'today') => wrap(() => get('overview', { startDate, endDate }))
    const getTimeSeries = (startDate = '30daysAgo', endDate = 'today') => wrap(() => get('timeseries', { startDate, endDate }))
    const getTopPages = (startDate = '30daysAgo', endDate = 'today') => wrap(() => get('top-pages', { startDate, endDate }))
    const getTrafficSources = (startDate = '30daysAgo', endDate = 'today') => wrap(() => get('traffic-sources', { startDate, endDate }))

    return { loading, error, checkStatus, getOverview, getTimeSeries, getTopPages, getTrafficSources }
}
