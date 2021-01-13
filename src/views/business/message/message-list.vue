<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'message-list-query'">
          <Input placeholder="请输入消息标题" v-model="searchData.title"></Input>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getMessageList"
              icon="ios-search"
              type="primary"
              v-privilege="'message-list-query'"
            >查询</Button>
            <Button
              @click="refresh"
              icon="md-refresh"
              type="default"
              v-privilege="'message-list-query'"
            >重置</Button>
          </ButtonGroup>
        </FormItem>
        <FormItem>
          <Button
            @click="openModal('add')"
            icon="md-add"
            type="primary"
            v-privilege="'message-list-add'"
          >添加消息</Button>
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
    <!-- 添加修改消息 -->
    <Modal
      :loading="saveLoading"
      :title="modalType=='add'?'添加':'修改'"
      @on-cancel="cancelSave"
      @on-ok="addOrUpdateMessage"
      v-model="editModal"
    >
      <Form :label-width="80" :model="formData" :rules="formValidate" ref="formRef">
        <FormItem label="标题" prop="title">
          <Input placeholder="请输入消息标题" v-model="formData.title"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
          <Input
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入消息内容"
            type="textarea"
            v-model="formData.content"
          ></Input>
        </FormItem>
      </Form>
      </Modal>
      <!-- 添加修改消息 -->
  </div>
</template>

<script>
import { messageApi } from '@/api/message';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'MessageList',
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
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '消息标题',
          key: 'title'
        },
        {
          title: '更新时间',
          key: 'updateTime'
        },
        {
          title: '消息创建人',
          key: 'senderName'
        },
        {
          title: '是否发送',
          key: 'sendStatus',
          render: (h, params) => {
            return h(
              'span',
              this.$enum.getDescByValue('NOTICE_STATUS', params.row.sendStatus)
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
                    value: 'message-detail'
                  }
                ],
                action: () => {
                  this.$router.push({
                    name:'MessageDetail',
                    params:{message:params.row}
                  })
                }
              },
              {
                title: '删除',
                directives: [
                  {
                    name: 'privilege',
                    value: 'message-delete'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '删除',
                    content: '确认删除该条消息么？',
                    onOk: () => {
                      this.deleteMessage(params.row.id);
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
                  value: 'message-edit'
                }
              ],
              action: () => {
                this.openModal('edit', params.row);
              }
            };
            let sendBtn = {
              title: '发送',
              directives: [
                {
                  name: 'privilege',
                  value: 'message-send'
                }
              ],
              action: () => {
                this.$Modal.confirm({
                  title: '确认',
                  content: '确认发送条消息么？',
                  onOk: () => {
                    this.sendMessage(params.row.id);
                  }
                });
              }
            };
            if (params.row.sendStatus != NOTICE_STATUS['YES'].value) {
              btns.push(editBtn);
            }
            if (params.row.sendStatus != NOTICE_STATUS['YES'].value) {
              btns.push(sendBtn);
            }
            return this.$tableAction(h, btns);
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
    this.getMessageList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    // 查询消息列表
    async getMessageList() {
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
      } catch (e) {
        this.loading = true;
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 添加消息
    openModal(type, data) {
      this.modalType = type;
      switch (type) {
        case 'add':
          this.formData = {};
          this.editModal = true;
          break;
        case 'edit':
          this.getMessageDetail(data.id);
          this.editModal = true;
          break;
      }
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getMessageList();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getMessageList();
    },
    // 删除通知
    async deleteMessage(id) {
      this.$Spin.show();
      let result = await messageApi.deleteMessage(id);
      this.$Spin.hide();
      this.$Message.success('删除消息成功!');
      this.getMessageList();
    },
    // 发送消息
    async sendMessage(id) {
      this.$Spin.show();
      let result = await messageApi.sendMessage(id);
      this.$Message.success('发送消息成功!');
      this.$Spin.hide();
      this.getMessageList();
    },
    // 保存任务
    addOrUpdateMessage() {
      try {
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            if (this.modalType == 'add') {
              this.addMessage();
            } else {
              this.editMessage();
            }
          }
        });
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 修改消息
    async editMessage() {
      try {
        this.loading = true;
        let result = await messageApi.updateMessage(this.formData);
        this.$Message.success('修改成功');
        this.editModal = false;
        this.getMessageList();
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
        this.loading = false;
      }
    },
    // 保存消息
    async addMessage() {
      try {
        this.loading = true;
        let result = await messageApi.addMessage(this.formData);
        this.$Message.success('保存成功');
        this.editModal = false;
        this.getMessageList();
        this.loading = false;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
        this.loading = false;
      }
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
      this.getMessageList();
    }
  }
};
</script>
