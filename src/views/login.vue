<template>
    <div class="container">
        <div class="title">
            <div class="back-home">
                <el-icon><ArrowLeft /></el-icon>
                <span @click="gotoHome">返回首页</span>
            </div>
            <div class="title-text">
                <h2>登录</h2>
                <p>登录您的账号</p>
            </div>
        </div>
        <div class="form-container">
            <el-form :model="formData" :rules="rules" ref="ruleFormRef" label-position="top">
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" size="large" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" size="large" placeholder="请输入密码" type="password" show-password></el-input>
                </el-form-item>
                <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
            </el-form>
            <div class="footer">
                <p>还没有账号?<el-link type="primary" @click="handleRegister">去注册</el-link></p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { login } from '@/api/admin'
import { ref, reactive } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'

const router = useRouter()
const gotoHome = () => {
  router.push('/')
}

const formData = reactive({
    username: '',
    password: ''
})

const rules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

const ruleFormRef = ref()

const submitForm = async (formEl) => {
    if (!formEl) return
    
    await formEl.validate((valid) => {
        if (valid) {
            login(formData).then(res => {
                const data = res.data || res
                const token = data.token
                const userInfo = data.userInfo
                
                if (!token) {
                    console.error('登录失败：没有获取到token', res)
                    return
                }
                localStorage.setItem('token', token)
                localStorage.setItem('userInfo', JSON.stringify(userInfo))
                
                const userType = userInfo.userType
                console.log('userType:', userType, 'typeof:', typeof userType)
                
                if (userType == 2 || userType === '2') {
                    router.push('/back/dashboard')
                } else if (userType == 1 || userType === '1') {
                    router.push('/back/dashboard')
                } else {
                    router.push('/back/dashboard')
                }
            })
        } 
    })
}
</script>



<style scoped lang="scss">
.container {
    width: 384px;
    .title {
        .back-home {
            margin-bottom: 60px;
        }
        .title-text {
            text-align: center;
            h2 {
                font-size: 30px;
                margin-bottom: 10px;
            }
            p {
                font-size: 20px;
                color: #000000;
            }
        }
    }
    .form-container {
        margin-top: 30px;
        width: 100%;
    }
    .btn {
        width: 100%;
        margin-top: 20px;
    }
}

</style>
