<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { layout } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const displayName = computed(() => authStore.displayName)
const role = computed(() => authStore.role)
const userInitials = computed(() => authStore.initials)

const collapsed = () => layout.sidebar === 'collapse'

const logout = () => {
    authStore.logout()
    router.push('/login')
}

const NAV = [
    {
        section: 'Overview',
        items: [
            { to: '/dashboard', name: 'dashboard', label: 'Dashboard' },
        ],
    },
    {
        section: 'Management',
        items: [
            { to: '/contacts', name: 'contacts', label: 'Contacts' },
            { to: '/users', name: 'users', label: 'Users' },
        ],
    },
    {
        section: 'Content',
        items: [
            { to: '/posts', name: 'posts', label: 'Posts' },
            { to: '/tags', name: 'tags', label: 'Tags' },
        ],
    },
]

const isActive = (to) => route.path === to || route.path.startsWith(to + '/')
</script>

<template>
    <aside
        class="flex-shrink-0 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-[width] duration-200 ease-out overflow-hidden"
        :style="{ width: collapsed() ? '72px' : '260px' }"
    >
        <!-- Logo -->
        <div class="h-[60px] flex items-center gap-2.5 px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <RouterLink to="/dashboard" class="flex items-center gap-2.5 min-w-0">
                <img src="@/assets/images/deltratech-logo.png" alt="Deltra" class="size-8 rounded-lg object-contain flex-shrink-0" />
                <div v-if="!collapsed()" class="overflow-hidden">
                    <div class="font-semibold text-[15px] tracking-tight whitespace-nowrap text-gray-900 dark:text-white">Deltra Admin</div>
                    <div class="text-[11px] text-gray-400 leading-none whitespace-nowrap">Workspace</div>
                </div>
            </RouterLink>
        </div>

        <!-- Nav -->
        <nav class="flex-1 overflow-y-auto scroll-thin px-3 py-4 space-y-5">
            <div v-for="sec in NAV" :key="sec.section">
                <div v-if="!collapsed()" class="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {{ sec.section }}
                </div>
                <div class="space-y-0.5">
                    <RouterLink
                        v-for="item in sec.items"
                        :key="item.to"
                        :to="item.to"
                        :title="collapsed() ? item.label : undefined"
                        class="relative flex items-center gap-3 rounded-lg py-2 text-[13px] font-medium transition-colors no-underline"
                        :class="[
                            collapsed() ? 'justify-center px-2' : 'px-3',
                            isActive(item.to)
                                ? 'bg-brand-primary/[0.07] text-brand-primary dark:bg-brand-primary/10 dark:text-brand-accent'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                        ]"
                    >
                        <!-- Active left bar -->
                        <span v-if="isActive(item.to)" class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-brand-primary" />

                        <!-- Icon -->
                        <svg v-if="item.name === 'dashboard'" class="size-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
                        </svg>
                        <svg v-else-if="item.name === 'contacts'" class="size-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <svg v-else-if="item.name === 'users'" class="size-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="23" y1="11" x2="17" y2="11" /><line x1="20" y1="8" x2="20" y2="14" />
                        </svg>
                        <svg v-else-if="item.name === 'posts'" class="size-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" />
                        </svg>
                        <svg v-else-if="item.name === 'analytics'" class="size-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        <svg v-else-if="item.name === 'tags'" class="size-[18px] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
                        </svg>

<span v-if="!collapsed()" class="flex-1 text-left truncate">{{ item.label }}</span>
                    </RouterLink>
                </div>
            </div>
        </nav>

        <!-- Footer: user + sign out -->
        <div class="p-3 border-t border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div
                class="flex items-center gap-2.5 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="collapsed() ? 'justify-center' : ''"
            >
                <!-- Avatar initials -->
                <div class="size-8 rounded-full bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">{{ userInitials }}</div>
                <div v-if="!collapsed()" class="flex-1 min-w-0">
                    <div class="text-[13px] font-semibold truncate text-gray-900 dark:text-white">{{ displayName }}</div>
                    <div class="text-[11px] text-gray-400 truncate">Superadmin</div>
                </div>
                <button
                    @click="logout"
                    title="Sign out"
                    class="size-8 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                    <svg class="size-[15px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </div>
    </aside>
</template>
