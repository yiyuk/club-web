import {
  postAxios,
  getAxios
} from '@/lib/http';

export const positionApi = {
  // 添加社团
  addPosition: data => {
    return postAxios('/position/add', data);
  },
  //根据ID查询社团
  getPositionById: id => {
    return getAxios('/position/getById/' + id);
  },
  // 查询社团列表
  getPositionByName: (name) => {
    return getAxios('/position/getByName/' + name);
  },
  // 返回当前登录者管理的社团
  getAdmin: () => {
    return postAxios('/position/getAdmin')
  },
  // 分页查询所有社团
  getPositionByPage: data => {
    return postAxios('/position/getByPage', data);
  },
  // 更新社团
  updatePosition: data => {
    return postAxios('/position/update', data);
  },
  // 根据ID删除社团
  deletePosition: id => {
    return getAxios('/position/delete/' + id);
  },


  //提交创建社团申请
  addPositionApprove: data => {
    return postAxios('/position/approve/add', data);
  },
  //根据ID查询创建社团申请
  getPositionApproveById: id => {
    return getAxios('/position/approve/getById/' + id);
  },
  //查询社团审核状态
  getPositionApproveList: data => {
    return postAxios('/position/approve/getList', data);
  },
  //更新社团审核状态
  updatePositionApprove: data => {
    return postAxios('/position/approve/update', data);
  },


  //用户入团退团申请
  applyPositionRelation: data => {
    return postAxios('/position/relation/apply', data);
  },
  //审批用户入团退团申请
  approvePositionRelation: data => {
    return postAxios('/position/relation/approve', data);
  },
  //根据ID查询社团-用户关联
  getPositionRelationById: id => {
    return getAxios('/position/relation/getById/' + id);
  },
  //根据条件分页查询社团-用户关联
  getPositionRelationByPage: data => {
    return postAxios('/position/relation/getByPage', data);
  },
  // 退出社团
  exitPosition: id => {
    return getAxios('/position/relation/exit/' + id);
  }
};
