<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePosts } from '@/composables/usePosts'

const router = useRouter()
const { getPosts, deletePost, loading, error } = usePosts()
const posts = ref([])

const showConfirm = ref(false)
const deleteId = ref(null)
const showDeleteAlert = ref(false)
const alertMessage = ref('')

const flash = (msg) => {
    alertMessage.value = msg
    showDeleteAlert.value = true
    setTimeout(() => { showDeleteAlert.value = false }, 4000)
}

const statusBadge = (status) => {
    const map = {
        published: 'bg-success-100 text-success-700',
        draft: 'bg-warning-100 text-warning-700',
    }
    return map[status] ?? 'bg-gray-100 text-gray-500'
}

const confirmDelete = (id) => {
    deleteId.value = id
    showConfirm.value = true
}

const handleDelete = async () => {
    await deletePost(deleteId.value)
    posts.value = posts.value.filter(p => p.id !== deleteId.value)
    showConfirm.value = false
    flash('Post deleted.')
}

onMounted(async () => {
    posts.value = await getPosts()
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
                                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 7H7V9H17V7ZM17 11H7V13H17V11ZM14 15H7V17H14V15Z"/>
                            </svg>
                        </div>
                        <p class="text-16 font-normal text-black dark:text-white">Posts</p>
                    </div>
                    <div>
                        <button @click="router.push('/posts/new')"
                            class="flex justify-center w-full mt-4 btn bg-primary-500 text-white btn-text-icon md:mt-0">
                            <i class="text-xl leading-none ri-add-line"></i> Add Post
                        </button>
                    </div>
                </div>

                <div class="px-4">
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
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slug</th>
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th class="w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                                        <tr v-if="!posts.length">
                                            <td colspan="5" class="px-4 py-8 text-center text-gray-400">No posts found.</td>
                                        </tr>
                                        <tr v-for="(post, index) in posts" :key="post.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{{ index + 1 }}</td>
                                            <td class="px-4 py-3 font-medium">
                                                <button @click="router.push(`/posts/${post.id}/edit`)"
                                                    class="text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 text-left transition-colors">
                                                    {{ post.title }}
                                                </button>
                                            </td>
                                            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ post.slug }}</td>
                                            <td class="px-4 py-3">
                                                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusBadge(post.status)">
                                                    {{ post.status ?? 'draft' }}
                                                </span>
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <div class="relative inline-flex hs-dropdown">
                                                    <button type="button" class="hs-dropdown-toggle btn-dark-icon-hover size-10">
                                                        <i class="text-gray-400 ri-more-2-fill"></i>
                                                    </button>
                                                    <div class="hs-dropdown-menu min-w-24 max-h-40 overflow-y-auto transition-[opacity,margin] duration opacity-0 hidden hs-dropdown-open:opacity-100">
                                                        <div class="p-2">
                                                            <button class="dropdown-item" @click="router.push(`/posts/${post.id}/edit`)">
                                                                <div class="flex gap-2">
                                                                    <svg class="w-5 fill-gray-500 dark:fill-dark-15" viewBox="0 0 24 24">
                                                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                                                    </svg>
                                                                    <span>Edit</span>
                                                                </div>
                                                            </button>
                                                            <button class="dropdown-item" @click="confirmDelete(post.id)">
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

    <!-- Delete Confirm Modal -->
    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" role="dialog">
            <div class="hs-overlay-animation-target scale-100 opacity-100 ease-in-out transition-all duration-200 sm:max-w-[600px] sm:w-full m-3 sm:mx-auto min-h-[calc(100%-1.5rem)] flex items-center">
                <div class="w-full flex flex-col bg-white shadow-dialog rounded-xl dark:bg-gray-800">
                    <h6 class="font-semibold text-xl text-gray-900 dark:text-gray-200 p-6 pb-4">Confirm Delete</h6>
                    <p class="leading-normal text-gray-500 dark:text-gray-400 px-6 text-16">Are you sure you want to delete this post?</p>
                    <div class="flex justify-end items-center gap-x-6 p-6">
                        <button class="btn btn-sm ripple btn-secondary" @click="showConfirm = false">Cancel</button>
                        <button class="btn btn-sm ripple btn-error" @click="handleDelete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
