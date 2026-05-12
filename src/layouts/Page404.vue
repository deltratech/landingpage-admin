<script setup>
import Loader from '@/Components/Loader.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
function goComponentsPage() {
    console.log("Navigating to components page");
    router.push('/login'); // Navigate to the components page
}
</script>
<template>
    <Loader />
    <div class="container py-12">
        <div class="text-center">
            <h2 class="text-[42px] sm:text-[52px] font-bold leading-[63px] dark:text-white sm:leading-[78px]">Page Not
                Found!</h2>
            <p class="text-lg leading-[27px] text-gray-500 dark:text-gray-400 mt-2">
                Don't Panic! Learn How to Turn Page Not Found into a
                <br>
                Roadmap for Online Success.
            </p>
            <div class="py-20 max-w-[600px] mx-auto">
                <img class="w-full" src="@/assets/images/pages/error.svg" alt="404">
            </div>
            <button ripple-opacity="0.3" ripple-color="black" class="btn ripple bg-error-400 text-white !py-[5px] mt-2"
                @click="goComponentsPage">Go Home</button>
        </div>
    </div>
</template>