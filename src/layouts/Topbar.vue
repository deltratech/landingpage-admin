<script setup>
import { useRoute } from 'vue-router'
import { toggleTheme, layout, toggleSidebarCollapse } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const route = useRoute()
const authStore = useAuthStore()
const userInitials = computed(() => authStore.initials)

const PAGES = {
    dashboard:    { title: 'Dashboard',     subtitle: 'Overview of contacts, posts, and recent activity' },
    contacts:     { title: 'Contacts',      subtitle: 'Manage school contacts and form submissions' },
    users:        { title: 'Users',         subtitle: 'Team members and permissions' },
    posts:        { title: 'Posts',         subtitle: 'Drafts, published articles, and revisions' },
}

const pageMeta = () => PAGES[route.name] ?? { title: 'Deltra Admin', subtitle: '' }
</script>

<template>
    <header class="h-[60px] flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between gap-4">
        <!-- Left: sidebar toggle + page title -->
        <div class="flex items-center gap-3 min-w-0">
            <button
                @click="toggleSidebarCollapse"
                title="Toggle sidebar"
                class="size-9 rounded-full inline-flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            >
                <svg class="size-[17px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" />
                </svg>
            </button>
            <div class="min-w-0">
                <h1 class="text-[17px] font-semibold tracking-tight truncate text-gray-900 dark:text-white">{{ pageMeta().title }}</h1>
                <div v-if="pageMeta().subtitle" class="text-[11px] text-gray-400 leading-none mt-0.5 truncate">{{ pageMeta().subtitle }}</div>
            </div>
        </div>

        <!-- Right: search + actions -->
        <div class="flex items-center gap-1">
            <!-- Search -->
            <div class="hidden md:flex items-center gap-2 mr-2 px-3 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-800/40 w-[220px]">
                <svg class="size-[15px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    placeholder="Search…"
                    class="bg-transparent outline-none text-[13px] flex-1 placeholder-gray-400 dark:placeholder-gray-500 text-gray-700 dark:text-gray-200"
                />
                <kbd class="hidden lg:inline text-[10px] font-mono text-gray-400 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded px-1.5 leading-5">⌘K</kbd>
            </div>

            <!-- Notifications -->
            <button
                title="Notifications"
                class="size-9 rounded-full inline-flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <span class="relative">
                    <svg class="size-[17px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span class="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-error-500 ring-2 ring-white dark:ring-gray-900" />
                </span>
            </button>

            <!-- Dark mode toggle -->
            <button
                @click="toggleTheme"
                title="Toggle dark mode"
                class="size-9 rounded-full inline-flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <!-- Sun (shown in dark mode) -->
                <svg v-if="layout.theme === 'dark'" class="size-[17px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
                <!-- Moon (shown in light mode) -->
                <svg v-else class="size-[17px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            </button>

            
        </div>
    </header>
</template>
