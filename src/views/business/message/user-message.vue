<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'user-message-query'">
          <Input placeholder="请输入消息标题" v-model="searchData.title">
            <Button @click="getUserMessageList" icon="ios-search" slot="append"></Button>
          </Input>
        </FormItem>
        <FormItem>
          <Button
            @click="refresh"
            icon="md-refresh"
            type="primary"
            v-privilege="'user-message-query'"
          >重置</Button>
        </FormItem>
      </Form>
      <Table :columns="columns" :data="data" :loading="loading" border></Table>
      <Page
        :current="pageNum"
        :page-size="pageSize"
        :page-size-opts="[5, 10, 20]"
        :total="pageTotal"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        show-elevator
        show-sizer
        show-total
        style="margin:24px 0;text-align:right;"
      ></Page>
    </Card>

    <Modal :loading="saveLoading" :title="formData.title" class="detail-modal" v-model="editModal">
      <div class="detail">{{formData.content}}</div>
      <p class="time">{{formData.updateTime}}</p>
      <div slot="footer">
        <Button @click="readMessage" size="large" type="primary">已读</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { messageApi } from '@/api/message';
export default {
  name: 'UserMessage',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        title: ''
      },
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
        title: '',
        content: ''
      },
      // table表头
      columns: [
        {
          title: '消息标题',
          key: 'title'
        },
        {
          title: '发送时间',
          key: 'createTime'
        },
        {
          title: '状态',
          key: 'createUser',
          render: (h, params) => {
            return h('span', params.row.receiveStatus===1 ? '已读' : '未读');
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          className: 'action-hide',
          render: (h, params) => {
            return this.$tableAction(h, [
              {
                title: '查看',
                directives: [
                  {
                    name: 'privilege',
                    value: 'user-message-detail'
                  }
                ],
                action: () => {
                  this.getMessageDetail(params.row.id);
                }
              }
            ]);
          }
        }
      ],
      // table数据
      data: [],
      formValidate: {
        title: [{ required: true, message: '请输入消息标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
    this.getUserMessageList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    // 查询个人消息列表
    async getUserMessageList() {
      try {
        this.loading = true;
        let result = await messageApi.getMessageByPage({
          ...this.searchData,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        });
        this.loading = false;
        this.data = result.data.list;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        //TODO zhuoda sentry
        this.loading = false;
        console.error(e);
      }
    },
    // 获取通知详情
    async getMessageDetail(id) {
      try {
        this.loading = true;
        let result = await messageApi.getMessageById(id);
        this.loading = false;
        this.formData = result.data;
        this.editModal = true;
      } catch (e) {
        //TODO zhuoda sentry
        this.loading = false;
        console.error(e);
      }
    },
    // 标记已读
    async readMessage() {
      try {
        this.loading = true;
        await messageApi.readMessage(this.formData.id);
        this.getUserMessageList();
        this.editModal = false;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        console.error(e);
      }
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getUserMessageList();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getUserMessageList();
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getUserMessageList();
    },
    // 关闭详情
    cancelSave() {
      this.editModal = false;
      this.getUserMessageList();
    }
  }
};
</script>

<style lang="less" scoped>
.detail-modal {
  .detail {
    margin-bottom: 20px;
  }
  .time {
    text-align: right;
    color: #999;
  }
}
</style>
