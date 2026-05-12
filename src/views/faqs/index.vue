<script setup>
import { onMounted, ref } from 'vue'
import { useFaqs } from '@/composables/useFaqs'

const { getFaqs, createFaq, updateFaq, deleteFaq, loading, error } = useFaqs()
const faqs = ref([])

const emptyForm = () => ({ question: '', answer: '', order: 0 })

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showConfirm = ref(false)
const formData = ref(emptyForm())
const editId = ref(null)
const deleteId = ref(null)
const saving = ref(false)

const showSuccessAlert = ref(false)
const showDeleteAlert = ref(false)
const alertMessage = ref('')

const flash = (type, msg) => {
    alertMessage.value = msg
    if (type === 'success') {
        showSuccessAlert.value = true
        setTimeout(() => { showSuccessAlert.value = false }, 4000)
    } else {
        showDeleteAlert.value = true
        setTimeout(() => { showDeleteAlert.value = false }, 4000)
    }
}

const openCreate = () => {
    formData.value = emptyForm()
    showCreateModal.value = true
}

const openEdit = (item) => {
    editId.value = item.id
    formData.value = {
        question: item.question ?? '',
        answer: item.answer ?? '',
        order: item.order ?? 0,
    }
    showEditModal.value = true
}

const saveCreate = async () => {
    if (!formData.value.question || !formData.value.answer) {
        alert('Question and answer are required.')
        return
    }
    saving.value = true
    const result = await createFaq({ ...formData.value })
    saving.value = false
    if (result) {
        faqs.value = await getFaqs()
        showCreateModal.value = false
        flash('success', 'FAQ created successfully.')
    }
}

const saveEdit = async () => {
    if (!formData.value.question || !formData.value.answer) {
        alert('Question and answer are required.')
        return
    }
    saving.value = true
    const result = await updateFaq(editId.value, { ...formData.value })
    saving.value = false
    if (result) {
        faqs.value = await getFaqs()
        showEditModal.value = false
        flash('success', 'FAQ updated successfully.')
    }
}

const confirmDelete = (id) => {
    deleteId.value = id
    showConfirm.value = true
}

const handleDelete = async () => {
    await deleteFaq(deleteId.value)
    faqs.value = faqs.value.filter(f => f.id !== deleteId.value)
    showConfirm.value = false
    flash('delete', 'FAQ deleted.')
}

onMounted(async () => {
    faqs.value = await getFaqs()
})
</script>

<template>
    <div class="mt-6">
        <div class="card card-dark">
            <div class="p-4">
                <div class="flex-wrap items-center justify-between gap-4 md:flex">
                    <div class="flex gap-2 items-center">
                        <div class="bg-primary-25 p-1.5 rounded-md w-10">
                            <svg class="fill-primary-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                            </svg>
                        </div>
                        <p class="text-16 font-normal text-black dark:text-white">FAQs</p>
                    </div>
                    <div>
                        <button @click="openCreate"
                            class="flex justify-center w-full mt-4 btn bg-primary-500 text-white btn-text-icon md:mt-0">
                            <i class="text-xl leading-none ri-add-line"></i> Add FAQ
                        </button>
                    </div>
                </div>

                <div class="px-4">
                    <div v-if="showSuccessAlert" class="pt-4">
                        <div class="alert alert-success" role="alert">
                            <div class="flex items-center gap-3">
                                <svg class="size-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.3335 7.99992C1.3335 4.31802 4.31826 1.33325 8.00016 1.33325C9.76827 1.33325 11.464 2.03563 12.7142 3.28587C13.9644 4.53612 14.6668 6.23181 14.6668 7.99992C14.6668 11.6818 11.6821 14.6666 8.00016 14.6666C4.31826 14.6666 1.3335 11.6818 1.3335 7.99992ZM7.1535 10.2333L10.9002 6.48659C11.0229 6.35782 11.0229 6.15535 10.9002 6.02659L10.5468 5.67325C10.4172 5.5462 10.2098 5.5462 10.0802 5.67325L6.92016 8.83325L5.92016 7.83992C5.79544 7.71118 5.5921 7.71118 5.4535 7.83992L5.10016 8.19325C4.97544 8.32199 4.97544 8.52446 5.10016 8.65319L6.68683 10.2333C6.81155 10.362 7.02683 10.362 7.1535 10.2333Z" fill="currentColor"/>
                                </svg>
                                <span>{{ alertMessage }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="showDeleteAlert" class="pt-4">
                        <div class="alert alert-error" role="alert">
                            <div class="flex items-center gap-3">
                                <svg class="size-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM8 4.5C8.36367 4.5 8.65625 4.79258 8.65625 5.15625V8.21875C8.65625 8.58242 8.36367 8.875 8 8.875C7.63633 8.875 7.34375 8.58242 7.34375 8.21875V5.15625C7.34375 4.79258 7.63633 4.5 8 4.5ZM7.125 10.625C7.125 10.3929 7.21719 10.1704 7.38128 10.0063C7.54538 9.84219 7.76794 9.75 8 9.75C8.23206 9.75 8.45462 9.84219 8.61872 10.0063C8.78281 10.1704 8.875 10.3929 8.875 10.625C8.875 10.8571 8.78281 11.0796 8.61872 11.2437C8.45462 11.4078 8.23206 11.5 8 11.5C7.76794 11.5 7.54538 11.4078 7.38128 11.2437C7.21719 11.0796 7.125 10.8571 7.125 10.625Z" fill="currentColor"/>
                                </svg>
                                <span>{{ alertMessage }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="loading" class="py-10 text-center text-gray-400">Loading...</div>
                    <div v-else-if="error" class="py-10 text-center text-error-500">{{ error }}</div>
                    <div v-else class="mt-4">
                        <div class="rounded-lg shadow-table bg-white dark:bg-transparent">
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm border-collapse">
                                    <thead>
                                        <tr class="border-b border-gray-100 dark:border-gray-700">
                                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">No</th>
                                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">Order</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Question</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Answer</th>
                                            <th class="w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                                        <tr v-if="!faqs.length">
                                            <td colspan="5" class="px-4 py-8 text-center text-gray-400">No FAQs found.</td>
                                        </tr>
                                        <tr v-for="(item, index) in faqs" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
                                            <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{{ item.order ?? 0 }}</td>
                                            <td class="px-4 py-3 text-gray-900 dark:text-gray-200 font-medium max-w-xs">{{ item.question }}</td>
                                            <td class="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-sm truncate">{{ item.answer }}</td>
                                            <td class="px-4 py-3 text-center">
                                                <div class="relative inline-flex hs-dropdown">
                                                    <button type="button" class="hs-dropdown-toggle btn-dark-icon-hover size-10">
                                                        <i class="text-gray-400 ri-more-2-fill"></i>
                                                    </button>
                                                    <div class="hs-dropdown-menu min-w-24 max-h-40 overflow-y-auto transition-[opacity,margin] duration opacity-0 hidden hs-dropdown-open:opacity-100">
                                                        <div class="p-2">
                                                            <button class="dropdown-item" @click="openEdit(item)">
                                                                <div class="flex gap-2">
                                                                    <svg class="w-5 fill-gray-500 dark:fill-dark-15" viewBox="0 0 24 24">
                                                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                                    </svg>
                                                                    <span>Edit</span>
                                                                </div>
                                                            </button>
                                                            <button class="dropdown-item" @click="confirmDelete(item.id)">
                                                                <div class="flex gap-2">
                                                                    <svg class="w-5 fill-gray-500 dark:fill-dark-15" viewBox="0 0 24 24">
                                                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/>
                                                                    </svg>
                                                                    <span>Delete</span>
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" role="dialog">
            <div class="hs-overlay-animation-target scale-100 opacity-100 ease-in-out transition-all duration-200 sm:max-w-[600px] sm:w-full m-3 sm:mx-auto min-h-[calc(100%-1.5rem)] flex items-center">
                <div class="w-full flex flex-col bg-white shadow-dialog rounded-xl dark:bg-gray-800">
                    <h6 class="font-semibold text-xl text-gray-900 dark:text-gray-200 p-6 pb-4">Add FAQ</h6>

                    <div class="relative z-0 w-full my-5 group px-4">
                        <input type="number" v-model.number="formData.order" placeholder=""
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500">
                        <label class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Display Order</label>
                    </div>
                    <div class="relative z-0 w-full my-5 group px-4">
                        <textarea v-model="formData.question" rows="2" placeholder=""
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 resize-none"></textarea>
                        <label class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Question *</label>
                    </div>
                    <div class="relative z-0 w-full my-5 group px-4">
                        <textarea v-model="formData.answer" rows="5" placeholder=""
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 resize-none"></textarea>
                        <label class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Answer *</label>
                    </div>

                    <div class="flex justify-end items-center gap-x-6 p-6">
                        <button class="btn ripple btn-secondary text-gray-900 hover:bg-gray-200 dark:text-white bg-gray-main dark:bg-gray-700" @click="showCreateModal = false">Cancel</button>
                        <button class="btn btn-sm ripple bg-primary-500 text-white" @click="saveCreate" :disabled="saving">
                            <span v-if="saving">Saving...</span>
                            <span v-else>Save</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" role="dialog">
            <div class="hs-overlay-animation-target scale-100 opacity-100 ease-in-out transition-all duration-200 sm:max-w-[600px] sm:w-full m-3 sm:mx-auto min-h-[calc(100%-1.5rem)] flex items-center">
                <div class="w-full flex flex-col bg-white shadow-dialog rounded-xl dark:bg-gray-800">
                    <h6 class="font-semibold text-xl text-gray-900 dark:text-gray-200 p-6 pb-4">Edit FAQ</h6>

                    <div class="relative z-0 w-full my-5 group px-4">
                        <input type="number" v-model.number="formData.order" placeholder=""
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500">
                        <label class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Display Order</label>
                    </div>
                    <div class="relative z-0 w-full my-5 group px-4">
                        <textarea v-model="formData.question" rows="2" placeholder=""
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 resize-none"></textarea>
                        <label class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Question *</label>
                    </div>
                    <div class="relative z-0 w-full my-5 group px-4">
                        <textarea v-model="formData.answer" rows="5" placeholder=""
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 resize-none"></textarea>
                        <label class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Answer *</label>
                    </div>

                    <div class="flex justify-end items-center gap-x-6 p-6">
                        <button class="btn ripple btn-secondary text-gray-900 hover:bg-gray-200 dark:text-white bg-gray-main dark:bg-gray-700" @click="showEditModal = false">Cancel</button>
                        <button class="btn btn-sm ripple bg-primary-500 text-white" @click="saveEdit" :disabled="saving">
                            <span v-if="saving">Saving...</span>
                            <span v-else>Update</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" role="dialog">
            <div class="hs-overlay-animation-target scale-100 opacity-100 ease-in-out transition-all duration-200 sm:max-w-[600px] sm:w-full m-3 sm:mx-auto min-h-[calc(100%-1.5rem)] flex items-center">
                <div class="w-full flex flex-col bg-white shadow-dialog rounded-xl dark:bg-gray-800">
                    <h6 class="font-semibold text-xl text-gray-900 dark:text-gray-200 p-6 pb-4">Confirm Delete</h6>
                    <p class="leading-normal text-gray-500 dark:text-gray-400 px-6 text-16">Are you sure you want to delete this FAQ?</p>
                    <div class="flex justify-end items-center gap-x-6 p-6">
                        <button class="btn btn-sm ripple btn-secondary" @click="showConfirm = false">Cancel</button>
                        <button class="btn btn-sm ripple btn-error" @click="handleDelete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
