<script setup>
import { ref, onMounted } from 'vue'
import ApexCharts from 'vue3-apexcharts'
import { useReports } from '@/composables/useReports' // Assuming this composable provides the API function
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns'
const { getPaymentMethodStatistics } = useReports()

const chartOptions = ref({
    labels: [], // To be populated dynamically
    colors: ["#323a46", "#6a69f5", "#50cd89"], // Customize this as needed
    chart: {
        background: 'transparent',
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false
    },
    legend: {
        show: false,
    },
    plotOptions: {
        pie: {
            expandOnClick: false,
            donut: {
                size: '75%',
                labels: {
                    show: false,
                },
            },
        },
    },
    states: {
        active: {
            filter: {
                type: 'none'
            }
        },
        hover: {
            filter: {
                type: 'none'
            }
        },
    },
    stroke: {
        width: 0.5
    },
    tooltip: {
        fillSeriesColor: false,
        marker: {
            show: false,
        },
        custom: function ({ seriesIndex, dataPointIndex, w }) {
            const color = w.config.colors[seriesIndex];
            const label = w.config.labels[seriesIndex];
            const value = w.config.series[seriesIndex];

            return `
    <div class="p-2.5 text-sm font-semibold rounded-lg overflow-hidden shadow-none" style="background: ${color};">
      ${label} ${value}
    </div>
  `;
        },
    },
})

// Data series, initialized to an empty array which will be populated with the API data
const chartData = ref({
    series: [],
})

const paymentData = ref({})

// To store the payment method summary data for different date ranges
const paymentMethodSummary = ref({
    today: null,
    week: null,
    month: null,
    year: null,
})


const transactionReports = ref({
    today: { startDate: format(new Date(), 'yyyy-MM-dd'), endDate: format(new Date(), 'yyyy-MM-dd'), outletId: null },
    week: { startDate: format(startOfWeek(new Date()), 'yyyy-MM-dd'), endDate: format(endOfWeek(new Date()), 'yyyy-MM-dd'), outletId: null },
    month: { startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'), endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'), outletId: null },
    year: { startDate: format(new Date(), 'yyyy-01-01'), endDate: format(new Date(), 'yyyy-12-31'), outletId: null },
})

// Fetching the payment method statistics from the API
const fetchPaymentMethodStatistic = async (dateRange) => {
    try {
        const resp = await getPaymentMethodStatistics(transactionReports.value[dateRange])
        paymentMethodSummary.value[dateRange] = resp.data.items
        console.log('Payment Method: ', resp.data.items)

        // Process the response data and update the chart
        const seriesData = []
        const labelsData = []

        // Assuming that `resp.data.items` is an array of payment methods with `name` and `total`/`percentage`
        resp.data.items.forEach(item => {
            seriesData.push(item.totalTransactions) // You may need to adjust the key depending on the actual API response
            labelsData.push(item.paymentMethod.toUpperCase())  // Assuming `name` is the key for payment method name
        })

        // Update chart data and options
        chartData.value.series = seriesData
        chartOptions.value = { ...chartOptions.value, labels: labelsData } // Reassign to trigger reactivity
        paymentData.value = resp.data.items
    } catch (err) {
        console.error('Error fetching report:', err)
    }
}

onMounted(() => {  
    fetchPaymentMethodStatistic('month')    
})
</script>



<template>
    <div class="lg:col-span-3">
        <div class="card card-dark h-[calc(100%-24px)]">
            <div class="flex flex-col justify-between h-full card-body">
                <div class="flex items-center justify-between gap-8">
                    <h6 class="text-lg font-medium text-center">Metode Pembayaran yang sering digunakan</h6>
                </div>
                <ApexCharts type="donut" :options="chartOptions" :series="chartData.series" height="142" />
                <div class="overflow-auto" data-simplebar>
                    
                    <table class="table-bordered">
                        <tbody>
                            <tr v-for="(item, index) in paymentData" :key="index" class="text-gray-900 dark:text-white">
                                <td class="p-0" >
                                    <div class="flex items-center gap-2 ps-6 min-w-28">
                                        <div class="flex items-center justify-center size-6">
                                            
                                        </div>
                                        
                                        <p class="font-medium">{{ item.paymentMethod.toUpperCase() }}</p>
                                    </div>
                                </td>
                                <td>
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ item.totalTransactions }}
                                    </p>
                                </td>
                                <td class="pe-4">
                                    <p>{{ item.percentage }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>