import Main from '@/components/main';
// 消息管理
export const message = [
  {
    path: '/message',
    name: 'Message',
    component: Main,
    meta: {
      title: '消息',
      icon: 'icon iconfont iconyoujianguanli'
    },
    children: [
      // {
      //   path: '/message/message-list',
      //   name: 'MessageList',
      //   meta: {
      //     title: '消息管理',
      //     privilege: [
      //       { title: '查询', name: 'message-list-query' },
      //       { title: '添加', name: 'message-list-add' },
      //       { title: '修改', name: 'message-list-edit' },
      //       { title: '删除', name: 'message-list-delete' },
      //       { title: '详情', name: 'message-list-detail' },
      //       { title: '发送', name: 'message-list-send' }
      //     ]
      //   },
      //   component: () => import('@/views/business/message/message-list.vue')
      // },
      {
        path: '/message/user-message',
        name: 'UserMessage',
        meta: {
          title: '个人消息',
          privilege: [
            { title: '查询', name: 'user-message-query' },
            { title: '详情', name: 'user-message-detail' },
          ]
        },
        component: () => import('@/views/business/message/user-message.vue')
      },
    ]
  }
];
