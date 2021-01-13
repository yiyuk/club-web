<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'activity-manage-query'">
          <Input placeholder="请输入活动名" v-model="searchData.activityName"></Input>
        </FormItem>
        <FormItem v-privilege="'activity-manage-query'">
          <Select placeholder="选择活动时间" v-model="searchData.timeType"  style="width:130px">
            <Option v-for="item in timeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem class="marginBottom20" v-privilege="'activity-manage-query'" prop="club">
          <Select v-model="searchData.positionId" clearable  placeholder="选择社团" filterable><!-- 支持搜索 -->
            <Option v-for="item in positionList" :value="item.id" :key="item.id">{{item.positionName}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getActivityList"
              icon="ios-search"
              type="primary"
              v-privilege="'activity-manage-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <Table :columns="activityColumns" :data="activityData" :loading="loading" border></Table>

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

    <!-- 查看活动 -->
    <Modal :title="activity.activityName" v-model="showModal" >
      <p>活动介绍：{{activity.activityRemark}}</p>
      <p>举办社团：{{activity.positionName}}</p>
      <p>活动地点：{{activity.place}}</p>
      <p>开始时间：{{activity.startTime}}</p>
      <p>结束时间：{{activity.stopTime}}</p>
      <p>当前人数：{{activity.activityNumber}}</p>
      <p>人数上限：{{activity.activityMaximum}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">取消</Button>
        <Button type="primary" size="large" :loading="modalLoading" @click="editActivity">编辑</Button>
      </div>
    </Modal>
    <!-- 查看活动 -->
  </div>
</template>

<script>
import { activityApi } from '@/api/activity';
import { NOTICE_STATUS } from '@/constants/notice';
import { positionApi } from '@/api/position';

export default {
  name: 'ActivityManage',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        timeType: 0,
      },
      timeTypeList: [
        {
          value: 0,
          label: "全部活动",
        },
        {
          value: 1,
          label: "未开始的活动",
        },
        {
          value: 2,
          label: "正在进行的活动",
        },
        {
          value: 3,
          label: "已结束的活动",
        },
      ],
      positionList:[{id:-1,positionName:"未获取到社团"}],
      activityData:[],
      modalType: 'add',
      showModal: false,
      activity:{},
      loading: true,
      modalLoading: false,
      saveLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formData: {},
      // table表头
      activityColumns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '活动标题',
          key: 'activityName'
        },
        {
          title: '所属社团',
          key: 'positionName'
        },
        {
          title: '开始时间',
          key: 'startTime'
        },
        {
          title: '结束时间',
          key: 'stopTime'
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
                    value: 'activity-manage-detail'
                  }
                ],
                action: () => {
                  this.getActivityDetail(params.row)
                }
              },
              {
                title: '删除',
                directives: [
                  {
                    name: 'privilege',
                    value: 'activity-manage-delete'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '删除',
                    content: '确认删除该条活动么？',
                    onOk: () => {
                      this.deleteActivity(params.row.id);
                    }
                  });
                }
              }
            ];
            return this.$tableAction(h, btns);
          }
        },
       ],
      // table数据
      avtivityData: [],
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
    // 查询活动列表
    async getActivityList() {
      try {
        this.loading = true;
        let result = await activityApi.getActivityByPage({
          ...this.searchData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isShow: false,
        });
        this.loading = false;
        this.activityData = result.data.list;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 获取活动详情
    getActivityDetail(data) {
      this.loading = true;
      this.activity = data;
      this.showModal = true;
      this.loading = false;
    },
    // 更新活动
    async editActivity() {
      try {
        let type = 'edit';
        this.$router.push({
          name:'ActivityEdit',
          params:{
            activityData: this.activity,
            type:type,
          }
        });
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
    // 删除活动
    async deleteActivity(id) {
      this.$Spin.show();
      let result = await activityApi.deleteActivity(id);
      this.$Spin.hide();
      this.$Message.success('删除活动成功!');
      this.getActivityList();
    },
    // 取消
    cel() {
      this.showModal = false;
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
