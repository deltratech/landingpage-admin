<script setup>
import { onMounted, ref } from 'vue'
import { usePhotos } from '@/composables/usePhotos'

const { photos, getPhotos, uploadPhoto, bulkUpload, deletePhoto, isLoading, currentPage, totalPages } = usePhotos()

const showConfirm = ref(false)
const deleteId = ref(null)
const uploading = ref(false)
const showSuccessAlert = ref(false)
const showDeleteAlert = ref(false)
const alertMessage = ref('')
const singleFileInput = ref(null)
const bulkFileInput = ref(null)

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

const triggerUpload = () => singleFileInput.value?.click()
const triggerBulkUpload = () => bulkFileInput.value?.click()

const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadPhoto(formData)
    uploading.value = false
    e.target.value = ''
    if (result) {
        await getPhotos()
        flash('success', 'Photo uploaded successfully.')
    }
}

const handleBulkUpload = async (e) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    uploading.value = true
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    const result = await bulkUpload(formData)
    uploading.value = false
    e.target.value = ''
    if (result) {
        await getPhotos()
        flash('success', `${files.length} photo(s) uploaded.`)
    }
}

const confirmDelete = (id) => {
    deleteId.value = id
    showConfirm.value = true
}

const handleDelete = async () => {
    await deletePhoto(deleteId.value)
    await getPhotos()
    showConfirm.value = false
    flash('delete', 'Photo deleted.')
}

const changePage = async (page) => {
    currentPage.value = page
    await getPhotos()
}

onMounted(async () => {
    await getPhotos()
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
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                        </div>
                        <p class="text-16 font-normal text-black dark:text-white">Media Library</p>
                    </div>
                    <div class="flex gap-2 mt-4 md:mt-0">
                        <input ref="bulkFileInput" type="file" multiple accept="image/*" class="hidden" @change="handleBulkUpload" />
                        <button @click="triggerBulkUpload" :disabled="uploading"
                            class="btn bg-gray-main text-gray-900 dark:bg-gray-700 dark:text-white btn-text-icon">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>
                            Bulk Upload
                        </button>
                        <input ref="singleFileInput" type="file" accept="image/*" class="hidden" @change="handleUpload" />
                        <button @click="triggerUpload" :disabled="uploading"
                            class="btn bg-primary-500 text-white btn-text-icon">
                            <i class="text-xl leading-none ri-add-line"></i>
                            <span v-if="uploading">Uploading...</span>
                            <span v-else>Upload Photo</span>
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

                    <div v-if="isLoading" class="py-10 text-center text-gray-400">Loading...</div>
                    <div v-else class="mt-4">
                        <div v-if="!photos?.length" class="py-12 text-center text-gray-400">
                            <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                            <p>No photos yet. Upload your first image.</p>
                        </div>
                        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <div v-for="photo in photos" :key="photo.id"
                                class="group relative rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <div class="aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
                                    <img
                                        :src="photo.url ?? photo.path ?? photo.filename"
                                        :alt="photo.filename ?? photo.name ?? 'Photo'"
                                        class="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        @error="(e) => e.target.style.display = 'none'"
                                    />
                                </div>
                                <div class="p-2">
                                    <p class="text-xs text-gray-600 dark:text-gray-400 truncate">{{ photo.filename ?? photo.name ?? photo.id }}</p>
                                    <p v-if="photo.createdAt" class="text-xs text-gray-400 dark:text-gray-500">
                                        {{ new Date(photo.createdAt).toLocaleDateString() }}
                                    </p>
                                </div>
                                <button
                                    @click="confirmDelete(photo.id)"
                                    class="absolute top-1 right-1 bg-error-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete">
                                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
                            <button
                                v-for="page in totalPages" :key="page"
                                @click="changePage(page)"
                                :class="['btn btn-sm', page === currentPage ? 'bg-primary-500 text-white' : 'btn-secondary']">
                                {{ page }}
                            </button>
                        </div>
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
                    <p class="leading-normal text-gray-500 dark:text-gray-400 px-6 text-16">Are you sure you want to delete this photo? This cannot be undone.</p>
                    <div class="flex justify-end items-center gap-x-6 p-6">
                        <button class="btn btn-sm ripple btn-secondary" @click="showConfirm = false">Cancel</button>
                        <button class="btn btn-sm ripple btn-error" @click="handleDelete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
