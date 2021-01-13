<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'user-position-query'">
          <Select placeholder="选择团员状态" clearable v-model="searchData.status" style="width:200px">
            <Option v-for="item in approveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem class="marginBottom20" prop="club">
          <Select v-model="searchData.positionId" placeholder="选择社团" style="width:200px" clearable filterable><!-- 支持清除,搜索 -->
            <Option v-for="item in positionList" :value="item.id" :key="item.id">{{item.positionName}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getPositionByPage"
              icon="ios-search"
              type="primary"
              v-privilege="'position-join-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <Table v-if="status === 3 || status === 6" :columns="positionColumns" :data="positionData" :loading="loading" border></Table>
      <Table v-if="status === 1 || status === 4" :columns="positionApproveColumns" :data="positionData" :loading="loading" border></Table>

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

    <!-- 查看社团 -->
    <Modal :title="position.positionName" v-model="showModal" >
      <p>社团介绍：{{position.positionRemark}}</p>
      <p>当前人数：{{position.positionNumber}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">确认</Button>
      </div>
    </Modal>
    <!-- 查看社团 -->
  </div>
</template>

<script>
import { positionApi } from '@/api/position';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'PositionJoin',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        status: 3,
      },
      status: 1,
      approveStatusList:[
        {
          value: 1,
          label: "等待入团审核",
        },
        {
          value:4,
          label:'等待退团审核'
        },
        {
          value: 3,
          label: "社团成员",
        },
        {
          value: 6,
          label: "已退出的成员",
        },
      ],
      positionList:[],
      positionData:[],
      modalType: 'add',
      showModal: false,
      position:{},
      loading: true,
      modalLoading: false,
      saveLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formData: {},
      // table表头
      positionApproveColumns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '所属社团',
          key: 'positionName'
        },
        {
          title: '申请人姓名',
          key: 'actualName'
        },
        {
          title: '申请时间',
          key: 'updateTime'
        },
        {
          title: '审核状态',
          key: 'status',
          render: (h, params) => {
            return h(
              'span',
              params.row.status === 1 ? '未审核' : '已审核'
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
                title: '通过',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-join-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '通过',
                    content: '确认通过该条申请吗？',
                    onOk: () => {
                      this.approvePosition(params.row);
                    }
                  });
                }
              },
              {
                title: '拒绝',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-join-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '拒绝',
                    content: '确认拒绝该条申请吗？',
                    onOk: () => {
                      this.notApprovePosition(params.row);
                    }
                  });
                }
              },
            ];
            return this.$tableAction(h, btns);
          }
        },
       ],
      positionColumns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '所属社团',
          key: 'positionName'
        },
        {
          title: '团员姓名',
          key: 'actualName'
        },
        {
          title: '入团时间',
          key: 'joinTime'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 200,
          className: 'action-hide',
          render: (h, params) => {
            let btns = [
              // {
              //   title: '设为社团管理员',
              //   directives: [
              //     {
              //       name: 'privilege',
              //       value: 'position-join-approve'
              //     }
              //   ],
              //   action: () => {
              //     this.$Modal.confirm({
              //       title: '设置角色',
              //       content: '确认设为社团管理员吗？',
              //       onOk: () => {
              //         this.updateUserRole(params.row);
              //       }
              //     });
              //   }
              // },
              {
                title: '删除',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-join-approve'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '删除',
                    content: '确认删除该成员吗？',
                    onOk: () => {
                      this.delectUser(params.row);
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
      avtivityData: [],
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
    // 查询社团列表
    async getPositionByPage() {
      try {
        this.loading = true;
        let result = await positionApi.getPositionRelationByPage({
          ...this.searchData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isShow: false,
        });
        this.loading = false;
        this.positionData = result.data.list;
        this.status = this.searchData.status;
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
        console.error(e);
      } finally {
        this.$Spin.hide();
      }
    },
    // 拒绝申请
    async notApprovePosition(data) {
      try {
        this.modalLoading = true;
        await positionApi.approvePositionRelation({
          id: data.id,
          applyResult: false,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已拒绝申请");
        this.getPositionByPage();
      } catch (e) {
        console.error(e);
      }
    },
    // 通过申请
    async approvePosition(data) {
      try {
        this.modalLoading = true;
        await positionApi.approvePositionRelation({
          id: data.id,
          applyResult: true,
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Message.success("已通过申请");
        this.getPositionByPage();
      } catch (e) {
        console.error(e);
      }
    },
    // 获取社团详情
    getPositionDetail(data) {
      this.loading = true;
      this.position = data;
      this.showModal = true;
      this.loading = false;
    },
    // 删除团员
    async delectUser(data){
      try {
        this.loading = true;
        await positionApi.exitPosition(data.id);
        this.loading = false;
        this.isShowModal = false;
        this.$Message.success("已删除");
        this.getPositionByPage();
      } catch (e) {
        this.$Message.error("系统错误");
        this.loading = false;
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
    // 取消
    cel() {
      this.showModal = false;
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
