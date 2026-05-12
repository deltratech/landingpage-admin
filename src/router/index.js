import { createRouter, createWebHistory } from "vue-router"
import MainLayout from "@/layouts/index.vue"

const routes = [    

    { path: '/', redirect: '/login' },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/auth/LoginPage.vue")
    },
    

    {
        path: '/',
        component: MainLayout,
        children: [
            { 
                path: "/dashboard", 
                name: "dashboard",
                component: () => import("@/views/dashboard/index.vue"),
                meta: { requiresAuth: true }
            },            
            {
                path: "/users",
                name: "users",
                component: () => import("@/views/users/index.vue"),
                meta: { hideFooter: true, requiresAuth: true },  // Footer is hidden
            },
            {
                path: "/contacts",
                name: "contacts",
                component: () => import("@/views/contacts/index.vue"),
                meta: { hideFooter: true, requiresAuth: true },  // Footer is hidden
            },
            {
                path: "/posts",
                name: "posts",
                component: () => import("@/views/posts/index.vue"),
                meta: { hideFooter: true, requiresAuth: true },
            },

        ],
    },

    {
        path: "/posts/new",
        name: "post-new",
        component: () => import("@/views/posts/PostEditor.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/posts/:id/edit",
        name: "post-edit",
        component: () => import("@/views/posts/PostEditor.vue"),
        meta: { requiresAuth: true },
    },

    {
        path: "/:pathMatch(.*)*",
        name: "page_404",
        component: () => import("@/layouts/Page404.vue")
    },

]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})


router.beforeEach((to, from, next) => {
    const accessToken = localStorage.getItem("accessToken")
    
    if (accessToken) {
        // console.log(accessToken)        
        if (to.path === "/" || to.path === "/login") {
            return next("/dashboard")
        }
    } else {
        // Jika tidak ada accessToken dan halaman membutuhkan autentikasi, redirect ke login
        if (to.meta.requiresAuth) {
            return next("/login")
        }
    }

    next()
})


export default router