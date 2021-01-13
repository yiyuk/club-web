import {
  postAxios,
  getAxios
} from '@/lib/http';

export const activityApi = {
  // 根据ID查询活动申请记录
  getActivityApproveById: (id) => {
    return getAxios('/activity/approve/getById/' + id);
  },
  // 分页查询活动申请记录
  getActivityApproveByPage: (data) => {
    return postAxios('/activity/approve/getListPage', data);
  },
  // 活动申请
  applyActivityApprove: (data) => {
    return postAxios('/activity/approve/add', data);
  },
  // 审核活动申请
  approveActivityApprove: (data) => {
    return postAxios('/activity/approve/approve', data);
  },


  // 根据ID查询活动
  getActivityById: (id) => {
    return getAxios('/activity/getById/' + id);
  },
  // 分页查询活动
  getActivityByPage: (data) => {
    return postAxios('/activity/getByPage', data);
  },
  // 更新活动
  updateActivity: (data) => {
    return postAxios('/activity/update', data);
  },
  // 删除活动
  deleteActivity: (id) => {
    return getAxios('/activity/delete/' + id);
  },


  // 根据id查询参与活动信息
  getActivityRelationById: (id) => {
    return getAxios('/activity/relation/getById/' + id);
  },
  // 分页查询参与的活动信息
  getActivityRelationByRelAndPage: (data) => {
    return postAxios('/activity/relation/getByRelAndPage', data);
  },
  // 分页查询参与活动信息
  getActivityRelationByPage: (data) => {
    return postAxios('/activity/relation/getByPage', data);
  },
  // 报名活动
  apprlyActivityRelation: (data) => {
    return postAxios('/activity/relation/add', data);
  },
  // 审核活动报名
  approveActivityRelation: (data) => {
    return postAxios('/activity/relation/approve', data);
  },
  // 更新参与活动状态
  joinActivity: (data) => {
    return postAxios('/activity/relation/joinActivity', data);
  },

}
