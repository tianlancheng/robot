/**
 * 我们为了统一方便的管理路由和页面的关系，将配置信息统一抽离到 common/nav.js 下，同时应用动态路由
 */

import dynamic from 'dva/dynamic';

// dynamic包装 函数
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  component,
});

// nav data
export const getNavData = app => [
  {
    component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    layout: 'BasicLayout',
    name: '首页',
    path: '/',
    children: [
      {
        name: 'Dashboard',
        icon: 'dashboard',
        path: 'dashboard',
        children: [
          {
            name: '分割监控',
            path: 'analysis',
            component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Analysis')),
          },
          {
            name: '主机管理',
            path: 'monitor',
            component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Monitor')),
          },
          {
            name: '容器',
            path: 'container',
            component: dynamicWrapper(app, [], () => import('../routes/Dashboard/Container')),
            hidden: true,
          },
        ],
      },
      {
        name: '日志分析',
        path: 'form',
        icon: 'form',
        children: [
          {
            name: '索引列表',
            path: 'index-form',
            component: dynamicWrapper(app, [], () => import('../routes/Forms/IndiceForm')),
          },
          {
            name: '日志列表',
            path: 'log',
            component: dynamicWrapper(app, [], () => import('../routes/Forms/Log')),
          },
        ],
      },
    ],
  },
  {
    component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    path: '/user',
    layout: 'UserLayout',
    children: [
      {
        name: '账户',
        icon: 'user',
        path: 'user',
        children: [
          {
            name: '登录',
            path: 'login',
            component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
          },
        ],
      },
    ],
  },
];
