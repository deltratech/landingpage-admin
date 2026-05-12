<script setup>
import { onMounted, ref, computed } from 'vue'
import { RiArrowLeftSLine, RiArrowRightSLine, RiSkipLeftLine, RiSkipRightLine } from 'vue-remix-icons';
import { useUsers } from '@/composables/useUsers'
import { useOutlets } from '@/composables/useOutlets'
import { useAuth } from '@/composables/useAuth'



const { outlets, getOutlets } = useOutlets()
const { users, isLoading, updateUser, getUsers, createUser, deleteUser, loadUsers, currentPage, totalPages } = useUsers()
const { getRoles } = useAuth()

const roles = ref({})

const isEditModalOpen = ref(false)
const userData = ref({
    full_name: '',
    username: '',
    password: '',    
    role_id: '1',
    outlet_id: '',
})

const confirPassoword= ref('')

const sortedUsers = computed(() => {
    return [...users.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})


// Simpan perubahan
const saveNewUser = async () => {
    if (userData.value.password.length < 8) {
        alert("Password harus lebih dari 8 karakter.");
        return;
    }

    if (userData.value.password !== confirPassoword.value) {
        alert("Password dan konfirmasi password tidak cocok.");
        return;
    }
    try {
        
        await createUser(userData.value)
        await loadUsers() 
        resetUserData()
        setTimeout(() => {
            window.HSStaticMethods.autoInit()
        }, 100)
    } catch (err) {
        console.error('Failed to add user:', err)
    }
}




const showConfirm = ref(false)
const selectedId = ref(false)

// Delete Data
const confirmDelete = (id) => {
    selectedId.value = id
    console.log(id)
    showConfirm.value = true
}

const handleDelete = async () => {
    try {
        await deleteUser(selectedId.value)
        await loadUsers() 
        showConfirm.value = false // Tutup modal setelah sukses hapus
        showDeleteAlert('User Berhasil dihapus')
    } catch (err) {
        console.error('Gagal menghapus user:', err)
    }
}

// Edit Data
const showEditForm = (id) => {
    resetUserData()
    const user = users.value.find((user) => user.id === id);
    console.log(user)
    if (user) {
        userData.value = {
            id: user.id,
            full_name: user.full_name || '',
            username: user.username || '',
            outlet_id: user.outlet_id || '',
            role_id: user.roles?.[0]?.id?.toString() || '1',
        };

        isEditModalOpen.value = true
        
        
    }
};

const closeModal = () => {
    resetUserData()
    isEditModalOpen.value = false
};

const saveEditUser = async() => {
  try {
    await updateUser(userData.value.id, userData.value)
    await loadUsers()
    console.log( userData.value)
    isEditModalOpen.value = false
    showSuccessAlert('User berhasil diupdate')
    resetUserData()
  } catch (err) {
    console.error('Gagal mengedit user:', err)
  }
}

const resetUserData = () => {
    userData.value = { 
      full_name: '',
      username: '',
      password: '',
      role_id: '',
      outlet_id: '',
    };
};

// alert handle
const isSuccessAlertVisible = ref(false); 
const isDeleteAlertVisible = ref(false); 

const alertMessage = ref('')

const showSuccessAlert = (message) => {
  isSuccessAlertVisible.value = true; // Tampilkan alert
  alertMessage.value = message
  setTimeout(() => {
    isSuccessAlertVisible.value = false; // Sembunyikan alert setelah 5 detik
  }, 5000); // 5000ms = 5 detik
};

const showDeleteAlert = (message) => {
  isDeleteAlertVisible.value = true;
  alertMessage.value = message
  setTimeout(() => {
    isDeleteAlertVisible.value = false; // Sembunyikan alert setelah 5 detik
  }, 5000); // 5000ms = 5 detik
};


const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        loadUsers()
    }



}

const pageNumbers = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
    
onMounted(async () => {
    await loadUsers()
    
    await getOutlets()
    roles.value = await getRoles()    
    console.log(roles.value)
    setTimeout(() => {
        window.HSStaticMethods.autoInit()
    }, 100)
})



</script>
<template>
    <div class="mt-6">
      <div class="card card-dark">
        <div class="p-4">
          <div class="flex-wrap items-center justify-between gap-4  md:flex">
            <div class="flex gap-2 items-center">
                <div class="bg-error-400 bg-opacity-10 p-1.5 rounded-md w-10">                
                    <svg class="fill-error-500" focusable="false" aria-hidden="true" viewBox="0 0 14 12">
                            <path
                                d="M6.9978 7.20039C8.25364 7.20039 9.25311 6.18189 9.25311 4.92539C9.25311 3.66889 8.23505 2.65039 6.9978 2.65039C5.74196 2.65039 4.74249 3.66889 4.74249 4.92539C4.7228 6.18102 5.74218 7.20039 6.9978 7.20039ZM8.09155 7.90039H5.90843C4.19124 7.90039 2.79999 9.20633 2.79999 10.8163C2.79999 11.1401 3.0778 11.4004 3.42124 11.4004H10.5787C10.9222 11.4004 11.2 11.1401 11.2 10.8163C11.2 9.20633 9.80874 7.90039 8.09155 7.90039Z">
                            </path>
                            <path class="opacity-40"
                                d="M2.8 3.5C3.76644 3.5 4.55 2.71644 4.55 1.75C4.55 0.783562 3.76687 0 2.8 0C1.83356 0 1.05 0.783562 1.05 1.75C1.05 2.71644 1.83356 3.5 2.8 3.5ZM11.2 3.5C12.1664 3.5 12.95 2.71644 12.95 1.75C12.95 0.783562 12.1669 0 11.2 0C10.2336 0 9.45 0.783562 9.45 1.75C9.45 2.71644 10.2331 3.5 11.2 3.5ZM12.0728 4.2H10.7201C10.4401 4.2 10.1758 4.26643 9.93563 4.38025C9.94875 4.49531 9.97062 4.60687 9.97062 4.725C9.97062 5.46241 9.69106 6.12959 9.24525 6.65H13.6137C13.8272 6.65 14 6.46625 14 6.24094C14 5.11437 13.1381 4.2 12.0728 4.2ZM4.05781 4.37719C3.81937 4.24594 3.55687 4.2 3.27906 4.2H1.92675C0.86275 4.2 0 5.11437 0 6.24094C0 6.46625 0.172528 6.65 0.385438 6.65H4.7495C4.30369 6.12959 4.02413 5.46241 4.02413 4.725C4.02281 4.60687 4.04469 4.49313 4.05781 4.37719Z">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-16 font-normal text-black dark:text-white">Users</p>
                    </div>
                </div>
            <div class="overflow-hidden tabs">
              
            </div>
            <div>
                <button class="flex justify-center w-full mt-4 btn bg-error-400 text-white btn-text-icon md:mt-0" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-form-backdrop-modal" data-hs-overlay="#hs-form-backdrop-modal">
                    <i class="text-xl leading-none ri-add-line"></i> Tambah User
                </button>                

                <div id="hs-form-backdrop-modal" class="hs-overlay hs-overlay-backdrop-open:bg-transparent dark:hs-overlay-backdrop-open:bg-transparent hs-overlay-backdrop-open:bg-modal dark:hs-overlay-backdrop-open:bg-modal hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none" role="dialog" tabindex="-1" aria-labelledby="hs-scale-animation-modal-label">
                    <div class="hs-overlay-animation-target hs-overlay-open:scale-100 hs-overlay-open:opacity-100 scale-95 opacity-0 ease-in-out transition-all duration-200 sm:max-w-[600px] sm:w-full m-3 sm:mx-auto min-h-[calc(100%-1.5rem)] flex items-center">
                        <div class="w-full flex flex-col bg-white shadow-dialog rounded-xl pointer-events-auto dark:bg-gray-800">
                            <h6 class="font-semibold text-xl text-gray-900 dark:text-gray-200 p-6 pb-4">
                                Tambah Data User
                            </h6>
                            
                            <div class="relative z-0 w-full my-5 group px-4">
                                <input type="text" v-model="userData.full_name"  name="name"  class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 ," placeholder="">
                                <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Nama User</label>
                            </div>                            
                            <div class="relative z-0 w-full my-5 group px-4">
                                <input type="text" v-model="userData.username"  name="username"  class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 ," placeholder="">                         
                                <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Username</label>
                            </div>
                            <div class="relative z-0 w-full my-5 group px-4">
                                <input type="password" v-model="userData.password"  name="password"  class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 ," placeholder="">                         
                                <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Password</label>
                            </div>
                            <div class="relative z-0 w-full my-5 group px-4">
                                <input type="password" v-model="confirPassoword" name="confirm_password"
                                    class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500"
                                    placeholder="">
                                <label for="confirm_password"
                                    class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm Password</label>
                            </div>

                            <div class="relative z-0 w-full my-5 group px-4">
                                <select v-model="userData.role_id" class="block w-full p-3 text-sm text-gray-900 border-gray-200 bg-transparent border rounded-lg appearance-none peer dark:text-white dark:border-gray-600 dark:focus:border-primary-600 focus:outline-none focus:ring-0 hover:border-black dark:hover:border-white focus:border-primary-600 dark:bg-gray-800">
                                    <option value="" disabled>Select Role</option>
                                    <option v-for="role in roles" :key="role.id" :value="role.id">
                                    {{ role.name }}
                                    </option>
                                </select>                                   
                                <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Role</label>
                            </div>
                            <div class="relative z-0 w-full my-5 group px-4">
                                <select v-model="userData.outlet_id" class="block w-full p-3 text-sm text-gray-900 border-gray-200 bg-transparent border rounded-lg appearance-none peer dark:text-white dark:border-gray-600 dark:focus:border-primary-600 focus:outline-none focus:ring-0 hover:border-black dark:hover:border-white focus:border-primary-600 dark:bg-gray-800">
                                    <option value="" disabled>Select Outlet</option>
                                    <option v-for="outlet in outlets" :key="outlet.id" :value="outlet.id">
                                    {{ outlet.name }}
                                    </option>
                                </select>                                   
                                <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Outlet</label>
                            </div>
                            <div class="flex justify-end items-center gap-x-6 p-6">
                                <button ripple-opacity="0.3" class="btn ripple btn-secondary text-gray-900 hover:bg-gray-200 focus:bg-gray-200 dark:text-white bg-gray-main dark:bg-gray-700" data-hs-overlay="#hs-form-backdrop-modal">Cancel</button>
                                <button ripple-opacity="0.3" class="btn btn-sm ripple bg-error-400 text-white" data-hs-overlay="#hs-form-backdrop-modal" @click="saveNewUser">Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        
          <div class="px-4">  
            <!-- Success Alert -->
            <div v-if="isSuccessAlertVisible" class="pt-4">
              <div class="alert alert-success" role="alert">
                  <div class="flex items-center gap-3">
                      <svg class="size-6" width="20" height="20" viewBox="0 0 16 16" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.3335 7.99992C1.3335 4.31802 4.31826 1.33325 8.00016 1.33325C9.76827 1.33325 11.464 2.03563 12.7142 3.28587C13.9644 4.53612 14.6668 6.23181 14.6668 7.99992C14.6668 11.6818 11.6821 14.6666 8.00016 14.6666C4.31826 14.6666 1.3335 11.6818 1.3335 7.99992ZM7.1535 10.2333L10.9002 6.48659C11.0229 6.35782 11.0229 6.15535 10.9002 6.02659L10.5468 5.67325C10.4172 5.5462 10.2098 5.5462 10.0802 5.67325L6.92016 8.83325L5.92016 7.83992C5.85967 7.77547 5.77522 7.73891 5.68683 7.73891C5.59844 7.73891 5.51399 7.77547 5.4535 7.83992L5.10016 8.19325C5.03706 8.25584 5.00156 8.34104 5.00156 8.42992C5.00156 8.5188 5.03706 8.604 5.10016 8.66659L6.68683 10.2333C6.74732 10.2977 6.83177 10.3343 6.92016 10.3343C7.00855 10.3343 7.09301 10.2977 7.1535 10.2333Z" fill="currentColor" />
                      </svg>
                      <div class="py-2">
                        <span> {{ alertMessage }}</span>
                      </div>
                  </div>                      
              </div>
            </div>
            <!-- Delete Alert -->
            <div v-if="isDeleteAlertVisible" class="pt-4">
              <div class="alert alert-error" role="alert">
                  <div class="flex items-center gap-3">
                      <svg class="size-6" width="20" height="20" viewBox="0 0 16 16" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM8 4.5C8.36367 4.5 8.65625 4.79258 8.65625 5.15625V8.21875C8.65625 8.58242 8.36367 8.875 8 8.875C7.63633 8.875 7.34375 8.58242 7.34375 8.21875V5.15625C7.34375 4.79258 7.63633 4.5 8 4.5ZM7.125 10.625C7.125 10.3929 7.21719 10.1704 7.38128 10.0063C7.54538 9.84219 7.76794 9.75 8 9.75C8.23206 9.75 8.45462 9.84219 8.61872 10.0063C8.78281 10.1704 8.875 10.3929 8.875 10.625C8.875 10.8571 8.78281 11.0796 8.61872 11.2437C8.45462 11.4078 8.23206 11.5 8 11.5C7.76794 11.5 7.54538 11.4078 7.38128 11.2437C7.21719 11.0796 7.125 10.8571 7.125 10.625Z" fill="currentColor" />
                      </svg>
                      <div class="py-2">
                        <span> {{ alertMessage }}</span>
                      </div>
                  </div>                      
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 py-6 md:gap-6">
                <div class="flex flex-grow gap-4">
                    
                    <div class="relative z-0 w-full mb-5 lg:mb-0 group">
                        <input type="text" name="name" 
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500"
                            placeholder=" " required />
                        <label for="name"
                            class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Search user
                        </label>
                    </div>
                    
                </div>
            </div>
              
              <div class="tab-content">
                
                  <div id="basic-tabs-11" role="tabpanel" aria-labelledby="basic-tabs-item-11">        
                      <div id="">                
                        <div class="shadow-table rounded-lg bg-white dark:bg-transparent">
                            <div class="responsive-table" data-simplebar>
                              <table class="table border-spacing-0">
                                  <thead>
                                    <tr>
                                        <th class="text-center">No</th>
                                        <th class="text-center">User</th>
                                        <th class="text-center">Username</th>
                                        <th class="text-center">Outlet</th>
                                        <th class="text-center">Role</th>
                                        <th class="text-center"></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr v-for="(user, index) in sortedUsers" :key="index">
                                        <td class="text-center">{{ index + 1 }}</td>                                          
                                        <td class="text-left text-gray-900 dark:text-gray-200 p-0 text-sm">{{ user.full_name }}</td>
                                        <td class="text-left text-gray-500 dark:text-gray-200 p-0 text-sm">{{ user.username }}</td>
                                        <td class="text-left text-gray-500 dark:text-gray-200 p-0 text-sm">{{ user.outletName }}</td>
                                        <td class="text-left text-gray-500 dark:text-gray-200 p-0 text-sm">{{ (user.roles['0'].name).toUpperCase() }}</td>
                                        <td class="text-center p-0">                                                                                    
                                        <div class="relative inline-flex hs-dropdown">
                                            <button id="hs-dropdown-with-dividers" type="button" class="hs-dropdown-toggle btn-dark-icon-hover size-10">
                                                <i class="text-gray-400 ri-more-2-fill"></i>
                                            </button>
                                            <div class="hs-dropdown-menu min-w-24 max-h-40 overflow-y-auto transition-[opacity,margin] duration opacity-0 hidden hs-dropdown-open:opacity-100"
                                                aria-labelledby="hs-dropdown-with-dividers">
                                                <div class="p-2">                                                          
                                                    <button class="dropdown-item" @click="showEditForm(user.id)">
                                                        <div class="flex gap-2">
                                                            <svg class="w-5 fill-gray-500 dark:fill-dark-15 MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" viewBox="0 0 24 24">
                                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                                            </svg>
                                                            <span>Edit</span>
                                                        </div>
                                                    </button>
                                                    <button class="dropdown-item" @click="confirmDelete(user.id)">
                                                        <div class="flex gap-2">
                                                            <svg class="w-5 fill-gray-500 dark:fill-dark-15 MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" viewBox="0 0 24 24">
                                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5-1-1h-5l-1 1H5v2h14V4z"></path>
                                                            </svg>
                                                            <span>Delete</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        </td>
                                      </tr>
                                  </tbody>
                              </table>
                              </div>
                          </div>
                          <div class="p-4 dark:bg-gray-800">
                              <div class="flex items-center gap-2 md:justify-end">
                                <nav class="justify-center pagination">
                                    <!-- Previous Button -->
                                    <button 
                                        type="button" 
                                        class="border !rounded-lg bottom-[1px] p-1" 
                                        :disabled="currentPage === 1" 
                                        @click="changePage(currentPage - 1)">
                                        <RiArrowLeftSLine class="w-5 text-xl ri-arrow-left-s-line text-primary-100" />
                                    </button>
                                    
                                    <!-- Page Buttons (Dynamically Generated) -->
                                    <button 
                                        v-for="page in pageNumbers" 
                                        :key="page" 
                                        type="button" 
                                        class="page-item !rounded-lg" 
                                        :class="{'bg-error-400 text-white border-error-500 hover:!bg-error-600': page === currentPage}"
                                        @click="changePage(page)">
                                        {{ page }}
                                    </button>
                                    
                                    <!-- Ellipsis for the middle page range -->
                                    <div v-if="totalPages > 5" class="page-item limit">
                                        …
                                    </div>
                                    
                                    <!-- Last Page Button -->
                                    <button 
                                        v-if="totalPages > 5" 
                                        type="button" 
                                        class="page-item !rounded-lg" 
                                        @click="changePage(totalPages)">
                                        {{ totalPages }}
                                    </button>
                                    
                                    <!-- Next Button -->
                                    <button 
                                        type="button" 
                                        class="border bottom-[1px] p-1 !rounded-lg" 
                                        :disabled="currentPage === totalPages" 
                                        @click="changePage(currentPage + 1)">
                                        <RiArrowRightSLine class="w-5 text-xl ri-arrow-right-s-line text-error-400" />
                                    </button>
                                </nav>
                                  
                              </div>
                          </div>
                      </div>
                  </div>                    
              </div>
          </div>        
        </div>
      </div>
    </div>


    <div v-if="showConfirm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" 
            role="dialog" tabindex="-1" aria-labelledby="hs-scale-animation-modal-label">
            <div class="hs-overlay-animation-target scale-100 opacity-100 ease-in-out transition-all duration-200 
                        sm:max-w-[600px] sm:w-full m-3 sm:mx-auto min-h-[calc(100%-1.5rem)] flex items-center">
                <div class="w-full flex flex-col bg-white shadow-dialog rounded-xl dark:bg-gray-800">
                    <h6 class="font-semibold text-xl text-gray-900 dark:text-gray-200 p-6 pb-4">
                        Konfirmasi Hapus
                    </h6>
                    <p class="leading-normal text-gray-500 dark:text-gray-400 px-6 text-16">
                        Apakah Anda yakin ingin menghapus user ini?
                    </p>
                    <div class="flex justify-end items-center gap-x-6 p-6">
                        <button class="btn btn-sm ripple btn-secondary" @click="showConfirm = false">Cancel</button>
                        <button class="btn btn-sm ripple btn-error" @click="handleDelete">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-if="isEditModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="hs-overlay size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto" 
          role="dialog" tabindex="-1" aria-labelledby="hs-scale-animation-modal-label">
          <div class="hs-overlay-animation-target scale-100 opacity-100 ease-in-out transition-all duration-200 
                  sm:max-w-[600px] sm:w-full m-3 sm:mx-auto min-h-[calc(100%-1.5rem)] flex items-center">
          <div class="w-full flex flex-col bg-white shadow-dialog rounded-xl dark:bg-gray-800">
              <h6 class="font-semibold text-xl text-gray-900 dark:text-gray-200 p-6 pb-4">
                  Edit User
              </h6>
              <div class="relative z-0 w-full my-5 group px-4">
                    <input v-model="userData.full_name" type="text" name="name"  class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500" placeholder="" >
                    <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Nama User</label>
                </div>
                <div class="relative z-0 w-full my-5 group px-4">
                    <input type="text" v-model="userData.username" disabled name="name"  class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-primary-500 focus:outline-none focus:ring-0 focus:border-primary-500 ," placeholder="">                         
                    <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Username</label>
                </div>
                <div class="relative z-0 w-full my-5 group px-4">
                    <select v-model="userData.role_id" class="block w-full p-3 text-sm text-gray-900 border-gray-200 bg-transparent border rounded-lg appearance-none peer dark:text-white dark:border-gray-600 dark:focus:border-primary-600 focus:outline-none focus:ring-0 hover:border-black dark:hover:border-white focus:border-primary-600 dark:bg-gray-800">
                        <option value="" disabled>Select Role</option>
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                        {{ role.name }}
                        </option>
                    </select>                                   
                    <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Role</label>
                </div>
                <div class="relative z-0 w-full my-5 group px-4">
                    <select v-model="userData.outlet_id" class="block w-full p-3 text-sm text-gray-900 border-gray-200 bg-transparent border rounded-lg appearance-none peer dark:text-white dark:border-gray-600 dark:focus:border-primary-600 focus:outline-none focus:ring-0 hover:border-black dark:hover:border-white focus:border-primary-600 dark:bg-gray-800">
                        <option value="" disabled>Select Outlet</option>
                        <option v-for="outlet in outlets" :key="outlet.id" :value="outlet.id">
                        {{ outlet.name }}
                        </option>
                    </select>                                   
                    <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Outlet</label>
                </div>
              <div class="flex justify-end items-center gap-x-6 p-6">
                  <button class="btn btn-sm ripple btn-secondary" @click="closeModal">Cancel</button>
                  <button type="button" class="btn btn-sm ripple bg-error-400 text-white" @click="saveEditUser" :disabled="isLoading">
                      <span v-if="isLoading">...</span>
                      <span v-else>Update</span>
                  </button>
                  
              </div>
          </div>
      </div>
    </div>
</div>


</template>

<style scoped>
  .active {
      border-bottom: 2px solid #6950E8 !important;
      color: #6950E8 !important;
      font-weight: 600 !important;
}
</style>