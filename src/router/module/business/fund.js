import Main from '@/components/main';
// 经费
export const fund = [
  {
    path: '/fund',
    name: 'Fund',
    component: Main,
    meta: {
      title: '经费',
      icon: 'icon iconfont icondongtaijiazai'
    },
    children: [
      {
        path: '/fund/fund-apply',
        name: 'FundApply',
        meta: {
          title: '经费申请',
          privilege: [
            { title: '查询', name: 'fund-apply-query' },
            { title: '添加', name: 'fund-apply-add' },
            { title: '详情', name: 'fund-apply-detail' }
          ]
        },
        component: () => import('@/views/business/fund/fund-apply.vue')
      },
      {
        path: '/fund/fund-approve',
        name: 'FundApprove',
        meta: {
          title: '经费管理',
          privilege: [
            { title: '查询', name: 'fund-approve-query' },
            { title: '审核', name: 'fund-approve-approve'}
          ],
        },
        component: () => import('@/views/business/fund/fund-approve.vue')
      }
    ]
  }
];
