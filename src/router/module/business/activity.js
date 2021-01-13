import Main from '@/components/main';
// 活动
export const activity = [
  {
    path: '/activity',
    name: 'Activity',
    component: Main,
    meta: {
      title: '活动',
      icon: 'icon iconfont icondingshirenwu'
    },
    children: [
      {
        path: '/activity/activity-show',
        name: 'ActivityShow',
        meta: {
          title: '活动列表',
          privilege: [
            { title: '查询', name: 'activity-show-query' },
            { title: '详情', name: 'activity-show-detail' },
            { title: '报名', name: 'activity-show-apply'},
          ]
        },
        component: () => import('@/views/business/activity/activity-show.vue')
      },
      {
        path: '/activity/user-activity',
        name: 'UserActivity',
        meta: {
          title: '我的活动',
          privilege: [
            { title: '查询', name: 'user-activity-query' },
            { title: '详情', name: 'user-activity-detail' },
            { title: '参与', name: 'user-activity-join' },
          ]
        },
        component: () => import('@/views/business/activity/user-activity.vue')
      },
      {
        path: '/activity/manage/activity-edit',
        name: 'ActivityEdit',
        meta: {
          title: '新建活动',
          privilege: [
            { title: '编辑', name: 'activity-edit' },
          ]
        },
        component: () => import('@/views/business/activity/manage/activity-edit.vue')
      },
      {
        path: '/activity/manage/activity-approve',
        name: 'ManageActivityApprove',
        meta: {
          title: '活动审核',
          privilege: [
            { title: '查询', name: 'activity-approve-query' },
            { title: '添加', name: 'activity-approve-add' },
            { title: '修改', name: 'activity-approve-edit' },
            { title: '删除', name: 'activity-approve-delete' },
            { title: '详情', name: 'activity-approve-detail' },
            { title: '审核', name: 'activity-approve-approve' },
          ]
        },
        component: () => import('@/views/business/activity/manage/activity-approve.vue')
      },
      {
        path: '/activity/manage/activity-manage',
        name: 'ManageActivity',
        meta: {
          title: '活动管理',
          privilege: [
            { title: '查询', name: 'activity-manage-query' },
            { title: '添加', name: 'activity-manage-add' },
            { title: '修改', name: 'activity-manage-edit' },
            { title: '删除', name: 'activity-manage-delete' },
            { title: '详情', name: 'activity-manage-detail' },
            { title: '审核', name: 'activity-manage-approve' },
          ]
        },
        component: () => import('@/views/business/activity/manage/activity-manage.vue')
      },
      {
        path: '/activity/manage/activity-join',
        name: 'ManageActivityJoins',
        meta: {
          title: '活动报名管理',
          privilege: [
            { title: '查询', name: 'activity-join-query' },
            { title: '添加', name: 'activity-join-add' },
            { title: '修改', name: 'activity-join-edit' },
            { title: '删除', name: 'activity-join-delete' },
            { title: '详情', name: 'activity-join-detail' },
            { title: '审核', name: 'activity-join-approve' },
          ]
        },
        component: () => import('@/views/business/activity/manage/activity-join.vue')
      },
    ]
  }
];
