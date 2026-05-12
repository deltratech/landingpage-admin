<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const hasInteractedEmail = ref(false)
const hasInteractedPassword = ref(false)
const { login, loading, errorMessage } = useAuth()

const validateField = (field) => {
    if (field === 'email') {
        emailError.value = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
    } else {
        passwordError.value = !password.value.trim()
    }
}

const handleSubmit = async () => {
    hasInteractedEmail.value = true
    hasInteractedPassword.value = true
    validateField('email')
    validateField('password')
    if (!emailError.value && !passwordError.value) {
        await login(email.value, password.value)
    }
}
</script>

<template>
    <div class="fixed inset-0 grid-bg bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <!-- Top-left brand mark -->
        <div class="absolute top-6 left-6 flex items-center gap-2">
            <img src="@/assets/images/deltratech-logo.png" alt="Deltra" class="size-7 rounded-md object-contain" />
            <span class="font-semibold tracking-tight text-gray-900 dark:text-white text-[15px]">Deltra</span>
        </div>

        <!-- Card -->
        <div class="w-full max-w-[420px] bg-white dark:bg-gray-800 rounded-xl shadow-dialog border border-gray-100 dark:border-gray-700 p-8">
            <div class="flex flex-col items-center text-center mb-7">
                <img src="@/assets/images/deltratech-logo.png" alt="Deltra" class="size-12 rounded-xl object-contain mb-4" />
                <h1 class="text-[20px] font-bold tracking-tight text-gray-900 dark:text-white">Welcome to Deltra Admin</h1>
                <p class="text-[13px] text-gray-500 mt-1">Sign in to your workspace to continue.</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Email -->
                <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
                    <div class="relative">
                        <svg class="absolute left-3 top-1/2 -translate-y-1/2 size-[15px] text-gray-400" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                        </svg>
                        <input
                            v-model="email"
                            type="email"
                            placeholder="name@company.com"
                            @blur="hasInteractedEmail = true; validateField('email')"
                            class="w-full h-10 pl-9 pr-3 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow"
                            :class="emailError && hasInteractedEmail ? 'border-error-500' : 'border-gray-200 dark:border-gray-700'"
                        />
                    </div>
                    <p v-if="emailError && hasInteractedEmail" class="mt-1 text-xs text-error-500">Please enter a valid email.</p>
                </div>

                <!-- Password -->
                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">Password</label>
                        <a href="#" class="text-[11px] font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-accent">Forgot?</a>
                    </div>
                    <div class="relative">
                        <input
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Your password"
                            @blur="hasInteractedPassword = true; validateField('password')"
                            class="w-full h-10 px-3 pr-10 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus-primary text-[13px] transition-shadow"
                            :class="passwordError && hasInteractedPassword ? 'border-error-500' : 'border-gray-200 dark:border-gray-700'"
                        />
                        <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg v-if="showPassword" class="size-[16px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            <svg v-else class="size-[16px]" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                    </div>
                    <p v-if="passwordError && hasInteractedPassword" class="mt-1 text-xs text-error-500">Password is required.</p>
                </div>

                <p v-if="errorMessage" class="text-[13px] text-error-500 font-medium">{{ errorMessage }}</p>

                <button
                    type="submit"
                    :disabled="loading"
                    class="w-full h-10 inline-flex items-center justify-center font-medium rounded-lg transition-colors text-[14px] bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80 shadow-sm disabled:opacity-60"
                >
                    <span v-if="loading">Signing in…</span>
                    <span v-else>Sign In</span>
                </button>
            </form>
        </div>

        <div class="absolute bottom-5 left-0 right-0 text-center text-[11px] text-gray-400">
            © 2026 Deltra
        </div>
    </div>
</template>
