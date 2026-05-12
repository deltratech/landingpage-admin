import { reactive, watch } from 'vue'

const userSettings = {
    theme: 'dark', // light | dark
    dir: 'ltr', // ltr | rtl
    sidebar: 'expanded', // collapse | expanded
}

const layout = reactive({
    theme: localStorage.getItem('theme') || userSettings.theme,
    dir: localStorage.getItem('dir') || userSettings.dir,
    sidebar: localStorage.getItem('sidebar') || userSettings.dir
})

function initLayout() {
    // Set Layout Theme
    if (layout.theme === 'light') {
        document.documentElement.classList.remove('dark')
    } else {
        document.documentElement.classList.add('dark')
    }

    // Set Layout Direction
    document.documentElement.setAttribute('dir', layout.dir)

    // Watch for changes and update localStorage
    watch(() => layout.theme, (newTheme) => {
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', newTheme)
    })

    watch(() => layout.dir, (newDir) => {
        document.documentElement.setAttribute('dir', newDir)
        localStorage.setItem('dir', newDir)
    })

    watch(() => layout.sidebar, (newSidebar) => {
        localStorage.setItem('sidebar', newSidebar)
    })
}

function toggleTheme() {
    layout.theme = layout.theme === 'dark' ? 'light' : 'dark'
}

function toggleDir() {
    layout.dir = layout.dir === 'ltr' ? 'rtl' : 'ltr'
}

function toggleSidebarCollapse() {
    layout.sidebar = layout.sidebar === 'collapse' ? 'expanded' : 'collapse'
}

export { layout, initLayout, toggleTheme, toggleDir, toggleSidebarCollapse }
