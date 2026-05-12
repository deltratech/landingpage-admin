<script setup>
import { ref, onMounted } from 'vue';

// Reactive properties
const pageLength = ref(5); // Default page length
const totalItems = ref(6); // Total number of items (for example)

// Function to update page length
const updateTablePageLength = (event) => {
    pageLength.value = +event.target.value; // Update page length
};

// Configuration object for the select
const selectConfig = {
    placeholder: 'Select option...',
    toggleTag: '<button class="cursor-pointer" type="button" aria-expanded="false"></button>',
    toggleClasses: 'hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-1 ps-2 pe-6 flex gap-x-2 text-nowrap w-full cursor-pointer text-start text-sm',
    dropdownClasses: 'min-w-[65px] p-2 z-50 w-full max-h-72 bg-white dark:bg-gray-800 shadow-table rounded-lg overflow-hidden overflow-y-auto',
    optionClasses: 'py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hs-selected:bg-primary-500/5 dark:hs-selected:bg-primary-500/30 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 dark:hover:bg-gray-100/5 dark:text-neutral-200 dark:focus:bg-gray-100/10',
    optionTemplate: '<div class="flex items-center justify-between w-full"><span data-title></span></div>',
    extraMarkup: '<div class="absolute -translate-y-1/2 top-1/2 end-1"><i class="text-xl ri-arrow-down-s-fill text-gray-900/100 dark:text-gray-100/50"></i></div>',
};

// Lifecycle hook to dynamically import preline.js
onMounted(async () => {
    // Dynamically import preline.js
    await import('preline/preline.js?client');

    // Initialize preline components
    if (window?.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
    }
});
</script>
<template>
    <select id="custom_length" v-model="pageLength" @change="updateTablePageLength" class="hidden"
        :data-hs-select="JSON.stringify(selectConfig)">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
    </select>
</template>
<style scoped>
.hidden {
    display: none;
}
</style>