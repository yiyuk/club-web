<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem class="marginBottom20" v-privilege="'fund-approve-query'" prop="club">
          <Select v-model="searchData.positionId" clearable placeholder="选择社团" filterable><!-- 支持搜索 -->
            <Option v-for="item in positionList" :value="item.id" :key="item.id">{{item.positionName}}</Option>
          </Select>
        </FormItem>
        <FormItem v-privilege="'fund-approve-query'">
          <Select placeholder="选择申请状态" v-model="searchData.approveStatus" clearable style="width:160px">
            <Option v-for="item in approveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getFundList"
              icon="ios-search"
              type="primary"
              v-privilege="'fund-approve-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <Table v-if="approveStatus === 1" :columns="fundApproveColumns" :data="fundData" :loading="loading" border></Table>
      <Table v-if="approveStatus != 1" :columns="fundColumns" :data="fundData" :loading="loading" border></Table>

      <Page
        :current="pageNum"
        :page-size="pageSize"
        :page-size-opts="[5, 10, 20 ]"
        :total="pageTotal"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        show-elevator
        show-sizer
        show-total
        style="margin:24px 0;text-align:right;"
      ></Page>
    </Card>

    <!-- 查看经费 -->
    <Modal title="经费申请" v-model="isShowModal" >
      <p>申请理由：{{fund.remark}}</p>
      <p>申请社团：{{fund.positionName}}</p>
      <p>经费数额：{{fund.fund}}</p>
      <p>申请时间：{{fund.createTime}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">确定</Button>
      </div>
    </Modal>
    <!-- 查看经费 -->
  </div>
</template>

<script>
import { fundApi } from '@/api/fund';
import { APPROVE_STATUS } from '@/constants/approveStatus';
import { NOTICE_STATUS } from '@/constants/notice';
import { positionApi } from '@/api/position';

export default {
  name: 'FundApprove',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        title: ''
      },
      approveStatusList: [
        {
          value: 1,
          label: "等待审核的申请",
        },
        {
          value: 2,
          label: "未通过的申请",
        },
        {
          value: 3,
          label: "已通过的申请",
        }
      ],
      positionList:[{id:-1,positionName:"未获取到社团"}],
      isShowModal: false,
      approveStatus: 0,
      fund:{},
      loading: true,
      modalLoading: false,
      saveLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formData: {},
      // table表头
      fundApproveColumns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '申请理由',
          key: 'remark'
        },
        {
          title: '申请社团',
          key: 'positionName'
        },
        {
          title: '金额',
          key: 'fund'
        },
        {
          title: '申请时间',
          key: 'updateTime'
        },
        {
          title: '审核状态',
          key: 'approveStatus',
          render: (h, params) => {
            return h('span', params.row.approveStatus == 1 ? '未审核' : '已审核');
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
                    value: 'fund-detail'
                  }
                ],
                action: () => {
                  this.getFundDetail(params.row);
                }
              },
              {
                title: '通过',
                directives: [
                  {
                    name: 'privilege',
                    value: 'fund-approve-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '通过',
                    content: '确认通过该条经费申请吗？',
                    onOk: () => {
                      this.approveFund(params.row);
                    }
                  });
                }
              },
              {
                title: '拒绝',
                directives: [
                  {
                    name: 'privilege',
                    value: 'fund-approve-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '拒绝',
                    content: '确认拒绝该条经费申请吗？',
                    onOk: () => {
                      this.notApproveFund(params.row);
                    }
                  });
                }
              },
            ];
            return this.$tableAction(h, btns);
          }
        },
      ],
      fundColumns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '申请理由',
          key: 'remark'
        },
        {
          title: '申请社团',
          key: 'positionName'
        },
        {
          title: '金额',
          key: 'fund'
        },
        {
          title: '申请时间',
          key: 'updateTime'
        },
        {
          title: '审核状态',
          key: 'approveStatus',
          render: (h, params) => {
            return h('span', params.row.approveStatus == 1 ? '未审核' : '已审核');
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
                    value: 'fund-detail'
                  }
                ],
                action: () => {
                  this.getFundDetail(params.row);
                }
              },
            ];
            return this.$tableAction(h, btns);
          }
        },
      ],
      // table数据
      fundData: [],
      formValidate: {
        title: [{ required: true, message: '请输入经费标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入经费内容', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
    this.getFundList();
    this.getPositionList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    // 查询经费列表
    async getFundList() {
      try {
        this.loading = true;
        let result = await fundApi.getFundByPage({
          ...this.searchData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        });
        this.loading = false;
        this.fundData = result.data.list;
        this.approveStatus = this.searchData.approveStatus;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 获取社团列表
    async getPositionList() {
      this.$Spin.show();
      try {
        let res = await positionApi.getAdmin();
        this.positionList = res.data;
        //this.positionList.unshift({id:0,positionName:"选择全部社团"});
      } catch (error) {
        console.error(error);
      } finally {
        this.$Spin.hide();
      }
    },
    // 获取经费详情
    async getFundDetail(data) {
      this.fund = data;
      this.isShowModal = true;
    },
    // 拒绝申请
    async notApproveFund(data) {
      try {
        this.modalLoading = true;
        let approveStatus = 2;
        await fundApi.approveFund({
          id: data.id,
          approveStatus: status,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已拒绝申请");
        this.getFundList();
      } catch (e) {
        console.error(e);
      }
    },
    // 通过审核
    async approveFund(data) {
      try {
        this.modalLoading = true;
        let status = 3;
        await fundApi.approveFund({
          id: data.id,
          approveStatus: status,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已通过申请");
        this.getFundList();
      } catch (e) {
        console.error(e);
      }
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getFundList();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getFundList();
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getFundList();
    },
    // 取消
    cel() {
      this.isShowModal = false;
    },
  }
};
</script>
