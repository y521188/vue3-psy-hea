import service from '@/utlis/request'

export function login(data) {
    return service.post('/user/login', data)
}

export function categoryTree() {
    return service.get('/knowledge/category/tree')
}

export function articlePage(data) {
    return service.get('/knowledge/article/page', { params: data })
}

export function uploadFile(file, businessInfo) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField', 'cover')

    return service.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export function createArticle(data) {
    return service.post('/knowledge/article', data)
}

export function articleDetail(id) {
    return service.get(`/knowledge/article/${id}`)
}

export function updateArticle(data) {
    return service.put(`/knowledge/article/${data.id}`, data)
}

// 删除文章
export function deleteArticle(id) {
    return service.delete(`/knowledge/article/${id}`)
}

// 导出一个获取咨询记录分页数据的接口函数
export function getConsultationPage(params) {
    // 发送GET请求，请求地址为 /psychological-chat/sessions，参数为params
    return service.get('/psychological-chat/sessions', { params })
}

export function getSessionDetail(sessionId) {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionalPage(params) {
    return service.get('/emotion-diary/admin/page', { params })
}

export function deleteEmotional(id) {
    return service.delete(`/emotion-diary/admin/${id}`)
}

export function getAnalyticsOverview() {
    return service.get(`/data-analytics/overview`)
}

export function logout() {
    return service.post('/user/logout')
}


