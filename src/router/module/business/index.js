
import Main from '@/components/main';

import { emailSetting } from './email';
import { keepAlive } from './keep-alive';
import { notice } from './notice';
import { news } from './news';
import { activity } from './activity';
import { message } from './message';
import { fund } from './fund'
import { position } from './position'

// 业务
export const business = [
  {
    path: '/business',
    name: 'Business',
    component: Main,
    meta: {
      title: '用户功能',
      topMenu:true,
      icon: 'icon iconfont iconyoujianguanli'
    },
    children: [
      ...notice,
      ...news,
      ...message,
      ...activity,
      ...position,
      ...fund,
    ]
  }
];
