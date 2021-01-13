<template>
  <div>
    <Card>
      <p slot="title" class="text-center">{{news.newsTitle}}</p>
      <p class="text-center">
        {{news.positionName}}
        <br/>
        {{news.updateTime}}
        <br/><br/>
      </p>
      <p v-html="news.newsText"></p>
    </Card>
  </div>
</template>
<script>
import { newsApi } from '@/api/news';

export default {
  name: 'NewsDetail',
  components: {},
  props: {},
  data() {
    //新闻信息
    return {
      newsId: 0,
      news: {},
      content: ''
    };
  },
  mounted() {
    this.newsId = this.$route.params.newsId;
    this.getNewsById(this.newsId);
  },
  methods: {
    // 获取新闻详情
    async getNewsById(id) {
      try {
        let result = await newsApi.getNewsById(id);
        this.news = result.data;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.detail {
  margin-bottom: 20px;
}
.time {
  text-align: right;
  color: #999;
}
</style>
