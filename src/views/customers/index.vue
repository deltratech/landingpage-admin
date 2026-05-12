<script setup>
import { onMounted, ref, computed } from 'vue'
import { useCustomers } from '@/composables/useCustomers'
import { useOutlets } from '@/composables/useOutlets'
const { customers, updateCustomer, getCustomers, createCustomer, deleteCustomer, currentPage, totalPages } = useCustomers()
const { outlets, getOutlets } = useOutlets()
import { format } from 'date-fns'
import { RiArrowLeftSLine, RiArrowRightSLine, RiSkipLeftLine, RiSkipRightLine } from 'vue-remix-icons';



const formatDate = (dateStr) => format(new Date(dateStr), 'MM/dd/yyyy')

const isEditModalOpen = ref(false)


const customerData = ref({
    name: '',
    outletId: ''
})

const sortedCustomers = computed(() => {
    return [...customers.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})



// Simpan perubahan
const saveNewCustomer = async () => {
    try {
        await createCustomer(customerData.value)
        await getCustomers() 
        resetCustomerData()
        setTimeout(() => {
            window.HSStaticMethods.autoInit()
        }, 100)
    } catch (err) {
        console.error('Failed to add customer:', err)
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
        await deleteCustomer(selectedId.value)
        await getCustomers() 
        showConfirm.value = false // Tutup modal setelah sukses hapus
        showDeleteAlert('Customer Berhasil dihapus')
    } catch (err) {
        console.error('Gagal menghapus customer:', err)
    }
}

// Edit Data
const showEditForm = (id) => {
    resetCustomerData()
    const customer = customers.value.find((customer) => customer.id === id)
    if (customer) {
        customerData.value = { ...customer }
        isEditModalOpen.value = true
    }
}

const closeModal = () => {
    resetCustomerData()
    isEditModalOpen.value = false
}

const saveEditCustomer = async() => {
  try {
    await updateCustomer(customerData.value.id, customerData.value)
    await getCustomers()
    isEditModalOpen.value = false
    showSuccessAlert('Customer berhasil diupdate')
    resetCustomerData()
  } catch (err) {
    console.error('Gagal mengedit customer:', err)
  }
}

const resetCustomerData = () => {
    customerData.value = { 
        name: '', 
        outletId: '' 
    }
}

// alert handle
const isSuccessAlertVisible = ref(false) 
const isDeleteAlertVisible = ref(false) 

const alertMessage = ref('')

const showSuccessAlert = (message) => {
  isSuccessAlertVisible.value = true // Tampilkan alert
  alertMessage.value = message
  setTimeout(() => {
    isSuccessAlertVisible.value = false // Sembunyikan alert setelah 5 detik
  }, 5000) // 5000ms = 5 detik
}

const showDeleteAlert = (message) => {
  isDeleteAlertVisible.value = true
  alertMessage.value = message
  setTimeout(() => {
    isDeleteAlertVisible.value = false // Sembunyikan alert setelah 5 detik
  }, 5000) // 5000ms = 5 detik
}




const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        getCustomers()
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
    await getCustomers()
    setTimeout(() => {
        window.HSStaticMethods.autoInit()
    }, 100)
})



</script>
<template>
    <div class="mt-6">
      <div class="card card-dark">
        <div class="p-4">
          <div class="flex-wrap items-center justify-between gap-4 md:flex">
            <div class="flex gap-2 items-center">
                <div class="bg-error-400 bg-opacity-10 p-1.5 rounded-md w-10">                                        
                    <svg class="fill-error-500"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.841 15.659L18.017 15.836L18.1945 15.659C19.0732 14.7803 20.4978 14.7803 21.3765 15.659C22.2552 16.5377 22.2552 17.9623 21.3765 18.841L18.0178 22.1997L14.659 18.841C13.7803 17.9623 13.7803 16.5377 14.659 15.659C15.5377 14.7803 16.9623 14.7803 17.841 15.659ZM12 14V22H4C4 17.6651 7.44784 14.1355 11.7508 14.0038L12 14ZM12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1Z"></path></svg>
                </div>
                <div>
                    <p class="text-16 font-normal text-black dark:text-white">Customers</p>
                </div>
            </div>
            <div class="overflow-hidden tabs">
              
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
                            class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-brand-primary focus:outline-none focus:ring-0 focus:border-brand-primary"
                            placeholder=" " required />
                        <label for="name"
                            class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-400 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Search customer
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
                                          <th class="text-center">Customer</th>
                                          <th class="text-center">Email</th>                                          
                                          <th class="text-center">Telp</th>
                                          <th class="text-center">Outlet</th>
                                          <th class="text-center"></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr v-for="(customer, index) in sortedCustomers" :key="index">
                                          <td class="text-center">{{ index + 1 }}</td>
                                          <td class="text-center font-medium text-gray-900 border-transparent hover:border-black dark:text-gray-200 p-0">{{ customer.name }}</td>
                                          <td class="text-left text-gray-500 dark:text-gray-200 p-0 text-sm">{{ customer.email }}</td>
                                          <td class="text-left text-gray-500 dark:text-gray-200 p-0 text-sm">{{ customer.phone }}</td>
                                          <td class="text-left text-gray-500 dark:text-gray-200 p-0 text-sm">{{ customer.outletId }}</td>
                                          
                                          <td class="text-center p-0">
                                            <div class="relative inline-flex hs-dropdown">
                                                <button id="hs-dropdown-with-dividers" type="button" class="hs-dropdown-toggle btn-dark-icon-hover size-10">
                                                    <i class="text-gray-400 ri-more-2-fill"></i>
                                                </button>
                                                <div class="hs-dropdown-menu min-w-24 max-h-40 overflow-y-auto transition-[opacity,margin] duration opacity-0 hidden hs-dropdown-open:opacity-100"
                                                    aria-labelledby="hs-dropdown-with-dividers">
                                                    <div class="p-2">                                                          
                                                        <button class="dropdown-item" @click="showEditForm(customer.id)">
                                                            <div class="flex gap-2">
                                                                <svg class="w-5 fill-gray-500 dark:fill-dark-15 MuiSvgIcon-root MuiSvgIcon-fontSizeSmall" viewBox="0 0 24 24">
                                                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                                                </svg>
                                                                <span>Edit</span>
                                                            </div>
                                                        </button>
                                                        <button class="dropdown-item" @click="confirmDelete(customer.id)">
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
                        Apakah Anda yakin ingin menghapus customer ini?
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
                  Edit Customer
              </h6>
              <div class="relative z-0 w-full my-5 group px-4">
                    <input v-model="customerData.name" type="text" name="name"  class="block w-full p-3 text-sm text-gray-900 bg-transparent border border-gray-200 rounded-lg appearance-none peer hover:border-black dark:hover:border-white dark:text-white dark:border-gray-600 dark:focus:border-brand-primary focus:outline-none focus:ring-0 focus:border-brand-primary" placeholder="" >
                    <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Nama Customer</label>
                </div>
              <div class="relative z-0 w-full my-5 group px-4">
                
                <select v-model="customerData.outletId" class="block w-full p-3 text-sm text-gray-900 border-gray-200 bg-transparent border rounded-lg appearance-none peer dark:text-white dark:border-gray-600 dark:focus:border-primary-600 focus:outline-none focus:ring-0 hover:border-black dark:hover:border-white focus:border-primary-600 dark:bg-gray-800">
                    <option value="" disabled>Select Outlet</option>
                    <option v-for="outlet in outlets" :key="outlet.id" :value="outlet.id">
                    {{ outlet.name }}
                    </option>
                </select>    
                <label for="name" class="absolute text-sm px-1 ltr:ml-2 rtl:mr-2 text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 bg-white dark:bg-gray-800 z-10 origin-[0] peer-focus:font-medium peer-focus:text-primary-500 peer-focus:dark:text-primary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ,">Outlet</label>              
              </div>
              <div class="flex justify-end items-center gap-x-6 p-6">
                  <button class="btn btn-sm ripple btn-secondary" @click="closeModal">Cancel</button>
                  <button class="btn btn-sm ripple bg-error-400 text-white" @click="saveEditCustomer">Update</button>
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