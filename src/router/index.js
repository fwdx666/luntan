import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginIn.vue') },
    {
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/42397',
      children: [
        //考研交流
        {
          path: '/42458',
          component: () => import('@/views/graduate/GraduateRegion.vue')
        },
        //找工作交流
        {
          path: '/42602',
          component: () => import('@/views/job/JobRegion.vue')
        },
        //日常学习问题
        {
          path: '/study',
          component: () => import('@/views/study/StudyRegion.vue')
        },
        //日常唠嗑
        {
          path: '/42397',
          component: () => import('@/views/daychat/ChatRegion.vue')
        },
        //个人中心
        {
          path: '/profile',
          component: () => import('@/views/profile/ProfileRegion.vue'),
          redirect: '/profile/myArticle',
          children: [
            //我的文章
            {
              path: '/profile/myArticle',
              component: () => import('@/views/profile/MyarticleRegion.vue')
            },
            //基本资料
            {
              path: '/profile/basicInfo',
              component: () => import('@/views/profile/BasicInfoRegion.vue')
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach(to => {
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') {
    return '/login'
  }
})
export default router
