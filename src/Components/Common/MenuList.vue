<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    setTimeout(() => {
        window.HSStaticMethods.autoInit();
    }, 100)
});
</script>
<template>
    <div class="relative inline-flex hs-dropdown">
        <button id="hs-dropdown-with-dividers" type="button" class="hs-dropdown-toggle btn-dark-icon-hover size-10">
            <i class="text-gray-400 ri-more-2-fill"></i>
        </button>
        <div class="hs-dropdown-menu min-w-24 max-h-40 overflow-y-auto transition-[opacity,margin] duration opacity-0 hidden hs-dropdown-open:opacity-100"
            aria-labelledby="hs-dropdown-with-dividers">
            <div class="p-2">
                <a class="dropdown-item" href="#!">
                    <div class="flex gap-2">
                        <svg class="w-5 fill-gray-500 dark:fill-dark-15 MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-18zfaoc"
                            focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RemoveRedEyeIcon">
                            <path
                                d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z">
                            </path>
                        </svg>
                        <span>View</span>
                    </div>
                </a>
                <a class="dropdown-item" href="#!">
                    <div class="flex gap-2">
                        <svg class="w-5 fill-gray-500 dark:fill-dark-15 MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-18zfaoc"
                            focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EditIcon">
                            <path
                                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
                            </path>
                        </svg>
                        <span>Edit</span>
                    </div>
                </a>
                <a class="delete_selected dropdown-item" href="#!">
                    <div class="flex gap-2">
                        <svg class="w-5 fill-gray-500 dark:fill-dark-15 MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-18zfaoc"
                            focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteOutlineIcon">
                            <path
                                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z">
                            </path>
                        </svg>
                        <span>Delete</span>
                    </div>
                </a>
            </div>
        </div>
    </div>
</template>