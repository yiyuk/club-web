<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'news-show-query'">
          <Input placeholder="请输入新闻标题" v-model="searchData.newsTitle"></Input>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getNewsList"
              icon="ios-search"
              type="primary"
              v-privilege="'news-show-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <List item-layout="vertical" :border="false" size="small" :split="true">
        <div v-for="item in data" data-id="item.id">
          <div @click="getNewsDetail(item.id)">
            <ListItem>
              <ListItemMeta :title="item.newsTitle" :description="item.newsText" />
              <template slot="extra">{{item.positionName}}<br/>{{item.updateTime}}</template >
            </ListItem>
            <br/>
          </div>
        </div>
      </List>


      <!-- <Table :columns="columns" :data="data" :loading="loading" border></Table> -->
      <Page
        :current="pageNum"
        :page-size="pageSize"
        :page-size-opts="[10, 20, 30, 50, 100]"
        :total="pageTotal"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        show-elevator
        show-sizer
        show-total
        style="margin:24px 0;text-align:right;"
      ></Page>
    </Card>
  </div>
</template>

<script>
import { newsApi } from '@/api/news';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'NewsShow',
  components: {},
  props: {},
  data() {
    return {
      value1: 0,
      searchData: {
        newsTitle: ''
      },
	  data:[],
      loading: true,
      saveLoading: true,
      updateLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formData: {
        title: '',
        content: ''
      },
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
    this.getNewsList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    // 查询新闻列表
    async getNewsList() {
      try {
        this.loading = true;
        let result = await newsApi.getNewsByPage({
          ...this.searchData,
          orders: [
              {
                "asc": false,
                "column": "id"
              },
          ],
          isShow: true,
          status: 1,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isShow: 1
        });
        this.loading = false;
        this.data = this.controlTextList(result.data.list);
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;

      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 获取新闻详情
    async getNewsDetail(id) {
      try {
        this.loading = true;
        //let result = await newsApi.getNewsById(id);
        this.$router.push({
          name:'NewsDetail',
          params:{newsId:id}
        });
        this.loading = false;
        //this.formData = result.data;
      } catch (e) {
        this.loading = true;
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    //删除html标签，限制文本显示的字数
    controlTextList (list) {
      list.forEach((item, index) => {
        // let arr = item.newsText.split("<");
        // arr.forEach((item2, index2) => {
        //   let arr2 = arr[index2].split(">");
        //   arr[index2] = arr2[1];
        // })
        // item.newsText = arr.join("");
        if (item.newsText.length > 200) { // 限制字数
          list[index].newsText = item.newsText.slice(0, 200) + '...'
        }
      })
      return list;
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getNewsList();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getNewsList();
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getNewsList();
    }
  }
};
</script>
