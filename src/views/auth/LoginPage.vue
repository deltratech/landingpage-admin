<script setup>
import { ref } from 'vue'
import { RiEyeFill, RiEyeOffFill } from 'vue-remix-icons'
import { useRouter } from 'vue-router'
import Loader from '@/Components/Loader.vue'
import { useAuth } from "@/composables/useAuth"

const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const emailError = ref(false)
const passwordError = ref(false)
const hasInteractedWithEmail = ref(false)
const hasInteractedWithPassword = ref(false)
const showPassword = ref(false)
const { login, loading, errorMessage } = useAuth()

const validateField = (field) => {
    if (field === 'password') {
        passwordError.value = password.value.trim() === ''
    } else if (field === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        emailError.value = !emailPattern.test(email.value)
    }
}



const handlePasswordBlur = () => {
    hasInteractedWithPassword.value = true
    validateField('password')
}

const validateAndSubmit = async () => {
    handlePasswordBlur()

    if (!emailError.value && !passwordError.value) {
        await login(email.value, password.value)
    }
}


const togglePassword = () => {
    showPassword.value = !showPassword.value
}



</script>
<template>
    <Loader />
    <div class="relative min-h-screen">
        <div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <div class="flex items-center justify-center h-full bg-brand-primary">
                <div class="text-white p-8 sm:p-12 max-w-[700px]">
                    <h1>Deltra Admin</h1>
                    <p class="mt-4 text-lg leading-relaxed">Welcome back! Please sign in to your account to continue.</p>
                </div>
            </div>
            <div class="flex items-center justify-center h-full bg-white dark:bg-gray-800 dark:text-white">
                <div class="p-8 max-w-[550px] w-full">
                    <h5 class="text-2xl font-semibold md:text-3xl">Sign In</h5>
                
                    <form @submit.prevent="validateAndSubmit">
                        <div>
                            <h6 class="mb-3 font-semibold leading-6 text-16">Login with your email/username</h6>
                            <div>
                                <input type="text" id="emailInput" autocomplete="username" v-model="email"
                                    @blur="handleEmailBlur"
                                    :class="['form-input form-input-sm !px-3.5 !leading-[18px] placeholder:opacity-50', { '!border-error-500': emailError && hasInteractedWithEmail, 'focus:!ring-error-500': emailError && hasInteractedWithEmail }]"
                                    placeholder="Enter your email or username" />
                                <p v-show="emailError && hasInteractedWithEmail"
                                    class="mt-1 px-3.5 text-xs text-error-500 leading-5">Email/Username is Required!</p>
                            </div>
                            <div class="mt-4">
                                <div class="relative">
                                    <span
                                        class="toggle-password absolute end-[14px] top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 text-16 leading-normal cursor-pointer"
                                        @click="togglePassword">
                                        <component :is="showPassword ? RiEyeFill : RiEyeOffFill" class="w-5" />
                                    </span>
                                    <input autocomplete="current-password" id="password-field-1"
                                        :type="showPassword ? 'text' : 'password'" v-model="password"
                                        @blur="handlePasswordBlur"
                                        :class="['form-input form-input-sm !px-3.5 !leading-[18px] placeholder:opacity-50', { '!border-error-500': passwordError && hasInteractedWithPassword, 'focus:!ring-error-500': passwordError && hasInteractedWithPassword }]"
                                        placeholder="Password" />
                                </div>
                                <p v-show="passwordError && hasInteractedWithPassword"
                                    class="mt-1 px-3.5 text-xs text-error-500 leading-5">Password is required</p>
                            </div>

                            <div class="flex items-center justify-between my-3">
                                <div class="flex items-center">
                                    <input type="checkbox" class="text-brand-primary" id="rememberMe"
                                        v-model="rememberMe">
                                    <label for="rememberMe"
                                        class="text-sm font-medium text-gray-900 cursor-pointer ms-2 dark:text-white">Remember
                                        me</label>
                                </div>
                                <router-link to="/forget-password"
                                    class="text-brand-primary text-13 font-medium leading-[19px]">Forget
                                    Password?</router-link>
                            </div>
                            <p v-if="errorMessage" class="text-error-500">{{ errorMessage }}</p>
                            <button type="submit" class="w-full mt-6 btn ripple bg-brand-accent text-white" :disabled="loading">
                                <span v-if="loading">Loading...</span>
                                <span v-else>Sign In</span>
                            </button>
                        </div>
                    </form>

              

                </div>
            </div>
        </div>
    </div>
</template>