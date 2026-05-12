<script setup>
import { ref } from 'vue'
import { toggleTheme, layout } from "@/stores/layout"
import Sidebar from './Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const showSearch = ref(false)
const showProfileMenu = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const logout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<template>
    <div class="z-[16] sticky top-0 flex items-center py-4 bg-body dark:bg-gray-900">
        <div class="absolute top-0 z-topbar start-0 end-0">
            <transition enter-active-class="duration-300 ease-in-out transition-height" enter-from-class="h-0"
                enter-to-class="h-auto" leave-active-class="duration-300 ease-in-out transition-height"
                leave-from-class="h-auto" leave-to-class="h-0">
                <div v-if="showSearch" @click.away="showSearch = false"
                    class="flex items-center justify-between gap-4 px-4 py-3 bg-white rounded dark:bg-gray-800 shadow-card">
                    <div class="flex items-center w-full">
                        <svg class="size-6 fill-gray-400" viewBox="0 0 24 24">
                            <path
                                d="M20.85,19.44l-4-4a2.44,2.44,0,0,0-.43-.35l-1-.69h0A7,7,0,1,0,10,17a7,7,0,0,0,4.37-1.53h0l.75,1a2.6,2.6,0,0,0,.3.36l4,4a.5.5,0,0,0,.71,0l.7-.7A.5.5,0,0,0,20.85,19.44ZM10,15a5,5,0,1,1,5-5A5,5,0,0,1,10,15Z" />
                        </svg>
                        <input
                            class="w-full py-1 font-medium bg-transparent border-0 text-13 dark:text-white pe-0 focus:ring-0"
                            type="text" placeholder="Search..." />

                    </div>
                    <button class="btn btn-primary btn-sm">Search</button>
                </div>
            </transition>
        </div>
        <div class="flex items-center justify-between w-full gap-4">
            <div class="flex items-center gap-2">
                <button type="button"
                    class="inline-block xl:hidden p-2 text-gray-400 size-10 hover:bg-gray-900 hover:bg-opacity-[0.04] rounded-full transition duration-300 ease-linear"
                    aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-offcanvas-mobile-sidebar"
                    data-hs-overlay="#hs-offcanvas-mobile-sidebar">
                    <svg class="inline-block fill-current" aria-hidden="true" viewBox="0 0 24 24">
                        <path class="opacity-30" fill="currentColor"
                            d="M15.28 4.5H4.72C3.772 4.5 3 5.06 3 5.75S3.772 7 4.72 7h10.56C16.228 7 17 6.44 17 5.75s-.772-1.25-1.72-1.25Z"
                            opacity="0.32"></path>
                        <path fill="currentColor"
                            d="M19.28 10.75H8.72C7.772 10.75 7 11.31 7 12s.772 1.25 1.72 1.25h10.56c.948 0 1.72-.56 1.72-1.25s-.772-1.25-1.72-1.25ZM15.28 17H4.72C3.772 17 3 17.56 3 18.25s.772 1.25 1.72 1.25h10.56c.948 0 1.72-.56 1.72-1.25S16.228 17 15.28 17Z">
                        </path>
                    </svg>
                </button>
              
            </div>
            <div class="flex items-center">
              
                <!-- Dark mode toggle -->
                <button @click="toggleTheme"
                    class="inline-block p-2 text-gray-400 size-10 hover:bg-gray-900 hover:bg-opacity-[0.04] rounded-full transition duration-300 ease-linear"
                    type="button">
                    <!-- Sun: shown in dark mode -->
                    <svg v-if="layout.theme === 'dark'" class="inline-block fill-current" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4837 5H12.4823C12.7581 5 12.9816 4.77614 12.9816 4.5V2.5C12.9816 2.22386 12.7581 2 12.4823 2H11.4837C11.208 2 10.9845 2.22386 10.9845 2.5V4.5C10.9845 4.77614 11.208 5 11.4837 5ZM16.9759 12C16.9759 14.7614 14.7405 17 11.983 17C9.22554 17 6.99017 14.7614 6.99017 12C6.99017 9.23858 9.22554 7 11.983 7C14.7405 7 16.9759 9.23858 16.9759 12ZM11.4837 19H12.4823C12.7581 19 12.9816 19.2239 12.9816 19.5V21.5C12.9816 21.7761 12.7581 22 12.4823 22H11.4837C11.208 22 10.9845 21.7761 10.9845 21.5V19.5C10.9845 19.2239 11.208 19 11.4837 19ZM21.4694 11H19.4723C19.1966 11 18.973 11.2239 18.973 11.5V12.5C18.973 12.7761 19.1966 13 19.4723 13H21.4694C21.7452 13 21.9687 12.7761 21.9687 12.5V11.5C21.9687 11.2239 21.7452 11 21.4694 11ZM4.99303 11.5V12.5C4.99303 12.7761 4.76949 13 4.49374 13H2.4966C2.22085 13 1.99731 12.7761 1.99731 12.5V11.5C1.99731 11.2239 2.22085 11 2.4966 11H4.49374C4.76949 11 4.99303 11.2239 4.99303 11.5ZM17.2754 7.4C17.3692 7.49466 17.4968 7.5479 17.6299 7.5479C17.7631 7.5479 17.8907 7.49466 17.9844 7.4L19.3924 6C19.4869 5.90612 19.5401 5.77832 19.5401 5.645C19.5401 5.51168 19.4869 5.38388 19.3924 5.29L18.6934 4.59C18.5997 4.49534 18.4721 4.4421 18.3389 4.4421C18.2058 4.4421 18.0782 4.49534 17.9844 4.59L16.5764 6C16.4819 6.09388 16.4288 6.22168 16.4288 6.355C16.4288 6.48832 16.4819 6.61612 16.5764 6.71L17.2754 7.4ZM6.3361 16.4521C6.46923 16.4521 6.59685 16.5053 6.6906 16.6L7.3896 17.29C7.48412 17.3839 7.53728 17.5117 7.53728 17.645C7.53728 17.7783 7.48412 17.9061 7.3896 18L5.98161 19.41C5.88786 19.5047 5.76025 19.5579 5.62712 19.5579C5.49399 19.5579 5.36638 19.5047 5.27263 19.41L4.57363 18.71C4.47911 18.6161 4.42594 18.4883 4.42594 18.355C4.42594 18.2217 4.47911 18.0939 4.57363 18L5.98161 16.6C6.07536 16.5053 6.20298 16.4521 6.3361 16.4521ZM17.9744 16.6C17.8807 16.5053 17.7531 16.4521 17.62 16.4521C17.4868 16.4521 17.3592 16.5053 17.2655 16.6L16.5665 17.3C16.4719 17.3939 16.4188 17.5217 16.4188 17.655C16.4188 17.7883 16.4719 17.9161 16.5665 18.01L17.9744 19.42C18.0682 19.5147 18.1958 19.5679 18.3289 19.5679C18.4621 19.5679 18.5897 19.5147 18.6834 19.42L19.3824 18.72C19.477 18.6261 19.5301 18.4983 19.5301 18.365C19.5301 18.2317 19.477 18.1039 19.3824 18.01L17.9744 16.6ZM6.34609 7.5479C6.21296 7.5479 6.08535 7.49466 5.9916 7.4L4.58361 5.99C4.48909 5.89612 4.43592 5.76832 4.43592 5.635C4.43592 5.50168 4.48909 5.37388 4.58361 5.28L5.28261 4.58C5.37636 4.48534 5.50398 4.4321 5.6371 4.4321C5.77023 4.4321 5.89785 4.48534 5.9916 4.58L7.3896 6C7.5827 6.19169 7.58713 6.50287 7.39958 6.7L6.70058 7.4C6.60683 7.49466 6.47922 7.5479 6.34609 7.5479Z" fill="#FFC675"/>
                    </svg>
                    <!-- Moon: shown in light mode -->
                    <svg v-else class="inline-block fill-current text-gray-600" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
                    </svg>
                </button>

                <!-- Profile dropdown (Vue-controlled) -->
                <div class="relative hidden md:block">
                    <button type="button" @click="showProfileMenu = !showProfileMenu"
                        class="text-gray-400 btn-dark-icon-hover flex items-center justify-center rounded-full size-9">
                        <svg class="size-[35px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8ZM12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12ZM12 15C10.8954 15 10 15.8954 10 17H8C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H14C14 15.8954 13.1046 15 12 15Z"/></svg>
                    </button>

                    <!-- Invisible backdrop to close menu on outside click -->
                    <div v-if="showProfileMenu" class="fixed inset-0 z-40" @click="showProfileMenu = false"></div>

                    <div v-if="showProfileMenu" class="absolute end-0 top-full mt-2 z-50 rounded-xl min-w-[230px] bg-white dark:bg-gray-800 shadow-drop-down">
                        <div class="py-2">
                            <div class="flex items-center gap-2 p-4 pt-3">
                                <svg class="size-[35px] text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8ZM12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12ZM12 15C10.8954 15 10 15.8954 10 17H8C8 14.7909 9.79086 13 12 13C14.2091 13 16 14.7909 16 17H14C14 15.8954 13.1046 15 12 15Z"/></svg>
                                <div>
                                    <p class="text-sm font-medium dark:text-white">Admin</p>
                                </div>
                            </div>
                            <hr class="border-gray-200 dark:border-gray-700">
                            <ul class="pt-2">
                                <hr class="my-2 border-gray-200 dark:border-gray-700">
                                <li @click="logout(); showProfileMenu = false"
                                    class="px-4 py-2 flex items-center gap-4 hover:bg-gray-900/5 dark:text-white dark:hover:bg-gray-100/5 cursor-pointer text-13">
                                    Sign Out
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="hs-offcanvas-mobile-sidebar"
        class="hs-overlay hs-overlay-backdrop-open:bg-transparent dark:hs-overlay-backdrop-open:bg-transparent hs-overlay-backdrop-open:bg-modal hs-overlay-backdrop-open:!z-[49] dark:hs-overlay-backdrop-open:bg-modal xl:hs-overlay-backdrop-open:hidden hs-overlay-backdrop-open:size-full fixed top-0 start-0 z-[50] xl:hidden"
        role="dialog" tabindex="-1" aria-labelledby="hs-offcanvas-mobile-sidebar-label">
        <Sidebar />
    </div>

</template>
