<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'news-list-query'">
          <Input placeholder="请输入新闻标题" v-model="searchData.newsTitle"></Input>
        </FormItem>
        <FormItem v-privilege="'news-list-query'">
          <Select placeholder="选择发布状态" v-model="searchData.status" clearable style="width:160px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getNewsList"
              icon="ios-search"
              type="primary"
              v-privilege="'news-list-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
        <FormItem>
          <Button
            @click="openNewsEdit('add', null)"
            icon="md-add"
            type="primary"
            v-privilege="'news-list-add'"
          >添加新闻</Button>
        </FormItem>
      </Form>

      <Table :columns="columns" :data="data" :loading="loading" border></Table>

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
  name: 'NewsList',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        newsTitle: ''
      },
      statusList: [
        {
          value: 0,
          label:'未发布'
        },
        {
          value: 1,
          label:'已发布'
        },
      ],
      modalType: 'add',
      editModal: false,
      addModal: false,
      loading: true,
      saveLoading: true,
      updateLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      updateItem: {},
      saveItem: {},
      formData: {
      },
      // table表头
      columns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '新闻标题',
          key: 'newsTitle'
        },
        {
          title: '作者',
          key: 'actualName'
        },
        {
          title: '所属社团',
          key: 'positionName'
        },
        {
          title: '是否发布',
          key: 'status',
          render: (h, params) => {
            return h(
              'span',
              this.$enum.getDescByValue('NOTICE_STATUS', params.row.status)
            );
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          className: 'action-hide',
          render: (h, params) => {
            let btns = [
              {
                title: '详情',
                directives: [
                  {
                    name: 'privilege',
                    value: 'news-list-detail'
                  }
                ],
                action: () => {
                  this.$router.push({
                    name:'NewsDetail',
                    params:{newsId:params.row.id}
                  })
                }
              },
              {
                title: '删除',
                directives: [
                  {
                    name: 'privilege',
                    value: 'news-list-delete'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '删除',
                    content: '确认删除该条新闻么？',
                    onOk: () => {
                      this.deleteNews(params.row.id);
                    }
                  });
                }
              }
            ];
            let editBtn = {
              title: '编辑',
              directives: [
                {
                  name: 'privilege',
                  value: 'news-list-edit'
                }
              ],
              action: () => {
                this.openNewsEdit('edit', params);
              }
            };

            if (params.row.sendStatus != NOTICE_STATUS['YES'].value) {
              btns.push(editBtn);
            }
            return this.$tableAction(h, btns);
          }
        }
      ],
      // table数据
      data: [],
      formValidate: {
        title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
        text: [
          { required: true, message: '请输入新闻内容', trigger: 'blur' }
        ],
      }
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
    // 查询权限范围内的新闻列表
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
          isShow: false,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });console.log(result);
        this.loading = false;
        this.data = result.data.list;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        this.loading = false;
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 添加或编辑新闻
    async openNewsEdit(type, params) {
      try {
        switch (type) {
          case 'add':
            this.$router.push({
              name:'NewsEdit',
              params:{type:type}
            });
            break;
          case 'edit':
            this.$router.push({
              name:'NewsEdit',
              params:{
                newsData: params.row,
                type:type,
              }
            });
            break;
        }

      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
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
    // 删除
    async deleteNews(id) {
      this.$Spin.show();
      let result = await newsApi.deleteNews(id);
      this.$Spin.hide();
      this.$Message.success('删除新闻成功!');
      this.getNewsList();
    },
    // 取消添加/修改
    cancelSave() {
      this.editModal = false;
      this.$refs['formRef'].resetFields();
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
