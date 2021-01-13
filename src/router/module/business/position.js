import Main from '@/components/main';
// 社团
export const position = [
  {
    path: '/position',
    name: 'Position',
    component: Main,
    meta: {
      title: '社团',
      icon: 'icon iconfont iconshouye'
    },
    children: [
      {
        path: '/position/position-show',
        name: 'PositionShow',
        meta: {
          title: '社团展示',
          privilege: [
            { title: '查询', name: 'position-show-query' },
            { title: '详情', name: 'position-show-detail' },
            { title: '申请', name: 'position-show-apply'},
          ]
        },
        component: () => import('@/views/business/position/position-show.vue')
      },
      {
        path: '/position/user-position',
        name: 'UserPosition',
        meta: {
          title: '我的社团',
          privilege: [
            { title: '查询', name: 'user-position-query' },
            { title: '详情', name: 'user-position-detail' },
            { title: '退团', name: 'user-position-update' },
          ]
        },
        component: () => import('@/views/business/position/user-position.vue')
      },
      {
        path: '/position/manage/position-approve',
        name: 'ManagePositionApprove',
        meta: {
          title: '社团审核',
          privilege: [
            { title: '查询', name: 'position-approve-query' },
            { title: '添加', name: 'position-approve-add' },
            { title: '修改', name: 'position-approve-edit' },
            { title: '删除', name: 'position-approve-delete' },
            { title: '详情', name: 'position-approve-detail' },
            { title: '创建社团审核', name: 'position-approve-approve' },
          ]
        },
        component: () => import('@/views/business/position/manage/position-approve.vue')
      },
      {
        path: '/position/manage/position-manage',
        name: 'ManagePosition',
        meta: {
          title: '社团管理',
          privilege: [
            { title: '查询', name: 'position-manage-query' },
            { title: '添加', name: 'position-manage-add' },
            { title: '修改', name: 'position-manage-edit' },
            { title: '删除', name: 'position-manage-delete' },
            { title: '详情', name: 'position-manage-detail' },
            { title: '入社退社审核', name: 'position-manage-approve' },
          ]
        },
        component: () => import('@/views/business/position/manage/position-manage.vue')
      },
      {
        path: '/position/manage/position-join',
        name: 'ManagePositionJoin',
        meta: {
          title: '社团成员管理',
          privilege: [
            { title: '查询', name: 'position-join-query' },
            { title: '详情', name: 'position-join-detail' },
            { title: '审核', name: 'position-join-approve' },
            { title: '更新成员', name: 'position-user-update' },
          ]
        },
        component: () => import('@/views/business/position/manage/position-join.vue')
      },
    ]
  }
];
