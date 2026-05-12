<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import ApexCharts from 'apexcharts'
import { format, startOfWeek, endOfWeek } from 'date-fns'
import { useReports } from '@/composables/useReports'

const { getReportTransaction } = useReports()

const apex_area3 = {
    series: [
        {
            data: [],
        },
    ],
    chart: {
        type: 'bar',
        stacked: true,
        zoom: { enabled: false },
        toolbar: { show: false },
        height: 300,
        offsetY: 20,
        offsetX: -5,
    },
    plotOptions: {
        bar: {
            columnWidth: '18.5%',
            distributed: true,
            borderRadius: 9,
            borderRadiusApplication: 'end',
        },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    zoom: { enabled: false },
    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    xaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: { show: true },
    },
    yaxis: {
        tickAmount: 5,
        min: 0,        
        labels: {
            formatter: function (value) {
                return value >= 1000 ? value / 1000 + 'K' : value.toLocaleString()
            },
            offsetX: -10,
            offsetY: 0,
            style: { fontSize: '12px', cssClass: 'apexcharts-yaxis-title' },
        },
        opposite: false,
    },
    grid: { strokeDashArray: 3 },
    colors: ['#6950E8', '#e5e7eb', '#6950E8', '#e5e7eb', '#6950E8', '#e5e7eb', '#6950E8'],
    tooltip: {
        marker: { show: false },
        y: {
            formatter: function (value) {
                return value >= 1000 ? value / 1000 + 'K' : value.toLocaleString()
            },
        },
        custom: function ({ series, seriesIndex, dataPointIndex }) {
            const labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
            const xLabel = labels[dataPointIndex]
            const yValue = series[seriesIndex][dataPointIndex]

            const formattedYValue = yValue >= 1000 ? yValue / 1000 + 'K' : yValue.toLocaleString()

            return `<div class="p-2.5 text-sm font-semibold">${xLabel}: Rp ${formattedYValue}</div>`
        },
    },
}

const transactionReports = ref({
    week: { startDate: format(startOfWeek(new Date()), 'yyyy-MM-dd'), endDate: format(endOfWeek(new Date()), 'yyyy-MM-dd'), outletId: null },
})

const chartData = ref({
    series: [], 
})

const chartInstance = ref(null)
const weeklyData = [0, 0, 0, 0, 0, 0, 0]
const fetchTransactionStatistic = async (dateRange) => {
    try {
        const resp = await getReportTransaction(transactionReports.value[dateRange])

        console.log('Transaction Summary for Week: ', resp.data)

        // Initialize the data for each day of the week (0-6 for Mon-Sun)
        

        // Populate the weekly data based on the API response
        resp.data.items.forEach((item) => {
            const dayIndex = new Date(item.date).getDay() // Get day index (0 = Sun, 1 = Mon, ...)
            weeklyData[dayIndex] = item.totalRevenue // Populate the corresponding day with revenue
        })

        // Update chartData with the new data
        chartData.value.series = [{
            data: weeklyData,
        }]
    } catch (err) {
        console.error('Error fetching report:', err)
    }
}

const renderChart = () => {
    if (!chartInstance.value) {
        // Initialize the chart only once
        chartInstance.value = new ApexCharts(document.querySelector('#apex_area1'), apex_area3)
        chartInstance.value.render()
    } else {
        // Update the chart when new data is fetched
        chartInstance.value.updateOptions({
            series: chartData.value.series
        })
    }
}

// Watch the chartData for changes and update the chart accordingly
watch(() => chartData.value.series, () => {
    nextTick(() => {
        renderChart() // Re-render the chart after DOM is updated
    })
})

onMounted(() => {
    fetchTransactionStatistic('week')
    chartData.value.series = [{ data: weeklyData }]  
})
</script>

<template>
    <div class="lg:col-span-2">
        <div class="card card-dark h-[calc(100%-24px)]">
            <div class="flex flex-col justify-between h-full card-body">
                <div class="flex items-center justify-between gap-8">
                    <h6 class="text-lg font-medium">Penjualan Minggu ini</h6>
                </div>
                <div class="-mt-5 chart-container">
                    <div id="apex_area1" class="apex-charts" dir="ltr"></div>
                </div>
            </div>
        </div>
    </div>
</template>
