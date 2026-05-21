import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AthyLayout from '@/components/AythLayout.vue'
import HomePage from '@/views/HomePage.vue'



const backendRoutes = [
    {
        path: '/',
        component: HomePage,
        meta: {
            title: '首页',
            icon: 'HomeFilled'
        }
    },
    {
        path: '/back',
        redirect: '/back/dashboard',
        component: BackendLayout,
        children: [
            {
                path: 'dashboard',
                component: () => import('@/views/dashboard.vue'),
                meta: {
                    title: '数据分析',
                    icon: 'PieChart'
                }
            },
            {
                path: 'knowledge',
                component: () => import('@/views/knowledge.vue'),
                meta: {
                    title: '知识文章',
                    icon: 'Document'
                }
            },
            {
                path: 'consulations',
                component: () => import('@/views/consulations.vue'),
                meta: {
                    title: '咨询记录',
                    icon: 'Message'
                }
            },
            {
                path: 'emotional',
                component: () => import('@/views/emotional.vue'),
                meta: {
                    title: '情感分析',
                    icon: 'UserFilled'
                }
            }
        ]
    },
    {
        path: '/auth',
        component: AthyLayout,
        children: [
            {
                path: 'login',
                component: () => import('@/views/login.vue'),
                meta: {
                    title: '登录',
                }
            },
            {
                path: 'register',
                component: () => import('@/views/register.vue'),
                meta: {
                    title: '注册',
                }
            }
        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes: backendRoutes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token') // 确保 token 是从 localStorage 取的
    if (token) {
        // 1. 先获取并解析 userInfo，处理 null 和字符串问题
        const userInfoStr = localStorage.getItem('userInfo')
        if (!userInfoStr) {
            // 有 token 但无用户信息，直接跳登录
            next('/auth/login')
            return
        }

        let userInfo
        try {
            // 把字符串解析成对象
            userInfo = JSON.parse(userInfoStr)
        } catch (e) {
            // 解析失败（格式错误），清除无效数据，跳登录
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            next('/auth/login')
            return
        }

        const userType = parseInt(userInfo.userType) || parseInt(userInfo.userTope)
        if (userType === 2) {
            next()
        } else {
            next('/auth/login')
        }
    } else {
        // 无 token：未登录
        if (to.path.startsWith('/back')) {
            // 访问后台，跳登录
            next('/auth/login')
        } else {
            // 访问前台，直接放行
            next()
        }
    }
})


export default router
