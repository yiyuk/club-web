import {
  postAxios,
  getAxios
} from '@/lib/http';

export const newsApi = {
  // 根据id查询新闻
  getNewsById: (id) => {
    return getAxios('/news/getById/' + id);
  },
  // 分页查询新闻
  getNewsByPage: (data) => {
    return postAxios('/news/getByPage', data);
  },
  // 添加新闻
  addNews: (data) => {
    return postAxios('/news/add', data);
  },
  // 修改新闻
  updateNews: (data) => {
    return postAxios('/news/update', data);
  },
  // 删除新闻
  deleteNews: (id) => {
    return getAxios('/news/deleteById/' + id);
  }

}
