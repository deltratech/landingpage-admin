<script setup>
import { onMounted, ref, computed } from 'vue'
import { useFaqs } from '@/composables/useFaqs'

const { getFaqs, createFaq, updateFaq, deleteFaq, loading } = useFaqs()

const items = ref([])
const search = ref('')
const flashMsg = ref('')
const flashTone = ref('')

const showForm = ref(false)
const showConfirm = ref(false)
const editTarget = ref(null)
const deleteId = ref(null)

const emptyForm = () => ({ question: '', answer: '', order: 0 })
const form = ref(emptyForm())

const flash = (tone, msg) => {
    flashTone.value = tone
    flashMsg.value = msg
    setTimeout(() => { flashMsg.value = '' }, 4000)
}

const filtered = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return items.value
    return items.value.filter(f =>
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q)
    )
})

const load = async () => { items.value = await getFaqs() }

const openCreate = () => { editTarget.value = null; form.value = emptyForm(); showForm.value = true }
const openEdit = (item) => {
    editTarget.value = item
    form.value = { question: item.question ?? '', answer: item.answer ?? '', order: item.order ?? 0 }
    showForm.value = true
}

const handleSubmit = async () => {
    const payload = { ...form.value, order: Number(form.value.order) }
    if (editTarget.value) {
        const res = await updateFaq(editTarget.value.id, payload)
        if (res) { await load(); showForm.value = false; flash('success', 'FAQ updated.') }
    } else {
        const res = await createFaq(payload)
        if (res) { await load(); showForm.value = false; flash('success', 'FAQ added.') }
    }
}

const confirmDelete = (id) => { deleteId.value = id; showConfirm.value = true }
const handleDelete = async () => {
    await deleteFaq(deleteId.value)
    await load()
    showConfirm.value = false
    flash('delete', 'FAQ deleted.')
}

onMounted(load)
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
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 size-[14px] text-gray-400" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input v-model="search" placeholder="Search FAQs…"
                    class="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
            </div>
            <button @click="openCreate"
                class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm transition-colors">
                <svg class="size-[15px]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add FAQ
            </button>
        </div>

        <!-- Table -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div v-if="loading" class="py-12 text-center text-[13px] text-gray-400">Loading…</div>
            <div v-else-if="!filtered.length" class="py-16 text-center text-gray-400">
                <svg class="w-10 h-10 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                <p class="text-[13px]">No FAQs yet.</p>
            </div>
            <table v-else class="w-full">
                <thead>
                    <tr class="border-b border-gray-100 dark:border-gray-700">
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 w-10">#</th>
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Question</th>
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Answer preview</th>
                        <th class="px-5 py-3 w-20"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filtered" :key="item.id" class="row-hover border-b border-gray-50 dark:border-gray-700/60 last:border-0">
                        <td class="px-5 py-3">
                            <span class="num text-[12px] text-gray-400">{{ item.order ?? '—' }}</span>
                        </td>
                        <td class="px-5 py-3">
                            <p class="text-[13px] font-medium text-gray-900 dark:text-white line-clamp-2">{{ item.question }}</p>
                        </td>
                        <td class="px-5 py-3 hidden md:table-cell">
                            <p class="text-[13px] text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ item.answer }}</p>
                        </td>
                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-1">
                                <button @click="openEdit(item)" class="size-7 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-brand-primary/[0.07] dark:hover:bg-brand-primary/10 transition-colors">
                                    <svg class="size-[14px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button @click="confirmDelete(item.id)" class="size-7 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
                                    <svg class="size-[14px]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Form Modal -->
    <Teleport to="body">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showForm = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[540px] border border-gray-100 dark:border-gray-700 pop-in">
                <div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">{{ editTarget ? 'Edit FAQ' : 'Add FAQ' }}</h3>
                </div>
                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <div>
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Question</label>
                        <input v-model="form.question" required placeholder="What is…"
                            class="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[13px] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
                    </div>
                    <div>
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Answer</label>
                        <textarea v-model="form.answer" rows="4" required placeholder="The answer…"
                            class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[13px] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow resize-none" />
                    </div>
                    <div class="w-32">
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Order</label>
                        <input v-model="form.order" type="number" min="0" placeholder="0"
                            class="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[13px] text-gray-700 dark:text-gray-200 num outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
                    </div>
                    <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 -mx-6 px-6 -mb-6 pb-6 mt-6 bg-gray-50/60 dark:bg-gray-900/30 rounded-b-xl">
                        <button type="button" @click="showForm = false"
                            class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                        <button type="submit" :disabled="loading"
                            class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm transition-colors disabled:opacity-60">
                            {{ editTarget ? 'Save changes' : 'Add FAQ' }}
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
                    <svg class="size-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </div>
                <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">Delete FAQ?</h3>
                <p class="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400">This action can't be undone.</p>
                <div class="mt-6 flex justify-end gap-2">
                    <button @click="showConfirm = false" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button @click="handleDelete" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] bg-error-500 text-white hover:bg-error-600">Delete</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
