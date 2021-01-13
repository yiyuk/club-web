import {
  postAxios,
  getAxios
} from '@/lib/http';

export const messageApi = {
  // 根据id查询消息
  getMessageById: (id) => {
    return getAxios('/message/getById/' + id);
  },
  // 分页查询消息
  getMessageByPage: (data) => {
    return postAxios('/message/getByPage', data);
  },
  // 添加消息
  addMessage: (data) => {
    return postAxios('/message/add', data);
  },
  // 更新消息
  updateMessage: (data) => {
    return postAxios('/message/update', data);
  },
  // 更新消息为已读状态
  readMessage: (id) => {
    return getAxios('/message/read/' + id);
  },
  // 删除消息
  deleteMessage: (id) => {
    return getAxios('/message/delete/' + id);
  }
}