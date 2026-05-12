<script setup>
import Loader from '@/Components/Loader.vue';
import { ref } from 'vue';

const email = ref('');
const emailError = ref(false);
const hasInteractedWithEmail = ref(false);

const validateField = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailError.value = !emailPattern.test(email.value);
};

const handleEmailBlur = () => {
    hasInteractedWithEmail.value = true;
    validateField();
};

const validateAndSubmit = () => {
    hasInteractedWithEmail.value = true;
    validateField();
    if (!emailError.value) {
        console.log('Send reset link to:', email.value);
    }
};
</script>
<template>
    <Loader />
    <div class="relative min-h-screen">
        <div
            class="flex items-center justify-center h-full min-h-screen text-center bg-white dark:bg-gray-800 dark:text-white">
            <div class="p-4 lg:p-8 max-w-[550px]">
                <img class="mx-auto" src="@/assets/images/forget-password.png" alt="forget-password" />
                <h5 class="mt-4 text-2xl font-semibold md:text-3xl">Forgot your password?</h5>
                <p class="mt-2 mb-10 text-sm leading-[21px] text-gray-500 dark:text-gray-400 px-8">
                    Please enter the email address associated with your account and we will email you a link to reset
                    your password.
                </p>
                <form @submit.prevent="validateAndSubmit">
                    <div>
                        <div>
                            <input type="email" id="emailInput" v-model="email" @blur="handleEmailBlur" :class="[
                                'form-input form-input-sm !px-3.5 !leading-[18px]',
                                { '!border-error-500': emailError && hasInteractedWithEmail, 'focus:!ring-error-500': emailError && hasInteractedWithEmail }
                            ]" placeholder="Email" />
                            <p v-if="emailError && hasInteractedWithEmail"
                                class="mt-1 px-3.5 text-xs text-error-500 text-start leading-5">Email is Required!</p>
                        </div>
                        <button type="submit"
                            class="w-full mt-6 text-sm font-semibold leading-6 btn ripple btn-primary">Send
                            Link</button>
                        <router-link to="/register"
                            class="flex items-center justify-center mt-6 text-sm text-gray-500 dark:text-gray-400 leading-[21px]">
                            <i class="text-xl ri-arrow-left-s-line"></i> Back to Sign In
                        </router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>