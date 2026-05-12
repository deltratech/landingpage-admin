<script setup>
import { RouterLink } from 'vue-router'
import simplebar from 'simplebar-vue'
import { layout, toggleSidebarCollapse } from '@/stores/layout'


</script>

<template>
    <div class="fixed  inset-y-0 ltr:-start-[280px] ltr:xl:start-0 rtl:-right-[280px] rtl:xl:right-0 hs-overlay hs-overlay-open:start-0 bg-white dark:bg-gray-900 border-r rtl:border-e rtl:border-r-0 border-dashed dark:border-none w-sidebar z-sidebar transition-width duration-200 ease-in-out"
        :class="{ 'mini-sidebar': layout.sidebar === 'collapse' }">
        <div class="flex items-center justify-between pt-[17px] pb-2 pl-8 pr-4 h-[70px]">
            <RouterLink to="/dashboard">
                <h5>Deltra Admin</h5>
            </RouterLink>
            
            <!-- Mobile screen close button -->
            <button aria-label="Close" tabindex="0" type="button"
                class="inline-block p-2 text-gray-500 close-sidebar btn-dark-icon-hover size-10 xl:!hidden"
                @click="toggleSidebarCollapse">
                <svg class="inline-block text-lg fill-current size-6" focusable="false" aria-hidden="true"
                    viewBox="-2 0 19 16">
                    <path class="opacity-40"
                        d="M1 1.75C0.447187 1.75 0 2.19719 0 2.75V12.75C0 13.3028 0.447187 13.75 1 13.75C1.55281 13.75 2 13.3028 2 12.75V2.75C2 2.19719 1.55281 1.75 1 1.75Z">
                    </path>
                    <path
                        d="M8.37634 3.20966C8.76697 2.81903 9.39978 2.81903 9.79041 3.20966C10.181 3.60028 10.181 4.23153 9.78978 4.62278L7.49666 6.91591H13.0842C13.637 6.91591 14.0842 7.36309 14.0842 7.91591C14.0842 8.46872 13.637 8.91591 13.0842 8.91591H7.49978L9.79119 11.209C9.9865 11.404 10.0842 11.6597 10.0842 11.9159C10.0842 12.1722 9.98728 12.4284 9.79041 12.6237C9.39978 13.0143 8.76697 13.0143 8.37634 12.6237L4.37634 8.62372C3.98572 8.23309 3.98572 7.60028 4.37634 7.20966L8.37634 3.20966Z">
                    </path>
                </svg>
            </button>
                     
        </div>
        <simplebar class="h-[calc(100%-68px)] overflow-y-auto overflow-x-hidden">
            
            <div class="px-4" id="navbar_links">
                <RouterLink to="/dashboard" class="menu-link hover:bg-opacity-[0.04] rounded-full" active-class="active-link" exact-active-class="active-link">
                    <svg focusable="false" aria-hidden="true" viewBox="0 0 14 12">
                        <path
                            d="M7 2.8V1.05C7 0.470094 7.47031 0 8.05 0H12.95C13.5297 0 14 0.470094 14 1.05V5.95C14 6.52969 13.5297 7 12.95 7H8.05C7.47031 7 7 6.52969 7 5.95V4.9H8.4V5.6H12.6V1.4H8.4V2.8H7Z">
                        </path>
                        <path class="opacity-40"
                            d="M5.24998 1.05C5.24998 1.62991 4.77967 2.1 4.19998 2.1C3.62029 2.1 3.14998 1.62991 3.14998 1.05C3.14998 0.470094 3.62029 0 4.19998 0C4.77967 0 5.24998 0.470094 5.24998 1.05ZM4.02498 7.7V10.5C4.02498 10.8872 3.71217 11.2 3.32498 11.2C2.93779 11.2 2.62498 10.8872 2.62498 10.5V5.61969L2.00001 6.66094C1.80095 6.99125 1.37089 7.09844 1.03948 6.89937C0.708074 6.70031 0.600887 6.27156 0.800168 5.93906L2.07482 3.81938C2.45436 3.18719 3.13686 2.8 3.87404 2.8H8.74998C9.13717 2.8 9.44998 3.11281 9.44998 3.5C9.44998 3.88719 9.13717 4.2 8.74998 4.2H5.77498V10.5C5.77498 10.8872 5.46217 11.2 5.07498 11.2C4.68779 11.2 4.37498 10.8872 4.37498 10.5V7.7H4.02498Z">
                        </path>
                    </svg>
                    <span>Dashboard</span>
                </RouterLink>
               
                <p class="mt-6 menu-title">Management</p>
                <div class="hs-accordion-group">

                    <!-- Contacts -->
                    <RouterLink to="/contacts" class="menu-link hover:bg-opacity-[0.04] rounded-full"
                        active-class="active-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
                        </svg>
                        <span>Contacts</span>
                    </RouterLink>

                </div>

                <p class="mt-6 menu-title">Content</p>
                <div class="hs-accordion-group">

                    <!-- Posts -->
                    <RouterLink to="/posts" class="menu-link hover:bg-opacity-[0.04] rounded-full"
                        active-class="active-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 7H7V9H17V7ZM17 11H7V13H17V11ZM14 15H7V17H14V15Z"/>
                        </svg>
                        <span>Posts</span>
                    </RouterLink>

                    <!-- Testimonials -->
                    <RouterLink to="/testimonials" class="menu-link hover:bg-opacity-[0.04] rounded-full"
                        active-class="active-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.040.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                        </svg>
                        <span>Testimonials</span>
                    </RouterLink>

                    <!-- FAQs -->
                    <RouterLink to="/faqs" class="menu-link hover:bg-opacity-[0.04] rounded-full"
                        active-class="active-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                        </svg>
                        <span>FAQs</span>
                    </RouterLink>

                </div>

                <p class="mt-6 menu-title">Assets</p>
                <div class="hs-accordion-group">

                    <!-- Media -->
                    <RouterLink to="/media" class="menu-link hover:bg-opacity-[0.04] rounded-full"
                        active-class="active-link">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                        <span>Media Library</span>
                    </RouterLink>

                </div>

            </div>
        </simplebar>
    </div>
</template>

<style>
.active-link {
    --tw-bg-opacity: 1
    background-color: rgb(254 241 244 / var(--tw-bg-opacity));
    --tw-text-opacity: 1;
    color: var(--color-primary);
}

.active-link:hover {
    background-color: transparent;
}
</style>