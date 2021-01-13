<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'activity-approve-query'">
          <Input placeholder="请输入活动名" v-model="searchData.activityName"></Input>
        </FormItem>
        <FormItem v-privilege="'activity-approve-query'">
          <Select placeholder="选择活动状态" v-model="approveStatus"  style="width:130px">
            <Option v-for="item in approveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getActivityList"
              icon="ios-search"
              type="primary"
              v-privilege="'activity-approve-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <Table :columns="approveColumns" :data="approveData" :loading="loading" border></Table>

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

    <!-- 查看活动 -->
    <Modal title="活动审核" v-model="isShowModal" >
      <p>活动名称：{{activity.activityName}}</p>
      <p>活动介绍：{{activity.activityRemark}}</p>
      <p>举办社团：{{activity.positionName}}</p>
      <p>活动地点：{{activity.place}}</p>
      <p>开始时间：{{activity.startTime}}</p>
      <p>结束时间：{{activity.stopTime}}</p>
      <p>人数上限：{{activity.activityMaximum}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="notApproveActivity">拒绝</Button>
        <Button type="primary" size="large" :loading="modalLoading" @click="approveActivity">通过</Button>
      </div>
    </Modal>
    <!-- 查看活动 -->
  </div>
</template>

<script>
import { activityApi } from '@/api/activity';
import { APPROVE_STATUS } from '@/constants/approveStatus';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'ActivityApprove',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        title: ''
      },
      approveStatusList: [
        {
          value: 0,
          label: "全部活动",
        },
        {
          value: 1,
          label: "等待审核的活动",
        },
        {
          value: 3,
          label: "已审核的活动",
        }
      ],
      activityData:[],
      approveData:[],
      modalType: 'add',
      isShowModal: false,
      approveStatus: 1,
      activity:{},
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
          title: '活动名称',
          key: 'activityName'
        },
        {
          title: '申请时间',
          key: 'createTime'
        },
        {
          title: '申请社团',
          key: 'positionName'
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
                    value: 'activity-detail'
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
                    value: 'activity-approve-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '通过',
                    content: '确认通过该条活动申请吗？',
                    onOk: () => {
                      this.approveActivity(params.row);
                    }
                  });
                }
              },
              {
                title: '拒绝',
                directives: [
                  {
                    name: 'privilege',
                    value: 'activity-approve-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '拒绝',
                    content: '确认拒绝该条活动申请吗？',
                    onOk: () => {
                      this.notApproveActivity(params.row);
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
        title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入活动内容', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
    this.getActivityList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    // 查询活动列表
    async getActivityList() {
      try {
        this.loading = true;
        if(this.approveStatus == 0){
          this.approveStatus = null;
        }
        let result = await activityApi.getActivityApproveByPage({
          ...this.searchData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: this.approveStatus,
        });
        this.loading = false;
        this.approveData = result.data.list;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 获取活动详情
    async getActivityDetail(data) {
      this.activity = data;
      this.isShowModal = true;
    },
    // 拒绝活动
    async notApproveActivity(data) {
      try {
        this.modalLoading = true;
        let status = 2;
        await activityApi.approveActivityApprove({
          id: data.id,
          status: status,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已拒绝申请");
        this.getActivityList();
      } catch (e) {
        console.error(e);
      }
    },
    // 通过活动审核
    async approveActivity(data) {
      try {
        this.modalLoading = true;
        let status = 3;
        await activityApi.approveActivityApprove({
          id: data.id,
          status: status,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已通过申请");
        this.getActivityList();
      } catch (e) {
        console.error(e);
      }
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getActivityList();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getActivityList();
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getActivityList();
    }
  }
};
</script>
