<script setup>
import { onMounted, ref, computed } from 'vue'
import { useTags } from '@/composables/useTags'

const { tags, loading, error, getTags, createTag, updateTag, deleteTag } = useTags()

const search = ref('')
const flashMsg = ref('')
const flashTone = ref('')
const showForm = ref(false)
const showConfirm = ref(false)
const editTarget = ref(null)
const deleteId = ref(null)
const submitting = ref(false)
const apiError = ref('')
const form = ref({ name: '' })

const TAG_COLORS = ['#0f1c2e','#1ecfad','#6950E8','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#0EA5E9']

const filtered = computed(() => {
    const q = search.value.toLowerCase()
    return q ? tags.value.filter(t => t.name?.toLowerCase().includes(q)) : tags.value
})

const flash = (tone, msg) => {
    flashTone.value = tone; flashMsg.value = msg
    setTimeout(() => { flashMsg.value = '' }, 4000)
}

const tagColor = (name = '') => TAG_COLORS[(name.charCodeAt(0) || 0) % TAG_COLORS.length]

const openCreate = () => { editTarget.value = null; form.value = { name: '' }; apiError.value = ''; showForm.value = true }
const openEdit = (tag) => { editTarget.value = tag; form.value = { name: tag.name ?? '' }; apiError.value = ''; showForm.value = true }

const handleSubmit = async () => {
    if (!form.value.name.trim()) { apiError.value = 'Tag name is required.'; return }
    submitting.value = true
    apiError.value = ''
    try {
        if (editTarget.value) {
            const res = await updateTag(editTarget.value.id, form.value)
            if (res) { await getTags(); showForm.value = false; flash('success', 'Tag updated.') }
            else apiError.value = error.value || 'Failed to update tag.'
        } else {
            const res = await createTag(form.value)
            if (res) { await getTags(); showForm.value = false; flash('success', `Tag "${form.value.name}" created.`) }
            else apiError.value = error.value || 'Failed to create tag.'
        }
    } finally {
        submitting.value = false
    }
}

const confirmDelete = (id) => { deleteId.value = id; showConfirm.value = true }
const handleDelete = async () => {
    await deleteTag(deleteId.value)
    await getTags()
    showConfirm.value = false
    flash('delete', 'Tag deleted.')
}

onMounted(getTags)
</script>

<template>
    <div class="space-y-5">
        <!-- Flash -->
        <div v-if="flashMsg" class="pop-in">
            <div class="flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium"
                :class="flashTone === 'success' ? 'bg-success-50 text-success-700 border border-success-100' : 'bg-error-50 text-error-700 border border-error-100'">
                {{ flashMsg }}
            </div>
        </div>

        <!-- Header -->
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <div class="relative flex-1 max-w-xs">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 size-[14px] text-gray-400" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input v-model="search" placeholder="Search tags…"
                    class="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
            </div>
            <button @click="openCreate"
                class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm transition-colors">
                <svg class="size-[15px]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New Tag
            </button>
        </div>

        <!-- Tag grid or table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div v-if="loading" class="py-12 text-center text-[13px] text-gray-400">Loading…</div>
            <div v-else-if="error && !tags.length" class="py-12 text-center text-error-500 text-[13px]">{{ error }}</div>
            <div v-else-if="!filtered.length" class="py-16 text-center text-gray-400">
                <svg class="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"/>
                </svg>
                <p class="text-[13px]">No tags found.</p>
            </div>
            <table v-else class="w-full">
                <thead>
                    <tr class="border-b border-gray-100 dark:border-gray-700">
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Tag</th>
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Posts</th>
                        <th class="px-5 py-3 w-20"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tag in filtered" :key="tag.id" class="row-hover border-b border-gray-50 dark:border-gray-700/60 last:border-0">
                        <td class="px-5 py-3">
                            <div class="flex items-center gap-2.5">
                                <span class="size-2 rounded-full flex-shrink-0" :style="{ background: tagColor(tag.name) }" />
                                <span class="text-[13px] font-medium text-gray-900 dark:text-white">{{ tag.name }}</span>
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                                    :style="{ background: tagColor(tag.name) + '18', color: tagColor(tag.name) }">
                                    #{{ tag.name?.toLowerCase().replace(/\s+/g, '-') }}
                                </span>
                            </div>
                        </td>
                        <td class="px-5 py-3 text-[13px] text-gray-500 dark:text-gray-400 num hidden md:table-cell">
                            {{ tag._count?.posts ?? tag.postsCount ?? '—' }}
                        </td>
                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-1">
                                <button @click="openEdit(tag)" title="Edit"
                                    class="size-7 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-brand-primary/[0.07] dark:hover:bg-brand-primary/10 transition-colors">
                                    <svg class="size-[14px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button @click="confirmDelete(tag.id)" title="Delete"
                                    class="size-7 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
                                    <svg class="size-[14px]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showForm = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[380px] border border-gray-100 dark:border-gray-700 pop-in">
                <div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">{{ editTarget ? 'Rename Tag' : 'New Tag' }}</h3>
                </div>
                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <div v-if="apiError" class="px-3 py-2.5 rounded-lg bg-error-50 dark:bg-error-500/10 text-error-700 dark:text-error-400 text-[12px] border border-error-100 dark:border-error-500/20">{{ apiError }}</div>
                    <div>
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tag name</label>
                        <div class="flex items-center gap-2">
                            <span class="size-3 rounded-full flex-shrink-0 transition-colors" :style="{ background: form.name ? tagColor(form.name) : '#d1d5db' }" />
                            <input v-model="form.name" required placeholder="e.g. Technology" autofocus
                                class="flex-1 h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[13px] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
                        </div>
                        <p class="mt-1.5 text-[11px] text-gray-400">Slug: #{{ form.name?.toLowerCase().replace(/\s+/g, '-') || '…' }}</p>
                    </div>
                    <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 -mx-6 px-6 -mb-6 pb-6 mt-6 bg-gray-50/60 dark:bg-gray-900/30 rounded-b-xl">
                        <button type="button" @click="showForm = false"
                            class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                        <button type="submit" :disabled="submitting"
                            class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm transition-colors disabled:opacity-60">
                            {{ submitting ? 'Saving…' : editTarget ? 'Save' : 'Create tag' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>

    <!-- Delete Confirm -->
    <Teleport to="body">
        <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showConfirm = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[420px] border border-gray-100 dark:border-gray-700 pop-in p-6">
                <div class="size-11 rounded-full bg-error-50 dark:bg-error-500/15 text-error-600 flex items-center justify-center mb-4">
                    <svg class="size-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </div>
                <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">Delete tag?</h3>
                <p class="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400">Posts using this tag will be unaffected but the tag will be removed.</p>
                <div class="mt-6 flex justify-end gap-2">
                    <button @click="showConfirm = false" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button @click="handleDelete" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] bg-error-500 text-white hover:bg-error-600">Delete</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
