<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUsers } from '@/composables/useUsers'

const { users, isLoading, error, currentPage, totalPages, getUsers, createUser, updateUser, deleteUser } = useUsers()

const search = ref('')
const flashMsg = ref('')
const flashTone = ref('')
const showForm = ref(false)
const showConfirm = ref(false)
const editTarget = ref(null)
const deleteId = ref(null)
const submitting = ref(false)
const apiError = ref('')

const emptyForm = () => ({ name: '', email: '', password: '', role: 'users' })
const form = ref(emptyForm())

const ROLES = [
    { value: 'superadmin', label: 'Super Admin' },
    { value: 'users', label: 'User' },
]

const roleLabel = (r) => ROLES.find(x => x.value === r)?.label ?? r

const flash = (tone, msg) => {
    flashTone.value = tone
    flashMsg.value = msg
    setTimeout(() => { flashMsg.value = '' }, 4000)
}

const filtered = computed(() => {
    const q = search.value.toLowerCase()
    if (!q) return users.value
    return users.value.filter(u =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q)
    )
})

const initials = (name) => (name ?? '?').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
const avatarColor = (name) => {
    const palette = ['#6950E8', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']
    return palette[(name?.charCodeAt(0) ?? 0) % palette.length]
}

const openCreate = () => {
    editTarget.value = null
    form.value = emptyForm()
    apiError.value = ''
    showForm.value = true
}

const openEdit = (user) => {
    editTarget.value = user
    form.value = { name: user.name ?? '', email: user.email ?? '', password: '', role: user.role ?? 'users' }
    apiError.value = ''
    showForm.value = true
}

const handleSubmit = async () => {
    submitting.value = true
    apiError.value = ''
    try {
        if (editTarget.value) {
            const payload = { name: form.value.name, email: form.value.email, role: form.value.role }
            if (form.value.password) payload.password = form.value.password
            const res = await updateUser(editTarget.value.id, payload)
            if (res) { await getUsers(); showForm.value = false; flash('success', 'User updated.') }
            else { apiError.value = 'Failed to update user.' }
        } else {
            const res = await createUser({ ...form.value })
            if (res) { await getUsers(); showForm.value = false; flash('success', 'User created.') }
            else { apiError.value = 'Failed to create user.' }
        }
    } finally {
        submitting.value = false
    }
}

const confirmDelete = (id) => { deleteId.value = id; showConfirm.value = true }
const handleDelete = async () => {
    await deleteUser(deleteId.value)
    await getUsers()
    showConfirm.value = false
    flash('delete', 'User deleted.')
}

const changePage = async (page) => { currentPage.value = page; await getUsers() }

onMounted(getUsers)
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
                <input v-model="search" placeholder="Search users…"
                    class="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] text-gray-700 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
            </div>
            <button @click="openCreate"
                class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm transition-colors">
                <svg class="size-[15px]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add User
            </button>
        </div>

        <!-- Table card -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-card border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div v-if="isLoading" class="py-12 text-center text-[13px] text-gray-400">Loading…</div>
            <div v-else-if="!filtered.length" class="py-16 text-center text-gray-400">
                <svg class="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/>
                </svg>
                <p class="text-[13px]">No users found.</p>
            </div>
            <table v-else class="w-full">
                <thead>
                    <tr class="border-b border-gray-100 dark:border-gray-700">
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">User</th>
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hidden sm:table-cell">Email</th>
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">Role</th>
                        <th class="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">Joined</th>
                        <th class="px-5 py-3 w-20"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in filtered" :key="user.id" class="row-hover border-b border-gray-50 dark:border-gray-700/60 last:border-0">
                        <td class="px-5 py-3">
                            <div class="flex items-center gap-3">
                                <div class="size-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
                                    :style="{ background: avatarColor(user.name ?? user.email) }">
                                    {{ initials(user.name ?? user.email) }}
                                </div>
                                <span class="text-[13px] font-medium text-gray-900 dark:text-white">{{ user.name ?? '—' }}</span>
                            </div>
                        </td>
                        <td class="px-5 py-3 text-[13px] text-gray-500 dark:text-gray-400 hidden sm:table-cell">{{ user.email }}</td>
                        <td class="px-5 py-3 hidden md:table-cell">
                            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
                                :class="user.role === 'superadmin'
                                    ? 'bg-brand-primary/[0.07] text-brand-primary dark:bg-brand-primary/15 dark:text-brand-accent'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'">
                                <span class="size-1.5 rounded-full"
                                    :class="user.role === 'superadmin' ? 'bg-brand-primary' : 'bg-gray-400'" />
                                {{ roleLabel(user.role) }}
                            </span>
                        </td>
                        <td class="px-5 py-3 text-[13px] text-gray-400 num hidden lg:table-cell">
                            {{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' }}
                        </td>
                        <td class="px-5 py-3">
                            <div class="flex items-center justify-end gap-1">
                                <button @click="openEdit(user)" class="size-7 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-brand-primary/[0.07] dark:hover:bg-brand-primary/10 transition-colors" title="Edit">
                                    <svg class="size-[14px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button @click="confirmDelete(user.id)" class="size-7 rounded-md inline-flex items-center justify-center text-gray-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors" title="Delete">
                                    <svg class="size-[14px]" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center gap-2 px-5 py-4 border-t border-gray-100 dark:border-gray-700">
                <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                    class="inline-flex items-center justify-center font-medium rounded-lg h-8 w-8 text-[13px] transition-colors"
                    :class="page === currentPage ? 'bg-brand-primary text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'">
                    {{ page }}
                </button>
            </div>
        </div>
    </div>

    <!-- Create / Edit Modal -->
    <Teleport to="body">
        <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showForm = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[460px] border border-gray-100 dark:border-gray-700 pop-in">
                <div class="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">{{ editTarget ? 'Edit User' : 'New User' }}</h3>
                    <p class="text-[12px] text-gray-400 mt-0.5">{{ editTarget ? 'Update user details.' : 'Fill in the details to create a new account.' }}</p>
                </div>
                <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                    <!-- API error -->
                    <div v-if="apiError" class="px-3 py-2.5 rounded-lg bg-error-50 dark:bg-error-500/10 text-error-700 dark:text-error-400 text-[12px] border border-error-100 dark:border-error-500/20">
                        {{ apiError }}
                    </div>

                    <div>
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Full name</label>
                        <input v-model="form.name" required placeholder="John Doe"
                            class="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[13px] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
                    </div>

                    <div>
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
                        <input v-model="form.email" type="email" required placeholder="john@example.com"
                            class="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[13px] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
                    </div>

                    <div>
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                            Password <span v-if="editTarget" class="text-gray-400 font-normal">(leave blank to keep current)</span>
                        </label>
                        <input v-model="form.password" type="password" :required="!editTarget" placeholder="••••••••"
                            class="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-[13px] text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-shadow" />
                    </div>

                    <div>
                        <label class="block text-[12px] font-medium text-gray-600 dark:text-gray-400 mb-1.5">Role</label>
                        <div class="flex gap-2">
                            <label v-for="r in ROLES" :key="r.value"
                                class="flex-1 flex items-center gap-2.5 px-3 h-9 rounded-lg border cursor-pointer transition-colors text-[13px] font-medium"
                                :class="form.role === r.value
                                    ? 'border-brand-primary bg-brand-primary/[0.07] dark:bg-brand-primary/10 text-brand-primary dark:text-brand-accent'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'">
                                <input type="radio" v-model="form.role" :value="r.value" class="sr-only" />
                                <span class="size-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                    :class="form.role === r.value ? 'border-brand-primary' : 'border-gray-300 dark:border-gray-600'">
                                    <span v-if="form.role === r.value" class="size-1.5 rounded-full bg-brand-primary" />
                                </span>
                                {{ r.label }}
                            </label>
                        </div>
                    </div>

                    <div class="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700 -mx-6 px-6 -mb-6 pb-6 mt-6 bg-gray-50/60 dark:bg-gray-900/30 rounded-b-xl">
                        <button type="button" @click="showForm = false"
                            class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                        <button type="submit" :disabled="submitting"
                            class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm transition-colors disabled:opacity-60">
                            {{ submitting ? 'Saving…' : editTarget ? 'Save changes' : 'Create user' }}
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
                <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">Delete user?</h3>
                <p class="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400">This action can't be undone. The user will lose all access.</p>
                <div class="mt-6 flex justify-end gap-2">
                    <button @click="showConfirm = false" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button @click="handleDelete" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] bg-error-500 text-white hover:bg-error-600">Delete</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
