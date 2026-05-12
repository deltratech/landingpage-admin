<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const router = useRouter()
const { getPosts, deletePost, loading, error } = usePosts()
const posts = ref([])
const tab = ref('all')
const showConfirm = ref(false)
const deleteId = ref(null)
const flashMsg = ref('')
const openMenu = ref(null)

const toggleMenu = (id) => { openMenu.value = openMenu.value === id ? null : id }
const closeMenu = () => { openMenu.value = null }

const handleClickOutside = (e) => {
    if (!e.target.closest('[data-menu]')) closeMenu()
}
onMounted(async () => {
    posts.value = await getPosts() ?? []
    document.addEventListener('click', handleClickOutside)
})
import { onUnmounted } from 'vue'
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const flash = (msg) => {
    flashMsg.value = msg
    setTimeout(() => { flashMsg.value = '' }, 4000)
}

const filtered = computed(() => {
    if (tab.value === 'all') return posts.value
    return posts.value.filter(p => (p.status ?? 'draft') === tab.value)
})

const countBy = (s) => posts.value.filter(p => (p.status ?? 'draft') === s).length

const confirmDelete = (id) => { deleteId.value = id; showConfirm.value = true }
const handleDelete = async () => {
    await deletePost(deleteId.value)
    posts.value = posts.value.filter(p => p.id !== deleteId.value)
    showConfirm.value = false
    flash('Post deleted.')
}

const avatarColor = (name = '') => {
    const p = ['from-brand-accent to-brand-primary','from-success-500 to-emerald-600','from-warning-500 to-orange-500','from-error-500 to-rose-600','from-sky-400 to-indigo-500']
    return p[(name.charCodeAt(0) || 0) % p.length]
}
const initials = (name = '') => name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()

</script>

<template>
    <div class="space-y-5">
        <!-- Flash -->
        <div v-if="flashMsg" class="pop-in">
            <div class="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium bg-error-50 text-error-700 border border-error-100">
                {{ flashMsg }}
            </div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between gap-3 flex-wrap">
            <!-- Tabs -->
            <div class="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button v-for="t in [{ id: 'all', label: 'All', count: posts.length }, { id: 'published', label: 'Published', count: countBy('published') }, { id: 'draft', label: 'Drafts', count: countBy('draft') }]"
                    :key="t.id"
                    @click="tab = t.id"
                    class="px-3 h-7 rounded-md text-[12px] font-medium transition-colors flex items-center gap-1.5"
                    :class="tab === t.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'"
                >
                    {{ t.label }}
                    <span class="text-[10px] text-gray-400 num">{{ t.count }}</span>
                </button>
            </div>
            <button @click="router.push('/posts/new')" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm">
                <svg class="size-[15px]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Post
            </button>
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
                            <th class="text-left font-semibold px-2 py-3">Title</th>
                            <th class="text-left font-semibold px-2 py-3">Slug</th>
                            <th class="text-left font-semibold px-2 py-3">Status</th>
                            <th class="text-left font-semibold px-2 py-3">Date</th>
                            <th class="text-right font-semibold pr-5 pl-2 py-3 w-16">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!filtered.length">
                            <td colspan="6" class="px-5 py-10 text-center text-gray-400">No posts found.</td>
                        </tr>
                        <tr v-for="(p, i) in filtered" :key="p.id" class="row-hover border-b border-gray-50 dark:border-gray-700/40 last:border-0">
                            <td class="pl-5 pr-2 py-3 text-gray-400 num">{{ String(i + 1).padStart(2, '0') }}</td>
                            <td class="px-2 py-3 max-w-[320px]">
                                <button @click="router.push(`/posts/${p.id}/edit`)" class="font-medium text-brand-primary dark:text-brand-accent hover:underline text-left truncate block max-w-full transition-colors">
                                    {{ p.title }}
                                </button>
                            </td>
                            <td class="px-2 py-3 font-mono text-[12px] text-gray-500 dark:text-gray-400 truncate max-w-[180px]">/{{ p.slug }}</td>
                            <td class="px-2 py-3">
                                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                                    :class="(p.status ?? 'draft') === 'published' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500'">
                                    <span class="size-1.5 rounded-full" :class="(p.status ?? 'draft') === 'published' ? 'bg-success-500' : 'bg-warning-500'" />
                                    {{ p.status ?? 'draft' }}
                                </span>
                            </td>
                            <td class="px-2 py-3 text-gray-400 num whitespace-nowrap">
                                {{ p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }}
                            </td>
                            <td class="pr-5 pl-2 py-3 text-right">
                                <div class="relative inline-block" data-menu>
                                    <button @click.stop="toggleMenu(p.id)" class="size-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex items-center justify-center text-gray-500 transition-colors">
                                        <svg class="size-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" /></svg>
                                    </button>
                                    <div v-if="openMenu === p.id" class="absolute right-0 top-full mt-1 z-30 min-w-[140px] py-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-dialog pop-in">
                                        <button @click="closeMenu(); router.push(`/posts/${p.id}/edit`)" class="w-full px-3 py-1.5 text-[13px] flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                                            <svg class="size-[14px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            Edit
                                        </button>
                                        <div class="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                                        <button @click="closeMenu(); confirmDelete(p.id)" class="w-full px-3 py-1.5 text-[13px] flex items-center gap-2 text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
                                            <svg class="size-[14px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
        <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showConfirm = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[420px] border border-gray-100 dark:border-gray-700 pop-in p-6">
                <div class="size-11 rounded-full bg-error-50 dark:bg-error-500/15 text-error-600 flex items-center justify-center mb-4">
                    <svg class="size-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                </div>
                <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">Delete post?</h3>
                <p class="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400">Are you sure you want to delete this post? This action can't be undone.</p>
                <div class="mt-6 flex justify-end gap-2">
                    <button @click="showConfirm = false" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button @click="handleDelete" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] bg-error-500 text-white hover:bg-error-600">Delete post</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
