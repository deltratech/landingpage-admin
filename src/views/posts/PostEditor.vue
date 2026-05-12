<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { usePosts } from '@/composables/usePosts'

const router = useRouter()
const route = useRoute()
const { getPosts, getPostBySlug, createPost, updatePost, loading } = usePosts()

const isEdit = computed(() => !!route.params.id)
const postId = computed(() => route.params.id)

const title = ref('')
const slug = ref('')
const status = ref('draft')
const coverImage = ref('')
const excerpt = ref('')
const saving = ref(false)
const saved = ref(false)
const error = ref('')
const showLinkDialog = ref(false)
const showImageDialog = ref(false)
const linkUrl = ref('')
const imageUrl = ref('')

const editor = useEditor({
    extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
        Underline,
        Link.configure({ openOnClick: false, autolink: true }),
        Image,
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Placeholder.configure({ placeholder: 'Start writing your post...' }),
    ],
    editorProps: {
        attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] px-1 py-2' },
    },
})

const autoSlug = () => {
    if (!isEdit.value && title.value && !slug.value) {
        slug.value = title.value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
    }
}

const applyLink = () => {
    if (!linkUrl.value) {
        editor.value?.chain().focus().unsetLink().run()
    } else {
        editor.value?.chain().focus().setLink({ href: linkUrl.value }).run()
    }
    linkUrl.value = ''
    showLinkDialog.value = false
}

const openLinkDialog = () => {
    linkUrl.value = editor.value?.getAttributes('link').href ?? ''
    showLinkDialog.value = true
}

const insertImage = () => {
    if (imageUrl.value) {
        editor.value?.chain().focus().setImage({ src: imageUrl.value }).run()
    }
    imageUrl.value = ''
    showImageDialog.value = false
}

const save = async (publish = false) => {
    if (!title.value.trim()) { error.value = 'Title is required.'; return }
    if (!slug.value.trim()) { error.value = 'Slug is required.'; return }
    const content = editor.value?.getHTML() ?? ''
    if (!content || content === '<p></p>') { error.value = 'Content is required.'; return }
    error.value = ''

    const payload = {
        title: title.value,
        slug: slug.value,
        content,
        status: publish ? 'published' : status.value,
    }
    if (excerpt.value) payload.excerpt = excerpt.value
    if (coverImage.value) payload.coverImage = coverImage.value

    saving.value = true
    let result
    if (isEdit.value) {
        result = await updatePost(postId.value, payload)
    } else {
        result = await createPost(payload)
    }
    saving.value = false

    if (result) {
        if (publish) status.value = 'published'
        saved.value = true
        setTimeout(() => { saved.value = false }, 3000)
        if (!isEdit.value && result.id) {
            router.replace({ name: 'post-edit', params: { id: result.id } })
        }
    }
}

onMounted(async () => {
    if (isEdit.value) {
        const posts = await getPosts()
        const post = posts?.find(p => p.id == postId.value)
        if (post) {
            title.value = post.title ?? ''
            slug.value = post.slug ?? ''
            status.value = post.status ?? 'draft'
            coverImage.value = post.coverImage ?? ''
            excerpt.value = post.excerpt ?? ''
            if (post.content) {
                editor.value?.commands.setContent(post.content)
            }
        }
    }
})

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<template>
    <div class="flex flex-col h-full min-h-screen bg-gray-50 dark:bg-gray-900">

        <!-- Top bar -->
        <div class="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div class="flex items-center gap-3">
                <button @click="router.push('/posts')"
                    class="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Posts
                </button>
                <span class="text-gray-300 dark:text-gray-600">|</span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ isEdit ? 'Edit Post' : 'New Post' }}</span>
            </div>

            <div class="flex items-center gap-2">
                <span v-if="saved" class="text-xs text-success-600 dark:text-success-400 font-medium">Saved ✓</span>
                <span v-if="error" class="text-xs text-error-500 font-medium">{{ error }}</span>

                <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="status === 'published' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'">
                    {{ status }}
                </span>

                <button @click="save(false)" :disabled="saving"
                    class="btn btn-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    {{ saving ? 'Saving...' : 'Save draft' }}
                </button>
                <button @click="save(true)" :disabled="saving"
                    class="btn btn-sm bg-primary-500 text-white hover:bg-primary-600">
                    {{ status === 'published' ? 'Update' : 'Publish' }}
                </button>
            </div>
        </div>

        <!-- Body -->
        <div class="flex flex-1 overflow-hidden">

            <!-- Main editor area -->
            <div class="flex-1 overflow-y-auto">
                <div class="max-w-7xl mx-auto px-6 py-8">

                    <!-- Title -->
                    <input
                        v-model="title"
                        @blur="autoSlug"
                        type="text"
                        placeholder="Add title"
                        class="w-full text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-6 leading-tight"
                    />

                    <!-- Toolbar -->
                    <div v-if="editor"
                        class="flex flex-wrap items-center gap-0.5 p-1.5 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm sticky top-[61px] z-20">

                        <!-- Undo / Redo -->
                        <button @click="editor.chain().focus().undo().run()" title="Undo"
                            class="toolbar-btn" :class="{ 'opacity-30 cursor-not-allowed': !editor.can().undo() }">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6-6m-6 6l6 6"/></svg>
                        </button>
                        <button @click="editor.chain().focus().redo().run()" title="Redo"
                            class="toolbar-btn" :class="{ 'opacity-30 cursor-not-allowed': !editor.can().redo() }">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6"/></svg>
                        </button>

                        <div class="toolbar-divider"/>

                        <!-- Headings -->
                        <button v-for="lvl in [1, 2, 3]" :key="lvl"
                            @click="editor.chain().focus().toggleHeading({ level: lvl }).run()"
                            :class="['toolbar-btn font-bold text-xs', editor.isActive('heading', { level: lvl }) ? 'active' : '']"
                            :title="`Heading ${lvl}`">H{{ lvl }}</button>

                        <div class="toolbar-divider"/>

                        <!-- Formatting -->
                        <button @click="editor.chain().focus().toggleBold().run()" title="Bold"
                            :class="['toolbar-btn font-bold', editor.isActive('bold') ? 'active' : '']">B</button>
                        <button @click="editor.chain().focus().toggleItalic().run()" title="Italic"
                            :class="['toolbar-btn italic', editor.isActive('italic') ? 'active' : '']">I</button>
                        <button @click="editor.chain().focus().toggleUnderline().run()" title="Underline"
                            :class="['toolbar-btn underline', editor.isActive('underline') ? 'active' : '']">U</button>
                        <button @click="editor.chain().focus().toggleStrike().run()" title="Strike"
                            :class="['toolbar-btn line-through', editor.isActive('strike') ? 'active' : '']">S</button>
                        <button @click="editor.chain().focus().toggleCode().run()" title="Inline code"
                            :class="['toolbar-btn font-mono text-xs', editor.isActive('code') ? 'active' : '']">&lt;/&gt;</button>

                        <div class="toolbar-divider"/>

                        <!-- Lists -->
                        <button @click="editor.chain().focus().toggleBulletList().run()" title="Bullet list"
                            :class="['toolbar-btn', editor.isActive('bulletList') ? 'active' : '']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                        </button>
                        <button @click="editor.chain().focus().toggleOrderedList().run()" title="Numbered list"
                            :class="['toolbar-btn', editor.isActive('orderedList') ? 'active' : '']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h.01M4 12h.01M4 18h.01"/></svg>
                        </button>
                        <button @click="editor.chain().focus().toggleBlockquote().run()" title="Blockquote"
                            :class="['toolbar-btn', editor.isActive('blockquote') ? 'active' : '']">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
                        </button>
                        <button @click="editor.chain().focus().toggleCodeBlock().run()" title="Code block"
                            :class="['toolbar-btn font-mono text-xs', editor.isActive('codeBlock') ? 'active' : '']">{ }</button>

                        <div class="toolbar-divider"/>

                        <!-- Alignment -->
                        <button @click="editor.chain().focus().setTextAlign('left').run()" title="Align left"
                            :class="['toolbar-btn', editor.isActive({ textAlign: 'left' }) ? 'active' : '']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h10M4 14h16M4 18h10"/></svg>
                        </button>
                        <button @click="editor.chain().focus().setTextAlign('center').run()" title="Align center"
                            :class="['toolbar-btn', editor.isActive({ textAlign: 'center' }) ? 'active' : '']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 10h10M4 14h16M7 18h10"/></svg>
                        </button>
                        <button @click="editor.chain().focus().setTextAlign('right').run()" title="Align right"
                            :class="['toolbar-btn', editor.isActive({ textAlign: 'right' }) ? 'active' : '']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 10h10M4 14h16M10 18h10"/></svg>
                        </button>

                        <div class="toolbar-divider"/>

                        <!-- Link & Image -->
                        <button @click="openLinkDialog" title="Insert link"
                            :class="['toolbar-btn', editor.isActive('link') ? 'active' : '']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                        </button>
                        <button @click="showImageDialog = true" title="Insert image">
                            <span class="toolbar-btn">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/><polyline points="21 15 16 10 5 21" stroke-width="2"/></svg>
                            </span>
                        </button>

                        <div class="toolbar-divider"/>

                        <!-- Horizontal rule -->
                        <button @click="editor.chain().focus().setHorizontalRule().run()" title="Horizontal rule" class="toolbar-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" stroke-width="2"/></svg>
                        </button>

                        <!-- Clear marks -->
                        <button @click="editor.chain().focus().clearNodes().unsetAllMarks().run()" title="Clear formatting" class="toolbar-btn">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    <!-- Editor -->
                    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                        <EditorContent :editor="editor" class="editor-content" />
                    </div>

                </div>
            </div>

            <!-- Right sidebar -->
            <div class="w-72 shrink-0 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
                <div class="p-5 space-y-6">

                    <!-- Status & Visibility -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                            Status &amp; Visibility
                        </h3>
                        <div class="relative">
                            <select v-model="status"
                                class="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    <!-- Permalink -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                            Permalink
                        </h3>
                        <label class="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Slug</label>
                        <input v-model="slug" type="text" placeholder="post-slug"
                            class="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500" />
                    </div>

                    <!-- Featured Image -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                            Featured Image
                        </h3>
                        <div v-if="coverImage" class="mb-2 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                            <img :src="coverImage" alt="Cover" class="w-full h-32 object-cover" @error="(e) => e.target.style.display='none'" />
                        </div>
                        <input v-model="coverImage" type="url" placeholder="https://..."
                            class="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500" />
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Paste an image URL above</p>
                    </div>

                    <!-- Excerpt -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                            Excerpt
                        </h3>
                        <textarea v-model="excerpt" rows="3" placeholder="Short description..."
                            class="w-full text-sm p-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 resize-none"></textarea>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Shown on post lists and social previews.</p>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <!-- Link dialog -->
    <div v-if="showLinkDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-dialog p-6 w-full max-w-sm mx-4">
            <h6 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Insert Link</h6>
            <input v-model="linkUrl" type="url" placeholder="https://example.com"
                class="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 mb-4"
                @keyup.enter="applyLink" />
            <div class="flex justify-end gap-3">
                <button class="btn btn-sm btn-secondary" @click="showLinkDialog = false">Cancel</button>
                <button class="btn btn-sm bg-primary-500 text-white" @click="applyLink">Apply</button>
            </div>
        </div>
    </div>

    <!-- Image dialog -->
    <div v-if="showImageDialog" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-dialog p-6 w-full max-w-sm mx-4">
            <h6 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Insert Image</h6>
            <input v-model="imageUrl" type="url" placeholder="https://example.com/image.jpg"
                class="w-full p-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 mb-4"
                @keyup.enter="insertImage" />
            <div class="flex justify-end gap-3">
                <button class="btn btn-sm btn-secondary" @click="showImageDialog = false">Cancel</button>
                <button class="btn btn-sm bg-primary-500 text-white" @click="insertImage">Insert</button>
            </div>
        </div>
    </div>
</template>

<style>
.toolbar-btn {
    @apply p-1.5 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm flex items-center justify-center min-w-[28px] min-h-[28px];
}
.toolbar-btn.active {
    @apply bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400;
}
.toolbar-divider {
    @apply w-px h-5 bg-gray-200 dark:bg-gray-600 mx-0.5;
}

/* TipTap editor typography */
.editor-content .ProseMirror {
    @apply px-6 py-5 min-h-[400px] outline-none text-gray-900 dark:text-gray-100;
}
.editor-content .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    @apply text-gray-400 dark:text-gray-500 float-left h-0 pointer-events-none;
}
.editor-content .ProseMirror h1 { @apply text-3xl font-bold mb-4 mt-6 text-gray-900 dark:text-white; }
.editor-content .ProseMirror h2 { @apply text-2xl font-semibold mb-3 mt-5 text-gray-900 dark:text-white; }
.editor-content .ProseMirror h3 { @apply text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white; }
.editor-content .ProseMirror p  { @apply mb-3 leading-relaxed; }
.editor-content .ProseMirror strong { @apply font-bold; }
.editor-content .ProseMirror em    { @apply italic; }
.editor-content .ProseMirror u     { @apply underline; }
.editor-content .ProseMirror s     { @apply line-through; }
.editor-content .ProseMirror a     { @apply text-primary-600 dark:text-primary-400 underline cursor-pointer; }
.editor-content .ProseMirror blockquote {
    @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-500 dark:text-gray-400 my-4;
}
.editor-content .ProseMirror ul { @apply list-disc pl-6 mb-3 space-y-1; }
.editor-content .ProseMirror ol { @apply list-decimal pl-6 mb-3 space-y-1; }
.editor-content .ProseMirror code {
    @apply bg-gray-100 dark:bg-gray-700 text-error-600 dark:text-error-400 px-1.5 py-0.5 rounded text-sm;
    font-family: ui-monospace, monospace;
}
.editor-content .ProseMirror pre {
    @apply bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto;
    font-family: ui-monospace, monospace;
}
.editor-content .ProseMirror pre code { @apply bg-transparent text-inherit p-0; }
.editor-content .ProseMirror hr { @apply border-gray-200 dark:border-gray-700 my-6; }
.editor-content .ProseMirror img { @apply max-w-full rounded-lg my-4; }
</style>
