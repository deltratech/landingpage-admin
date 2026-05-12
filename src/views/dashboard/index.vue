<script setup>
import { onMounted, ref } from 'vue'
import { useContacts } from '@/composables/useContacts'
import { usePosts } from '@/composables/usePosts'

const { getContacts } = useContacts()
const { getPosts } = usePosts()

const contacts = ref([])
const posts = ref([])
const loadingContacts = ref(true)
const loadingPosts = ref(true)

onMounted(async () => {
    contacts.value = await getContacts()
    loadingContacts.value = false

    posts.value = await getPosts()
    loadingPosts.value = false
})

const recentContacts = () => contacts.value.slice(0, 5)
const recentPosts = () => posts.value.slice(0, 5)

const statusBadge = (status) => {
    const map = {
        published: 'bg-success-100 text-success-700',
        draft: 'bg-warning-100 text-warning-700',
        archived: 'bg-gray-100 text-gray-500',
    }
    return map[status] ?? 'bg-gray-100 text-gray-500'
}
</script>

<template>
    <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
        <!-- Contacts stat -->
        <div class="relative overflow-hidden card card-dark">
            <div class="card-body">
                <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center rounded-xl size-12 bg-brand-accent/10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-brand-accent size-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Total Contacts</p>
                        <h4 class="text-2xl font-bold">
                            <span v-if="loadingContacts" class="opacity-40">—</span>
                            <span v-else>{{ contacts.length }}</span>
                        </h4>
                    </div>
                </div>
            </div>
        </div>

        <!-- Posts stat -->
        <div class="relative overflow-hidden card card-dark">
            <div class="card-body">
                <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center rounded-xl size-12 bg-primary-50 dark:bg-primary-900/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="text-primary-500 size-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 7H7V9H17V7ZM17 11H7V13H17V11ZM14 15H7V17H14V15Z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
                        <h4 class="text-2xl font-bold">
                            <span v-if="loadingPosts" class="opacity-40">—</span>
                            <span v-else>{{ posts.length }}</span>
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        <!-- Recent Contacts -->
        <div class="card card-dark">
            <div class="flex items-center justify-between card-body border-b border-gray-100 dark:border-gray-700">
                <h6 class="font-semibold">Recent Contacts</h6>
                <RouterLink to="/contacts" class="text-sm text-primary-500 hover:underline">View all</RouterLink>
            </div>
            <div class="card-body">
                <div v-if="loadingContacts" class="py-6 text-center text-gray-400">Loading...</div>
                <div v-else-if="!contacts.length" class="py-6 text-center text-gray-400">No contacts yet.</div>
                <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-for="contact in recentContacts()" :key="contact.id" class="flex items-start justify-between py-3 gap-3">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center text-sm font-semibold rounded-full size-9 bg-brand-accent/10 text-brand-accent shrink-0">
                                {{ contact.name?.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="text-sm font-medium leading-none">{{ contact.name }}</p>
                                <p class="mt-1 text-xs text-gray-400">{{ contact.email }}</p>
                            </div>
                        </div>
                        <p class="text-xs text-gray-400 shrink-0">{{ contact.schoolName ?? '' }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Posts -->
        <div class="card card-dark">
            <div class="flex items-center justify-between card-body border-b border-gray-100 dark:border-gray-700">
                <h6 class="font-semibold">Recent Posts</h6>
                <RouterLink to="/posts" class="text-sm text-primary-500 hover:underline">View all</RouterLink>
            </div>
            <div class="card-body">
                <div v-if="loadingPosts" class="py-6 text-center text-gray-400">Loading...</div>
                <div v-else-if="!posts.length" class="py-6 text-center text-gray-400">No posts yet.</div>
                <div v-else class="divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-for="post in recentPosts()" :key="post.id" class="flex items-start justify-between py-3 gap-3">
                        <div>
                            <p class="text-sm font-medium leading-none">{{ post.title }}</p>
                            <p class="mt-1 text-xs text-gray-400">{{ post.slug }}</p>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0" :class="statusBadge(post.status)">
                            {{ post.status ?? 'draft' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
