<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'position-approve-query'">
          <Input placeholder="请输入社团名" v-model="searchData.positionName"></Input>
        </FormItem>
        <FormItem v-privilege="'position-approve-query'">
          <Select placeholder="选择审核状态" v-model="searchData.status"  style="width:130px">
            <Option v-for="item in approveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getPositionByPage"
              icon="ios-search"
              type="primary"
              v-privilege="'position-approve-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <Table :columns="approveColumns" :data="approveData" :loading="loading" border></Table>

<!--      <Page
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
      ></Page> -->
    </Card>

    <!-- 查看社团 -->
    <Modal title="创建社团审核" v-model="isShowModal" >
      <p>社团名称：{{position.positionName}}</p>
      <p>社团介绍：{{position.remark}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="notApproveActivity">拒绝</Button>
        <Button type="primary" size="large" :loading="modalLoading" @click="approveActivity">通过</Button>
      </div>
    </Modal>
    <!-- 查看社团 -->
  </div>
</template>

<script>
import { positionApi } from '@/api/position';
import { APPROVE_STATUS } from '@/constants/approveStatus';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'ActivityList',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        status: 1
      },
      approveStatusList: [
        {
          value: 1,
          label: "等待审核的社团",
        },
        {
          value: 3,
          label: "已审核的社团",
        }
      ],
      positionData:[],
      approveData:[],
      modalType: 'add',
      isShowModal: false,
      position:{},
      loading: true,
      modalLoading: false,
      saveLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formData: {},
      // table表头
      approveColumns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '社团名称',
          key: 'positionName'
        },
        {
          title: '申请时间',
          key: 'createTime'
        },
        {
          title: '申请人姓名',
          key: 'actualName'
        },
        {
          title: '审核状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'span',
              params.row.approveStatus == 1 ? '未审核' : '已审核'
            );
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          render: (h, params) => {
            let btns = [
              {
                title: '详情',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-approve-detail'
                  }
                ],
                action: () => {
                  this.getActivityDetail(params.row);
                }
              },
              {
                title: '通过',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-approve-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '通过',
                    content: '确认通过该条社团申请吗？',
                    onOk: () => {
                      this.position = params.row;
                      this.approveActivity();
                    }
                  });
                }
              },
              {
                title: '拒绝',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-approve-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '拒绝',
                    content: '确认拒绝该条社团申请吗？',
                    onOk: () => {
                      this.position = params.row;
                      this.notApproveActivity();
                    }
                  });
                }
              },
            ];
            return this.$tableAction(h, btns);
          }
        },
       ],
      // table数据
      approveData: [],
      formValidate: {
        title: [{ required: true, message: '请输入社团标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入社团内容', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
    this.getPositionByPage();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    // 查询社团列表
    async getPositionByPage() {
      try {
        this.loading = true;
        let result = await positionApi.getPositionApproveList({
          ...this.searchData,
          // pageNum: this.pageNum,
          // pageSize: this.pageSize,
        });
        this.loading = false;
        this.approveData = result.data;
        // this.pageTotal = result.data.total;
        // this.pageNum = result.data.pageNum;
        // this.pageSize = result.data.pageSize;
      } catch (e) {
        this.$Message.error("系统错误");
        console.error(e);
      }
    },
    // 获取社团详情
    async getActivityDetail(data) {
      this.position = data;
      this.isShowModal = true;
    },
    // 拒绝申请
    async notApproveActivity(data) {
      try {
        this.modalLoading = true;
        let status = 2;
        await positionApi.updatePositionApprove({
          id: this.position.id,
          status: status,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已拒绝申请");
        this.getPositionByPage();
      } catch (e) {
        this.$Message.error("系统错误");
        this.modalLoading = false;
        console.error(e);
      }
    },
    // 通过申请
    async approveActivity(data) {
      try {
        this.modalLoading = true;
        let status = 3;
        await positionApi.updatePositionApprove({
          id: this.position.id,
          status: status,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已通过申请");
        this.getPositionByPage();
      } catch (e) {
        this.$Message.error("系统错误");
        this.modalLoading = false;
        console.error(e);
      }
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getPositionByPage();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getPositionByPage();
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getPositionByPage();
    }
  }
};
</script>
