<script setup>
import { onMounted, ref } from 'vue'
import { usePhotos } from '@/composables/usePhotos'

const { photos, getPhotos, uploadPhoto, bulkUpload, deletePhoto, isLoading, currentPage, totalPages } = usePhotos()

const showConfirm = ref(false)
const deleteId = ref(null)
const uploading = ref(false)
const flashMsg = ref('')
const flashTone = ref('')
const singleFileInput = ref(null)
const bulkFileInput = ref(null)

const flash = (tone, msg) => {
    flashTone.value = tone
    flashMsg.value = msg
    setTimeout(() => { flashMsg.value = '' }, 4000)
}

const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    uploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadPhoto(formData)
    uploading.value = false
    e.target.value = ''
    if (result) { await getPhotos(); flash('success', 'Photo uploaded.') }
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
    if (result) { await getPhotos(); flash('success', `${files.length} photo(s) uploaded.`) }
}

const confirmDelete = (id) => { deleteId.value = id; showConfirm.value = true }
const handleDelete = async () => {
    await deletePhoto(deleteId.value)
    await getPhotos()
    showConfirm.value = false
    flash('delete', 'Photo deleted.')
}

const changePage = async (page) => { currentPage.value = page; await getPhotos() }

onMounted(async () => { await getPhotos() })
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
            <div></div>
            <div class="flex gap-2 mt-4 md:mt-0">
                <input ref="bulkFileInput" type="file" multiple accept="image/*" class="hidden" @change="handleBulkUpload" />
                <button @click="bulkFileInput?.click()" :disabled="uploading"
                    class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <svg class="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>
                    Bulk Upload
                </button>
                <input ref="singleFileInput" type="file" accept="image/*" class="hidden" @change="handleUpload" />
                <button @click="singleFileInput?.click()" :disabled="uploading"
                    class="inline-flex items-center justify-center gap-1.5 font-medium rounded-lg h-9 px-4 text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm transition-colors">
                    <svg class="size-[15px]" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    <span v-if="uploading">Uploading…</span>
                    <span v-else>Upload Photo</span>
                </button>
            </div>
        </div>

        <!-- Grid -->
        <div v-if="isLoading" class="py-12 text-center text-[13px] text-gray-400">Loading…</div>
        <div v-else>
            <div v-if="!photos?.length" class="py-16 text-center text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                <p class="text-[13px]">No photos yet. Upload your first image.</p>
            </div>
            <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div v-for="photo in photos" :key="photo.id"
                    class="group relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-card">
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
                        <p v-if="photo.createdAt" class="text-[10px] text-gray-400 dark:text-gray-500 num">
                            {{ new Date(photo.createdAt).toLocaleDateString() }}
                        </p>
                    </div>
                    <button
                        @click="confirmDelete(photo.id)"
                        class="absolute top-1.5 right-1.5 bg-error-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                        title="Delete">
                        <svg class="size-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
                <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                    class="inline-flex items-center justify-center font-medium rounded-lg h-9 w-9 text-[13px] transition-colors"
                    :class="page === currentPage ? 'bg-brand-primary text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'">
                    {{ page }}
                </button>
            </div>
        </div>
    </div>

    <!-- Delete Confirm -->
    <Teleport to="body">
        <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] fade-in" @click="showConfirm = false" />
            <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-dialog w-full max-w-[420px] border border-gray-100 dark:border-gray-700 pop-in p-6">
                <div class="size-11 rounded-full bg-error-50 dark:bg-error-500/15 text-error-600 flex items-center justify-center mb-4">
                    <svg class="size-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
                </div>
                <h3 class="text-[16px] font-semibold text-gray-900 dark:text-white">Delete photo?</h3>
                <p class="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400">This action can't be undone.</p>
                <div class="mt-6 flex justify-end gap-2">
                    <button @click="showConfirm = false" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                    <button @click="handleDelete" class="inline-flex items-center justify-center font-medium rounded-lg h-9 px-4 text-[13px] bg-error-500 text-white hover:bg-error-600">Delete</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>
