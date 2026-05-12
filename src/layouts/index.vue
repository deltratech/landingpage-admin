<script setup>
import Topbar from './Topbar.vue'
import Sidebar from './Sidebar.vue'
import { onMounted } from 'vue'
import { initLayout } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
    initLayout()
    authStore.fetchMe()
})
</script>

<template>
    <div class="h-screen flex bg-body dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
        <Sidebar />
        <div class="flex-1 flex flex-col min-w-0">
            <Topbar />
            <main class="flex-1 overflow-y-auto scroll-thin p-6">
                <router-view />
            </main>
        </div>
    </div>
</template>
