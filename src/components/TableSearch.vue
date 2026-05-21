<template>
    <el-form :model="formData">
        <el-row :gutter="24">
            <template v-for="item in formItemAttr" :key="item.prop">
                <el-col v-bind="item.col">
                    <el-form-item :label="item.label" :prop="item.prop">
                <el-input v-if="item.comp === 'input'" v-model="formData[item.prop]" :placeholder="item.placeholder" />
                <!-- <el-select v-else-if="item.comp === 'select'" v-model="formData[item.prop]" :placeholder="item.placeholder">
                    <el-option label="全部" value="" />
                    <el-option v-for="opt in item.options" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select> -->
                </el-form-item>
                </el-col>
                
            </template>
        </el-row>
     <el-row>
            <el-button type="primary" @click="handleSearch(formData)">查询</el-button>
            <el-button  @click="handleReset">重置</el-button>
    </el-row>
   </el-form>
</template>
    
<script setup>
import { ref, reactive,computed } from 'vue'

const formData = reactive({})

const props = defineProps({
    formItem: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['search'])

const formItemAttr = computed(() => {
    const {formItem} = props
    formItem.forEach(item => {
        item.col = {xs:24,sm:12,md:8,lg:6,xl:6}
    })
    return formItem
})



const isComp = (comp) => {
    return {
        input: 'el-input',
        select: 'el-select',
    }[comp]
}

const handleSearch = (formData) => {
    // console.log(formData)
    emit('search', formData)
    
}

const handleReset = () => {
    Object.keys(formData).forEach(key => {
        formData[key] = ''
    })
    emit('search', formData)
}
</script>
