<script setup>
import { onMounted, ref, computed } from 'vue'
import { useContacts } from '@/composables/useContacts'

const { getContacts, createContact, updateContact, deleteContact, loading, error } = useContacts()
const contacts = ref([])
const query = ref('')

const emptyForm = () => ({
    name: '', email: '', phone: '', message: '',
    schoolName: '', schoolRole: '', numberOfStudents: '',
})

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showConfirm = ref(false)
const formData = ref(emptyForm())
const editId = ref(null)
const deleteTarget = ref(null)
const saving = ref(false)
const flashMsg = ref('')
const flashTone = ref('')

const flash = (tone, msg) => {
    flashTone.value = tone
    flashMsg.value = msg
    setTimeout(() => { flashMsg.value = '' }, 4000)
}

const filtered = computed(() =>
    !query.value
        ? contacts.value
        : contacts.value.filter(c =>
            (c.name + c.email + (c.schoolName ?? '') + (c.schoolRole ?? '')).toLowerCase().includes(query.value.toLowerCase())
        )
)

const openCreate = () => { formData.value = emptyForm(); showCreateModal.value = true }
const openEdit = (c) => {
    editId.value = c.id
    formData.value = { name: c.name ?? '', email: c.email ?? '', phone: c.phone ?? '', message: c.message ?? '', schoolName: c.schoolName ?? '', schoolRole: c.schoolRole ?? '', numberOfStudents: c.numberOfStudents ?? '' }
    showEditModal.value = true
}

const saveCreate = async () => {
    if (!formData.value.name || !formData.value.email || !formData.value.message) return alert('Name, email, and message are required.')
    saving.value = true
    const payload = { ...formData.value }
    if (!payload.phone) delete payload.phone
    if (!payload.schoolName) delete payload.schoolName
    if (!payload.schoolRole) delete payload.schoolRole
    if (!payload.numberOfStudents) delete payload.numberOfStudents
    const result = await createContact(payload)
    saving.value = false
    if (result) { contacts.value = await getContacts(); showCreateModal.value = false; flash('success', 'Contact added.') }
}

const saveEdit = async () => {
    if (!formData.value.name || !formData.value.email || !formData.value.message) return alert('Name, email, and message are required.')
    saving.value = true
    const payload = { ...formData.value }
    if (!payload.phone) delete payload.phone
    if (!payload.schoolName) delete payload.schoolName
    if (!payload.schoolRole) delete payload.schoolRole
    if (!payload.numberOfStudents) delete payload.numberOfStudents
    const result = await updateContact(editId.value, payload)
    saving.value = false
    if (result) { contacts.value = await getContacts(); showEditModal.value = false; flash('success', 'Contact updated.') }
}

const confirmDelete = (c) => { deleteTarget.value = c; showConfirm.value = true }
const handleDelete = async () => {
    await deleteContact(deleteTarget.value.id)
    contacts.value = contacts.value.filter(c => c.id !== deleteTarget.value.id)
    showConfirm.value = false
    flash('delete', 'Contact deleted.')
}

const avatarColor = (name = '') => {
    const p = ['from-brand-accent to-brand-primary','from-success-500 to-emerald-600','from-warning-500 to-orange-500','from-error-500 to-rose-600','from-sky-400 to-indigo-500']
    return p[(name.charCodeAt(0) || 0) % p.length]
}
const initials = (name = '') => name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()

const openMenu = ref(null)
const toggleMenu = (id) => { openMenu.value = openMenu.value === id ? null : id }
const closeMenu = () => { openMenu.value = null }

const handleClickOutside = (e) => { if (!e.target.closest('[data-menu]')) closeMenu() }

import { onUnmounted } from 'vue'
onMounted(async () => {
    contacts.value = await getContacts() ?? []
    document.addEventListener('click', handleClickOutside)
})
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
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
            <div class="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm">
                <div class="relative flex-1">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 size-[15px] text-gray-400" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input v-model="query" placeholder="Search contacts…" class="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow" />
                </div>
            </div>
            <button @click="openCreate" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm">
                <svg class="size-[15px]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Contact
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
                            <th class="text-left font-semibold px-2 py-3">Name</th>
                            <th class="text-left font-semibold px-2 py-3">Email</th>
                            <th class="text-left font-semibold px-2 py-3">Phone</th>
                            <th class="text-left font-semibold px-2 py-3">School</th>
                            <th class="text-left font-semibold px-2 py-3">Role</th>
                            <th class="text-right font-semibold pr-5 pl-2 py-3 w-16">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!filtered.length">
                            <td colspan="7" class="px-5 py-10 text-center text-gray-400">No contacts found.</td>
                        </tr>
                        <tr v-for="(c, i) in filtered" :key="c.id" class="row-hover border-b border-gray-50 dark:border-gray-700/40 last:border-0">
                            <td class="pl-5 pr-2 py-3 text-gray-400 num">{{ String(i + 1).padStart(2, '0') }}</td>
                            <td class="px-2 py-3">
                                <div class="flex items-center gap-2.5">
                                    <div :class="`bg-gradient-to-br ${avatarColor(c.name)} size-[30px] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`" style="font-size:11px">{{ initials(c.name) }}</div>
                                    <div>
                                        <div class="font-medium text-gray-900 dark:text-gray-100">{{ c.name }}</div>
                                        <div v-if="c.numberOfStudents" class="text-[11px] text-gray-400 num">{{ c.numberOfStudents }} students</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-2 py-3 text-gray-600 dark:text-gray-300">{{ c.email }}</td>
                            <td class="px-2 py-3 text-gray-500 dark:text-gray-400 num whitespace-nowrap">{{ c.phone ?? '—' }}</td>
                            <td class="px-2 py-3 text-gray-600 dark:text-gray-300 truncate max-w-[160px]">{{ c.schoolName ?? '—' }}</td>
                            <td class="px-2 py-3">
                                <span v-if="c.schoolRole" class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-brand-primary/[0.12] text-brand-primary dark:bg-brand-primary/15 dark:text-brand-accent">{{ c.schoolRole }}</span>
                                <span v-else class="text-gray-400">—</span>
                            </td>
                            <td class="pr-5 pl-2 py-3 text-right">
                                <div class="relative inline-block" data-menu>
                                    <button @click.stop="toggleMenu(c.id)" class="size-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 inline-flex items-center justify-center text-gray-500 transition-colors">
                                        <svg class="size-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" /></svg>
                                    </button>
                                    <div v-if="openMenu === c.id" class="absolute right-0 top-full mt-1 z-30 min-w-[140px] py-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-dialog pop-in">
                                        <button @click="closeMenu(); openEdit(c)" class="w-full px-3 py-1.5 text-[13px] flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                                            <svg class="size-[14px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                            Edit
                                        </button>
                                        <div class="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                                        <button @click="closeMenu(); confirmDelete(c)" class="w-full px-3 py-1.5 text-[13px] flex items-center gap-2 text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors">
                                            <svg class="size-[14px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-5 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700/60 text-[12px] text-gray-500">
                <div>Showing <span class="font-semibold text-gray-700 dark:text-gray-200">{{ filtered.length }}</span> of {{ contacts.length }}</div>
            </div>
        </div>
    </div>

    <!-- Contact Form Modal (shared for create + edit) -->
    <Teleport to="body">
        <div v-if="showCreateModal || showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showCreateModal = false; showEditModal = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[600px] border border-gray-100 dark:border-gray-700 pop-in">
                <!-- Header -->
                <div class="px-6 py-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60">
                    <div>
                        <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">{{ showEditModal ? 'Edit contact' : 'Add contact' }}</h3>
                        <p class="text-[12px] text-gray-400 mt-0.5">Update contact details and school information.</p>
                    </div>
                    <button @click="showCreateModal = false; showEditModal = false" class="size-8 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg class="size-4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <!-- Body -->
                <div class="px-6 py-5 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Name *</label>
                            <input v-model="formData.name" placeholder="Full name" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email *</label>
                            <input v-model="formData.email" type="email" placeholder="name@school.edu" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone</label>
                            <input v-model="formData.phone" placeholder="+1 (555) 000-0000" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">School name</label>
                            <input v-model="formData.schoolName" placeholder="School or organization" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">School role</label>
                            <input v-model="formData.schoolRole" placeholder="e.g. Teacher, Principal" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow" />
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Number of students</label>
                            <select v-model="formData.numberOfStudents" class="w-full h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus-primary text-[13px] appearance-none">
                                <option value="">Select range</option>
                                <option value="below_200">Below 200</option>
                                <option value="between_200_500">200 – 500</option>
                                <option value="between_500_1000">500 – 1000</option>
                                <option value="between_1000_2000">1000 – 2000</option>
                                <option value="above_2000">Above 2000</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Message *</label>
                        <textarea v-model="formData.message" rows="3" placeholder="Add a note about this contact…" class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] resize-none transition-shadow" />
                    </div>
                </div>
                <!-- Footer -->
                <div class="px-6 py-4 flex justify-end gap-2 bg-gray-50/60 dark:bg-gray-900/30 rounded-b-xl border-t border-gray-100 dark:border-gray-700/60">
                    <button @click="showCreateModal = false; showEditModal = false" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button @click="showEditModal ? saveEdit() : saveCreate()" :disabled="saving" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm disabled:opacity-60">
                        {{ saving ? 'Saving…' : 'Save changes' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>

    <!-- Delete confirm -->
    <Teleport to="body">
        <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showConfirm = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[420px] border border-gray-100 dark:border-gray-700 pop-in p-6">
                <div class="size-11 rounded-full bg-error-50 dark:bg-error-500/15 text-error-600 flex items-center justify-center mb-4">
                    <svg class="size-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                </div>
                <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">Delete contact?</h3>
                <p class="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete <span class="font-medium text-gray-700 dark:text-gray-200">{{ deleteTarget?.name }}</span>? This action can't be undone.
                </p>
                <div class="mt-6 flex justify-end gap-2">
                    <button @click="showConfirm = false" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button @click="handleDelete" class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-colors h-9 px-4 text-[13px] bg-error-500 text-white hover:bg-error-600">Delete contact</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
