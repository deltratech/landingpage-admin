<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRequestDemo } from '@/composables/useRequestDemo'

const { getRequestDemos, loading, error } = useRequestDemo()
const demos = ref([])
const query = ref('')

const filtered = computed(() =>
    !query.value
        ? demos.value
        : demos.value.filter(d => d.email.toLowerCase().includes(query.value.toLowerCase()))
)

const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}

onMounted(async () => {
    demos.value = await getRequestDemos() ?? []
})
</script>

<template>
    <div class="space-y-5">
        <!-- Header -->
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <div class="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm">
                <div class="relative flex-1">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 size-[15px] text-gray-400" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input v-model="query" placeholder="Search by email…" class="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow" />
                </div>
            </div>
        </div>

        <!-- Table card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/80">
            <div v-if="loading" class="py-12 text-center text-[13px] text-gray-400">Loading…</div>
            <div v-else-if="error" class="py-12 text-center text-error-500 text-[13px]">{{ error }}</div>
            <div v-else>
                <table class="w-full text-[13px]">
                    <thead>
                        <tr class="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700/60">
                            <th class="text-left font-semibold pl-5 pr-2 py-3 w-12">No.</th>
                            <th class="text-left font-semibold px-2 py-3">Email</th>
                            <th class="text-left font-semibold px-2 py-3">Fullname</th>
                            <th class="text-left font-semibold px-2 py-3">Requested At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!filtered.length">
                            <td colspan="3" class="px-5 py-10 text-center text-gray-400">No demo requests found.</td>
                        </tr>
                        <tr v-for="(d, i) in filtered" :key="d.id" class="row-hover border-b border-gray-50 dark:border-gray-700/40 last:border-0">
                            <td class="pl-5 pr-2 py-3 text-gray-400 num">{{ String(i + 1).padStart(2, '0') }}</td>
                            <td class="px-2 py-3 text-gray-800 dark:text-gray-100 font-medium">{{ d.email }}</td>
                            <td class="px-2 py-3 text-gray-500 dark:text-gray-400 num whitespace-nowrap">{{ d.fullname }}</td>
                            <td class="px-2 py-3 text-gray-500 dark:text-gray-400 num whitespace-nowrap">{{ formatDate(d.createdAt) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-5 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/60 text-[12px] text-gray-500">
                <div>Showing <span class="font-semibold text-gray-700 dark:text-gray-200">{{ filtered.length }}</span> of {{ demos.length }}</div>
            </div>
        </div>
    </div>
</template>
