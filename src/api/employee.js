import { postAxios, getAxios } from '@/lib/http';
export const employeeApi = {
  // 用户管理查询
  getEmployeeList: (data) => {
    return postAxios('/employee/query', data);
  },
  // 查询单个用户
  getEmployeeById: (id) => {
    return getAxios('/employee/query/', id);
  },
  // 添加用户
  addEmployee: (data) => {
    return postAxios('/employee/add', data);
  },
  // 更新用户信息
  updateEmployee: (data) => {
    return postAxios('/employee/update', data);
  },
  // 禁用启用单个用户
  updateStatus: (employeeId, status) => {
    return getAxios('/employee/updateStatus/' + employeeId + '/' + status);
  },
  // 批量禁用
  updateStatusBatch: (data) => {
    return postAxios('/employee/batchUpdateStatus', data);
  },
  // 单个用户角色授权
  updateRoles: (data) => {
    return postAxios('/employee/updateRoles', data);
  },
  // 修改密码
  updatePwd: (data) => {
    return postAxios('/employee/updatePwd', data);
  },
  // 重置密码
  resetPassword: (employeeId) => {
    return getAxios('/employee/resetPasswd/' + employeeId);
  },
  // 删除用户
  deleteEmployee: (employeeId) => {
    return postAxios('/employee/delete/' + employeeId);
  }
};
