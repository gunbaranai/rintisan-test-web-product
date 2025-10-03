<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  NH1,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  NCard,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NP,
  NTag,
  NSwitch,
  useMessage
} from 'naive-ui'
import { useProductStore } from '@/stores/product'

const router = useRouter()
const message = useMessage()
const productStore = useProductStore()
const formRef = ref()

// Form data
const form = reactive({
  name: '',
  description: '',
  category: null,
  price: null,
  sku: '',
  unit: null,
  image: null,
  addOns: []
})

const selectedAddOn = ref(null)
const submitting = ref(false)

// Options - you can move these to stores/constants
const categoryOptions = [
  { label: 'Makanan', value: 'food' },
  { label: 'Minuman', value: 'beverage' },
  { label: 'Elektronik', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' }
]

const unitOptions = [
  { label: 'kg', value: 'kg' },
  { label: 'pcs', value: 'pcs' },
  { label: 'unit', value: 'unit' },
  { label: 'pack', value: 'pack' },
  { label: 'box', value: 'box' }
]

const addOnOptions = [
  { label: 'Topping', value: 'topping', optionCount: 4 },
  { label: 'Packaging', value: 'packaging', optionCount: 2 },
  { label: 'Saus', value: 'sauce', optionCount: 3 },
  { label: 'Minuman', value: 'drink', optionCount: 5 },
  { label: 'Dessert', value: 'dessert', optionCount: 2 }
]

// Computed
const availableAddOns = computed(() => {
  const usedAddOns = form.addOns.map(a => a.value)
  return addOnOptions.filter(option => !usedAddOns.includes(option.value))
})

// Validation rules
const rules = {
  name: {
    required: true,
    message: 'Nama barang harus diisi',
    trigger: ['blur', 'input']
  },
  category: {
    required: true,
    message: 'Kategori harus dipilih',
    trigger: ['blur', 'change']
  },
  price: {
    type: 'number',
    required: true,
    min: 1,
    message: 'Harga harus diisi dan lebih dari 0',
    trigger: ['blur', 'change']
  },
  sku: {
    required: true,
    message: 'Kode barang (SKU) harus diisi',
    trigger: ['blur', 'input']
  },
  unit: {
    required: true,
    message: 'Unit barang harus dipilih',
    trigger: ['blur', 'change']
  }
}

// Methods
const beforeUpload = (data) => {
  const file = data.file
  const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
  const isUnder2MB = file.size / 1024 / 1024 < 2

  if (!isImage) {
    message.error('Format file harus JPG atau PNG')
    return false
  }

  if (!isUnder2MB) {
    message.error('Ukuran file maksimal 2MB')
    return false
  }

  form.image = file
  return true
}

const addAddOn = () => {
  if (!selectedAddOn.value) return

  const addOn = addOnOptions.find(opt => opt.value === selectedAddOn.value)
  if (addOn) {
    form.addOns.push({
      id: Date.now(),
      name: addOn.label,
      value: addOn.value,
      optionCount: addOn.optionCount,
      isActive: true
    })
    selectedAddOn.value = null
  }
}

const removeAddOn = (index) => {
  form.addOns.splice(index, 1)
}

const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    await formRef.value?.validate()

    submitting.value = true

    // Prepare data for API
    const productData = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: form.price,
      sku: form.sku,
      unit: form.unit,
      image: form.image,
      addOns: form.addOns.map(addOn => ({
        category: addOn.value,
        name: addOn.name,
        isActive: addOn.isActive,
        optionCount: addOn.optionCount,
        flag: 'A' // Add flag for new add-ons
      }))
    }

    // Call your API here
    await productStore.createProduct(productData)

    message.success('Produk berhasil ditambahkan')
    router.push('/products')

  } catch (errors) {
    console.log('Validation errors:', errors)
    message.error('Harap isi semua field yang wajib')
  } finally {
    submitting.value = false
  }
}
</script>

<style>
.n-upload-trigger.n-upload-trigger--image-card {
  height: auto;
}
</style>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <n-h1>Tambah Barang Baru</n-h1>

    <n-form ref="formRef" :model="form" :rules="rules" class="space-y-8">
      <!-- Info Barang Section -->
      <n-card title="Info barang" class="shadow-sm">
        <div class="space-y-4">
          <n-form-item label="Nama Barang *" path="name">
            <n-input v-model:value="form.name" placeholder="Contoh: Ayam Goreng" clearable />
          </n-form-item>

          <n-form-item label="Deskripsi Barang (optional)" path="description">
            <n-input v-model:value="form.description" type="textarea" placeholder="Masukkan deskripsi produk"
              :rows="3" />
          </n-form-item>
        </div>
      </n-card>

      <!-- Organisasi Barang Section -->
      <n-card title="Organisasi Barang" class="shadow-sm">
        <div class="space-y-4">
          <n-form-item label="Kategori Barang *" path="category">
            <n-select v-model:value="form.category" placeholder="Contoh: Makanan, Handphone" :options="categoryOptions"
              clearable />
          </n-form-item>

          <n-form-item label="Foto Barang" path="image">
            <n-upload action="/api/upload" :max="5" list-type="image-card" @before-upload="beforeUpload"
              trigger-class="min-w-max">
              <n-upload-dragger>
                <div class="flex flex-col items-center min-w-max p-4 text-center">
                  <n-icon size="48" :depth="3" class="mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512">
                      <path
                        d="M320 367.79h76c55 0 100-29.21 100-83.6s-53-81.47-96-83.6c-8.89-85.06-71-136.8-144-136.8c-69 0-113.44 45.79-128 91.2c-60 5.7-112 43.88-112 106.4s54 106.4 120 106.4h56"
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="32"></path>
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="32" d="M320 255.79l-64-64l-64 64"></path>
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="32" d="M256 448.21V207.79"></path>
                    </svg>
                  </n-icon>
                  <n-text style="font-size: 16px">
                    Klik atau tarik file ke sini untuk upload
                  </n-text>
                  <n-p depth="3" style="margin: 8px 0 0 0">
                    Format: png, jpg up to 2MB
                  </n-p>
                </div>
              </n-upload-dragger>
            </n-upload>
          </n-form-item>
        </div>
      </n-card>

      <!-- Harga Section -->
      <n-card title="Harga" class="shadow-sm">
        <n-form-item label="Harga *" path="price">
          <n-input-number v-model:value="form.price" placeholder="0" :min="0" class="w-full">
            <template #prefix>
              Rp
            </template>
          </n-input-number>
        </n-form-item>
      </n-card>

      <!-- Detail Barang Section -->
      <n-card title="Detail Barang" class="shadow-sm">
        <div class="space-y-4">
          <n-form-item label="Kode Barang (SKU) *" path="sku">
            <n-input v-model:value="form.sku" placeholder="Contoh: AG001" clearable />
          </n-form-item>

          <n-form-item label="Unit Barang *" path="unit">
            <n-select v-model:value="form.unit" placeholder="Contoh: kg, pcs, unit" :options="unitOptions" clearable />
          </n-form-item>
        </div>
      </n-card>

      <!-- Add On Section -->
      <n-card title="Add On" class="shadow-sm">
        <div class="space-y-4">
          <!-- Add On Selector -->
          <div class="flex items-center gap-3">
            <n-form-item label="Pilih Add On" class="flex-1">
              <n-select v-model:value="selectedAddOn" placeholder="-- Pilih Add On --" :options="availableAddOns"
                :disabled="form.addOns.length >= 5" clearable />
            </n-form-item>

            <n-button type="primary" @click="addAddOn" :disabled="!selectedAddOn || form.addOns.length >= 5">
              + Tambah
            </n-button>
          </div>

          <!-- Add On List -->
          <div v-if="form.addOns.length > 0" class="space-y-3">
            <n-card v-for="(addOn, index) in form.addOns" :key="addOn.id" size="small" class="bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <span class="font-medium">{{ addOn.name }}</span>
                  <n-tag type="info" size="small">
                    {{ addOn.optionCount }} Pilihan
                  </n-tag>
                  <n-switch v-model:value="addOn.isActive" size="small">
                    <template #checked>
                      Aktif
                    </template>
                    <template #unchecked>
                      Nonaktif
                    </template>
                  </n-switch>
                </div>

                <n-button type="error" tertiary size="small" @click="removeAddOn(index)">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512">
                        <path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
                          fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="32"></path>
                        <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"
                          d="M80 112h352" fill="currentColor"></path>
                        <path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40" fill="none"
                          stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="32" d="M256 176v224"></path>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="32" d="M184 176l8 224"></path>
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="32" d="M328 176l-8 224"></path>
                      </svg>
                    </n-icon>
                  </template>
                </n-button>
              </div>
            </n-card>
          </div>

          <!-- Limit Indicator -->
          <div class="flex justify-between items-center pt-2 border-t">
            <span class="text-sm text-gray-500">
              Limit Penambahan Add On ({{ form.addOns.length }}/5)
            </span>
            <n-button v-if="form.addOns.length >= 5" size="small" disabled>
              Maksimal 5 Add On
            </n-button>
          </div>
        </div>
      </n-card>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 pt-6">
        <div>
          <n-button @click="$router.back()">
            Batal
          </n-button>
        </div>
        <div>
          <n-button type="primary" :loading="submitting" @click="handleSubmit">
            Tambah
          </n-button>
        </div>
      </div>
    </n-form>
  </div>
</template>
