<script setup>
import { onMounted, ref, computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useAnalytics } from '@/composables/useAnalytics'

const { loading, error, checkStatus, getOverview, getTimeSeries, getTopPages, getTrafficSources } = useAnalytics()

const isConfigured = ref(null) // null = unknown, true/false after status check
const range = ref('30daysAgo')
const overview = ref(null)
const timeSeries = ref([])
const topPages = ref([])
const trafficSources = ref([])

const RANGES = [
    { label: '7 days',  value: '7daysAgo' },
    { label: '30 days', value: '30daysAgo' },
    { label: '90 days', value: '90daysAgo' },
]

const fmt = (n) => {
    if (!n && n !== 0) return '—'
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
    return String(n)
}

const fmtDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '—'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return m > 0 ? `${m}m ${s}s` : `${s}s`
}

const pct = (n) => (n != null ? (n > 0 ? '+' : '') + n + '%' : null)

const STATS = computed(() => [
    {
        label: 'Total Users',
        value: fmt(overview.value?.users),
        change: overview.value?.changes?.users,
        icon: 'users',
        color: 'brand-primary',
    },
    {
        label: 'Sessions',
        value: fmt(overview.value?.sessions),
        change: overview.value?.changes?.sessions,
        icon: 'sessions',
        color: 'brand-accent',
    },
    {
        label: 'Pageviews',
        value: fmt(overview.value?.pageviews),
        change: overview.value?.changes?.pageviews,
        icon: 'eye',
        color: 'success',
    },
    {
        label: 'Bounce Rate',
        value: overview.value?.bounceRate != null ? (overview.value.bounceRate * 100).toFixed(1) + '%' : '—',
        change: null,
        icon: 'bounce',
        color: 'warning',
        invertChange: true,
    },
])

const chartOptions = computed(() => ({
    chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false }, fontFamily: 'Inter, sans-serif' },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
        type: 'gradient',
        gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02, stops: [0, 100] },
    },
    colors: ['rgb(15,28,46)', 'rgb(30,207,173)'],
    xaxis: {
        categories: timeSeries.value.map(d => {
            const s = String(d.date)
            return `${s.slice(4,6)}/${s.slice(6,8)}`
        }),
        labels: { style: { fontSize: '11px', colors: '#9ca3af' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tickAmount: 7,
    },
    yaxis: { labels: { style: { fontSize: '11px', colors: '#9ca3af' }, formatter: (v) => fmt(v) } },
    grid: { borderColor: '#f3f4f6', strokeDashArray: 4 },
    tooltip: { style: { fontSize: '12px' } },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '12px' },
}))

const chartSeries = computed(() => [
    { name: 'Users',    data: timeSeries.value.map(d => d.users ?? 0) },
    { name: 'Sessions', data: timeSeries.value.map(d => d.sessions ?? 0) },
])

const totalSourceSessions = computed(() => trafficSources.value.reduce((s, c) => s + c.sessions, 0))

const CHANNEL_COLORS = {
    'Organic Search': '#10B981',
    'Direct': '#0f1c2e',
    'Referral': '#6950E8',
    'Organic Social': '#1ecfad',
    'Email': '#F59E0B',
    'Paid Search': '#EF4444',
    'Unassigned': '#9ca3af',
}
const channelColor = (name) => CHANNEL_COLORS[name] ?? '#9ca3af'

const load = async () => {
    const [ov, ts, tp, src] = await Promise.all([
        getOverview(range.value),
        getTimeSeries(range.value),
        getTopPages(range.value),
        getTrafficSources(range.value),
    ])
    overview.value = ov
    timeSeries.value = Array.isArray(ts) ? ts : []
    topPages.value = Array.isArray(tp) ? tp : []
    trafficSources.value = Array.isArray(src) ? src : []
}

const changeRange = async (v) => { range.value = v; await load() }

onMounted(async () => {
    const status = await checkStatus()
    isConfigured.value = status?.configured ?? false
    if (isConfigured.value) await load()
})
</script>

<template>
    <div class="space-y-5">

        <!-- Not configured banner -->
        <div v-if="isConfigured === false"
            class="flex items-start gap-4 px-5 py-4 rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-100 dark:border-warning-500/20 text-[13px]">
            <svg class="size-5 text-warning-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
                <p class="font-semibold text-warning-700 dark:text-warning-400">Google Analytics not configured</p>
                <p class="text-warning-600 dark:text-warning-500 mt-1">Add these three variables to your backend <code class="font-mono bg-warning-100 dark:bg-warning-500/20 px-1 rounded">.env</code> to connect real GA4 data:</p>
                <pre class="mt-2 text-[12px] font-mono bg-warning-100 dark:bg-warning-500/20 rounded-lg px-3 py-2 text-warning-800 dark:text-warning-300 leading-relaxed">GA_PROPERTY_ID=123456789
GA_CLIENT_EMAIL=my-sa@project.iam.gserviceaccount.com
GA_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...</pre>
                <p class="mt-2 text-warning-600 dark:text-warning-500">Get these from your Google Cloud service account credentials JSON. See the Analytics setup guide for details.</p>
            </div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <div v-if="isConfigured" class="flex items-center gap-1.5 text-[12px] text-success-600 dark:text-success-400 font-medium">
                <span class="size-1.5 rounded-full bg-success-500 animate-pulse" />
                Live via Google Analytics 4
            </div>
            <div v-else class="div" />
            <div class="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button v-for="r in RANGES" :key="r.value" @click="changeRange(r.value)"
                    class="px-3 h-7 rounded-md text-[12px] font-medium transition-colors"
                    :class="range === r.value
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'">
                    {{ r.label }}
                </button>
            </div>
        </div>

        <!-- Stat cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="stat in STATS" :key="stat.label"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 p-5">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-[12px] font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</span>
                    <div class="size-8 rounded-lg flex items-center justify-center"
                        :class="stat.color === 'brand-primary' ? 'bg-brand-primary/[0.07] text-brand-primary dark:bg-brand-primary/10 dark:text-brand-accent'
                              : stat.color === 'brand-accent'  ? 'bg-brand-accent/10 text-brand-accent'
                              : stat.color === 'success'       ? 'bg-success-50 text-success-600 dark:bg-success-500/15'
                              : 'bg-warning-50 text-warning-600 dark:bg-warning-500/15'">
                        <svg v-if="stat.icon === 'users'" class="size-[15px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <svg v-else-if="stat.icon === 'sessions'" class="size-[15px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        <svg v-else-if="stat.icon === 'eye'" class="size-[15px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <svg v-else class="size-[15px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                    </div>
                </div>
                <div v-if="loading" class="h-7 w-20 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                <div v-else>
                    <div class="text-[22px] font-bold tracking-tight text-gray-900 dark:text-white num">{{ stat.value }}</div>
                    <div v-if="stat.change != null" class="mt-1 text-[11px] font-medium"
                        :class="(stat.invertChange ? stat.change < 0 : stat.change > 0)
                            ? 'text-success-600 dark:text-success-400'
                            : stat.change === 0 ? 'text-gray-400'
                            : 'text-error-500'">
                        {{ pct(stat.change) }} vs prev period
                    </div>
                </div>
            </div>
        </div>

        <!-- Chart + Traffic sources -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

            <!-- Area chart -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 p-5">
                <h2 class="text-[14px] font-semibold text-gray-900 dark:text-white mb-4">Traffic over time</h2>
                <div v-if="loading" class="h-[260px] flex items-center justify-center text-[13px] text-gray-400">Loading chart…</div>
                <div v-else-if="!timeSeries.length" class="h-[260px] flex flex-col items-center justify-center text-gray-400">
                    <svg class="size-10 opacity-30 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <p class="text-[13px]">No data for this period.</p>
                </div>
                <VueApexCharts v-else type="area" height="260" :options="chartOptions" :series="chartSeries" />
            </div>

            <!-- Traffic sources -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 p-5">
                <h2 class="text-[14px] font-semibold text-gray-900 dark:text-white mb-4">Traffic sources</h2>
                <div v-if="loading" class="space-y-3">
                    <div v-for="i in 5" :key="i" class="h-8 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
                </div>
                <div v-else-if="!trafficSources.length" class="flex flex-col items-center justify-center h-[200px] text-gray-400">
                    <p class="text-[13px]">No source data.</p>
                </div>
                <div v-else class="space-y-3">
                    <div v-for="src in trafficSources" :key="src.channel">
                        <div class="flex items-center justify-between mb-1">
                            <div class="flex items-center gap-2">
                                <span class="size-2 rounded-full flex-shrink-0" :style="{ background: channelColor(src.channel) }" />
                                <span class="text-[12px] font-medium text-gray-700 dark:text-gray-300">{{ src.channel }}</span>
                            </div>
                            <span class="text-[12px] text-gray-500 num">{{ fmt(src.sessions) }}</span>
                        </div>
                        <div class="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-500"
                                :style="{ width: totalSourceSessions ? (src.sessions / totalSourceSessions * 100).toFixed(1) + '%' : '0%', background: channelColor(src.channel) }" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Top pages -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h2 class="text-[14px] font-semibold text-gray-900 dark:text-white">Top pages</h2>
            </div>
            <div v-if="loading" class="py-10 text-center text-[13px] text-gray-400">Loading…</div>
            <div v-else-if="!topPages.length" class="py-12 text-center text-gray-400">
                <p class="text-[13px]">No page data available.</p>
            </div>
            <table v-else class="w-full">
                <thead>
                    <tr class="border-b border-gray-100 dark:border-gray-700">
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Page</th>
                        <th class="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Views</th>
                        <th class="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Users</th>
                        <th class="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Avg. time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="page in topPages" :key="page.path" class="row-hover border-b border-gray-50 dark:border-gray-700/60 last:border-0">
                        <td class="px-5 py-3">
                            <span class="font-mono text-[12px] text-gray-700 dark:text-gray-300 truncate block max-w-[320px]">{{ page.path }}</span>
                            <span v-if="page.title" class="text-[11px] text-gray-400 truncate block">{{ page.title }}</span>
                        </td>
                        <td class="px-5 py-3 text-right num text-[13px] text-gray-700 dark:text-gray-300 font-medium">{{ fmt(page.pageviews) }}</td>
                        <td class="px-5 py-3 text-right num text-[13px] text-gray-500 hidden md:table-cell">{{ fmt(page.users) }}</td>
                        <td class="px-5 py-3 text-right num text-[13px] text-gray-500 hidden lg:table-cell">{{ fmtDuration(page.avgDuration) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
