<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContacts } from '@/composables/useContacts'
import { usePosts } from '@/composables/usePosts'

const router = useRouter()
const { getContacts } = useContacts()
const { getPosts } = usePosts()

const contacts = ref([])
const posts = ref([])
const loadingContacts = ref(true)
const loadingPosts = ref(true)

onMounted(async () => {
    contacts.value = await getContacts() ?? []
    loadingContacts.value = false
    posts.value = await getPosts() ?? []
    loadingPosts.value = false
})

const recentContacts = () => contacts.value.slice(0, 5)
const recentPosts = () => posts.value.slice(0, 5)

const statusBadge = (status) => {
    if (status === 'published') return 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500'
    return 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500'
}

const avatarColor = (name = '') => {
    const palette = [
        'from-brand-accent to-brand-primary',
        'from-success-500 to-emerald-600',
        'from-warning-500 to-orange-500',
        'from-error-500 to-rose-600',
        'from-sky-400 to-indigo-500',
    ]
    return palette[(name.charCodeAt(0) || 0) % palette.length]
}

const initials = (name = '') => name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()

const formatDate = (d) => {
    if (!d) return '—'
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
    catch { return d }
}

// Simple sparkline SVG
const sparkPath = (data, w = 120, h = 36, pad = 2) => {
    const max = Math.max(...data), min = Math.min(...data)
    const pts = data.map((v, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2)
        const y = pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2)
        return [x, y]
    })
    return 'M ' + pts.map(p => p.join(',')).join(' L ')
}
const sparkArea = (data, w = 120, h = 36, pad = 2) => {
    const d = sparkPath(data, w, h, pad)
    return d + ` L ${w - pad},${h - pad} L ${pad},${h - pad} Z`
}
</script>

<template>
    <div class="space-y-6">
        <!-- Stat cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Contacts stat -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/80 p-5">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <div class="size-11 rounded-full bg-brand-primary/[0.07] dark:bg-brand-primary/15 text-brand-primary dark:text-brand-accent flex items-center justify-center">
                            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div>
                            <div class="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Total Contacts</div>
                            <div class="text-[26px] font-bold tracking-tight num leading-tight text-gray-900 dark:text-white">
                                <span v-if="loadingContacts" class="opacity-40">—</span>
                                <span v-else>{{ contacts.length }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Sparkline -->
                    <svg width="120" height="36" viewBox="0 0 120 36" class="opacity-80">
                        <defs>
                            <linearGradient id="sg1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#6950E8" stop-opacity="0.25" />
                                <stop offset="100%" stop-color="#6950E8" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        <path :d="sparkArea([12,14,11,15,18,16,20,22,19,24,28,30])" fill="url(#sg1)" />
                        <path :d="sparkPath([12,14,11,15,18,16,20,22,19,24,28,30])" fill="none" stroke="#6950E8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="mt-4 flex items-center gap-2 text-[12px]">
                    <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500">
                        <svg class="size-[11px]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        +12.4%
                    </span>
                    <span class="text-gray-400">vs. last 30 days</span>
                </div>
            </div>

            <!-- Posts stat -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/80 p-5">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <div class="size-11 rounded-full bg-brand-primary/[0.07] dark:bg-brand-primary/15 text-brand-primary dark:text-brand-accent flex items-center justify-center">
                            <svg class="size-5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="13" y2="17" />
                            </svg>
                        </div>
                        <div>
                            <div class="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Total Posts</div>
                            <div class="text-[26px] font-bold tracking-tight num leading-tight text-gray-900 dark:text-white">
                                <span v-if="loadingPosts" class="opacity-40">—</span>
                                <span v-else>{{ posts.length }}</span>
                            </div>
                        </div>
                    </div>
                    <svg width="120" height="36" viewBox="0 0 120 36" class="opacity-80">
                        <defs>
                            <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#11B886" stop-opacity="0.25" />
                                <stop offset="100%" stop-color="#11B886" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        <path :d="sparkArea([8,9,11,10,12,13,12,14,15,14,17,18])" fill="url(#sg2)" />
                        <path :d="sparkPath([8,9,11,10,12,13,12,14,15,14,17,18])" fill="none" stroke="#11B886" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="mt-4 flex items-center gap-2 text-[12px]">
                    <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500">
                        <svg class="size-[11px]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                        +3 this week
                    </span>
                    <span class="text-gray-400">vs. last 30 days</span>
                </div>
            </div>
        </div>

        <!-- Recent tables -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <!-- Recent Contacts -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/80">
                <div class="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60">
                    <div>
                        <h3 class="font-semibold text-[15px] text-gray-900 dark:text-white">Recent Contacts</h3>
                        <p class="text-[12px] text-gray-400 mt-0.5">Latest 5 form submissions</p>
                    </div>
                    <button @click="router.push('/contacts')" class="text-[12px] font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-accent transition-colors">
                        View all →
                    </button>
                </div>
                <div v-if="loadingContacts" class="py-10 text-center text-[13px] text-gray-400">Loading…</div>
                <div v-else class="overflow-x-auto">
                    <table class="w-full text-[13px]">
                        <thead>
                            <tr class="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700/60">
                                <th class="text-left font-semibold px-5 py-2.5">Name</th>
                                <th class="text-left font-semibold px-2 py-2.5">Email</th>
                                <th class="text-left font-semibold px-2 py-2.5">School</th>
                                <th class="text-right font-semibold px-5 py-2.5">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!contacts.length">
                                <td colspan="4" class="px-5 py-8 text-center text-gray-400">No contacts yet.</td>
                            </tr>
                            <tr v-for="c in recentContacts()" :key="c.id" class="row-hover border-b border-gray-50 dark:border-gray-700/40 last:border-0">
                                <td class="px-5 py-3">
                                    <div class="flex items-center gap-2.5">
                                        <div :class="`bg-gradient-to-br ${avatarColor(c.name)} size-7 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`" style="font-size:10px">
                                            {{ initials(c.name) }}
                                        </div>
                                        <span class="font-medium text-gray-900 dark:text-gray-100">{{ c.name }}</span>
                                    </div>
                                </td>
                                <td class="px-2 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{{ c.email }}</td>
                                <td class="px-2 py-3 text-gray-500 dark:text-gray-400 truncate max-w-[130px]">{{ c.schoolName ?? '—' }}</td>
                                <td class="px-5 py-3 text-right text-gray-400 num whitespace-nowrap">{{ formatDate(c.createdAt) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Posts -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700/80">
                <div class="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60">
                    <div>
                        <h3 class="font-semibold text-[15px] text-gray-900 dark:text-white">Recent Posts</h3>
                        <p class="text-[12px] text-gray-400 mt-0.5">Latest drafts and publishes</p>
                    </div>
                    <button @click="router.push('/posts')" class="text-[12px] font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-accent transition-colors">
                        View all →
                    </button>
                </div>
                <div v-if="loadingPosts" class="py-10 text-center text-[13px] text-gray-400">Loading…</div>
                <div v-else class="overflow-x-auto">
                    <table class="w-full text-[13px]">
                        <thead>
                            <tr class="text-[10px] uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700/60">
                                <th class="text-left font-semibold px-5 py-2.5">Title</th>
                                <th class="text-left font-semibold px-2 py-2.5">Status</th>
                                <th class="text-right font-semibold px-5 py-2.5">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!posts.length">
                                <td colspan="3" class="px-5 py-8 text-center text-gray-400">No posts yet.</td>
                            </tr>
                            <tr v-for="p in recentPosts()" :key="p.id" @click="router.push(`/posts/${p.id}/edit`)" class="row-hover cursor-pointer border-b border-gray-50 dark:border-gray-700/40 last:border-0">
                                <td class="px-5 py-3">
                                    <div class="font-medium truncate max-w-[260px] text-gray-900 dark:text-gray-100">{{ p.title }}</div>
                                    <div class="text-[11px] text-gray-400 font-mono">/posts/{{ p.slug }}</div>
                                </td>
                                <td class="px-2 py-3">
                                    <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusBadge(p.status)">
                                        <span class="size-1.5 rounded-full" :class="p.status === 'published' ? 'bg-success-500' : 'bg-warning-500'" />
                                        {{ p.status ?? 'draft' }}
                                    </span>
                                </td>
                                <td class="px-5 py-3 text-right text-gray-400 num whitespace-nowrap">{{ formatDate(p.createdAt) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
