import {
  postAxios,
  getAxios
} from '@/lib/http';

export const fundApi = {
  // 根据id查询经费申请信息
  getFundById: (id) => {
    return getAxios('/fund/getById/' + id);
  },
  // 分页查询经费申请信息
  getFundByPage: (data) => {
    return postAxios('/fund/getListPage', data);
  },
  // 提交经费申请
  applyFund: (data) => {
    return postAxios('/fund/apply', data);
  },
  // 审核经费申请
  approveFund: (data) => {
    return postAxios('/fund/approve', data);
  }

}
