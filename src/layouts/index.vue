<script setup>
import Loader from '@/Components/Loader.vue'
import Topbar from './Topbar.vue'
import Footer from './Footer.vue'
import Sidebar from './Sidebar.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { initLayout } from '@/stores/layout'
import { layout } from '@/stores/layout'
const route = useRoute()

onMounted(() => {
    initLayout()    
})
</script>

<template>
    
    <Sidebar />
    <div class="relative min-h-screen ltr:xl:ml-[86px] rtl:xl:mr-[86px] transition-margin duration-200 ease-in-out"
        :class="layout.sidebar === 'expanded' ? 'rtl:xl:!mr-sidebar ltr:xl:!ml-sidebar' : ''">
        <div class="w-full h-full flex flex-col justify-between  px-8">
            <Topbar />
            <router-view />
            <Footer v-if="!route.meta.hideFooter" />
        </div>
    </div>
</template>