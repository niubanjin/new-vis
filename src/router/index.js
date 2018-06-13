import Vue from 'vue'
import Router from 'vue-router'

// import Index from '../analysis/Index'
// import Connect from '../analysis/Connect'
import Niubanjin from '../analysis/niubanjin'
import Email from '../analysis/email'


Vue.use(Router);

export default new Router({
  routes: [
    // //旧版本的路由
    // {
    //   path: '/',
    //   name: 'Index',
    //   component: Index
    // },
    // //新版本的路由
    // {
    //   path: '/connect',
    //   name: 'Connect',
    //   component: Connect
    // },
    //新版本的路由
    {
      path: '/',
      name: 'Niubanjin',
      component: Niubanjin
    },{
      path: '/email',
      name: 'Email',
      component: Email
    },
  ]
})
