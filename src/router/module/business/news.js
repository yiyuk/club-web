import Main from '@/components/main';
// 新闻
export const news = [
  {
    path: '/news',
    name: 'News',
    component: Main,
    meta: {
      title: '新闻',
      icon: 'icon iconfont iconxitongjiankong'
    },
    children: [
      {
        path: '/news/news-show',
        name: 'NewsShow',
        meta: {
          title: '新闻展示',
          privilege: [
            { title: '查询', name: 'news-show-query' },
            { title: '详情', name: 'news-show-detail' }
          ]
        },
        component: () => import('@/views/business/news/news-show.vue')
      },
      {
        path: '/news/news-list',
        name: 'NewsList',
        meta: {
          title: '新闻管理',
          privilege: [
            { title: '查询', name: 'news-list-query' },
            { title: '添加', name: 'news-list-add' },
            { title: '修改', name: 'news-list-edit' },
            { title: '删除', name: 'news-list-delete' },
            { title: '详情', name: 'news-list-detail' }
          ]
        },
        component: () => import('@/views/business/news/news-list.vue')
      },
      {
        path: '/news/news-detail',
        name: 'NewsDetail',
        meta: {
          title: '新闻详情',
          hideInMenu:true
        },
        component: () => import('@/views/business/news/news-detail.vue')
      },
      {
        path: '/news/news-edit',
        name: 'NewsEdit',
        meta: {
          title: '编辑新闻',
          privilege: [{ title: '编辑新闻', name: 'news-edit' }],
          hideInMenu:true
        },
        component: () => import('@/views/business/news/news-edit.vue')
      }
    ]
  }
];
