<script setup>
import { onMounted, defineProps } from 'vue';
defineProps({
    options: {
        type: Object,
        default: [
            {
                name: 'All',
                value: 'all'
            },
            {
                name: 'Pending',
                value: 'pending'
            },
            {
                name: 'Complete',
                value: 'complete'
            },
        ],
    }
})

const selectConfig = JSON.stringify({
    hasSearch: false,
    placeholder: 'Status',
    toggleTag: '<button type="button" aria-expanded="false"><span class="flex items-center me-2" data-icon></span><span class="text-gray-800 dark:text-neutral-200" data-title></span></button>',
    toggleClasses: 'hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative flex items-center gap-x-2 text-nowrap w-full cursor-pointer border py-3 ps-[14px] pe-[43px] text-sm border-gray-200 text-gray-900 hover:border-gray-900 dark:hover:border-white rounded-lg focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-primary-500',
    dropdownClasses: 'max-h-72 absolute z-50 w-full p-2 bg-white dark:bg-gray-800 shadow-drop-down dark:shadow-dark-drop-down rounded-lg mt-2 overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:border-neutral-700',
    optionClasses: 'flex items-center gap-x-3 py-1.5 px-4 rounded-lg text-6 text-gray-900 hover:bg-gray-100 hs-combo-box-selected:bg-primary-50 dark:hs-combo-box-selected:bg-primary-500/10 focus:outline-none focus:bg-gray-200 dark:text-white dark:hover:bg-gray-700/30 dark:focus:bg-gray-700',
    optionTemplate: '<div><div class="flex items-center"><div class="me-2" data-icon></div><div class="text-gray-800 dark:text-neutral-200" data-title></div></div></div>',
    extraMarkup: '<div class="absolute -translate-y-1/2 top-1/2 end-3"><button class="btn-secondary-icon-hover size-6"><i class="text-xl font-bold ri-arrow-down-s-line text-gray-900/50 dark:text-gray-100/50:rotate-180"></i></button></div>'
});

onMounted(() => {
    setTimeout(() => {
        window.HSStaticMethods.autoInit();
    }, 100)
});
</script>
<template>
    <div class="relative z-0 flex-shrink-0 group">
        <div class="w-32 md:!w-40">
            <select id="position_filter" :data-hs-select="selectConfig" class="hidden">
                <option value="">All</option>
                <option v-for="(option, index) in options" :key="index" :value="option.value">{{ option.name }}</option>
            </select>
        </div>
    </div>
</template>