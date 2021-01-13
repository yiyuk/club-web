<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'user-activity-query'">
          <Input placeholder="请输入活动名称" v-model="searchData.activityName"></Input>
        </FormItem>
        <FormItem v-privilege="'user-activity-query'">
          <Select placeholder="选择活动时间" v-model="searchData.timeType"  style="width:130px">
            <Option v-for="item in timeTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem v-privilege="'user-activity-query'">
          <Select placeholder="选择报名状态" v-model="searchData.status"  style="width:130px">
            <Option v-for="item in approveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getActivityList"
              icon="ios-search"
              type="primary"
              v-privilege="'user-activity-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <List item-layout="vertical" size="small" v-privilege="'user-activity-detail'">
        <div v-for="item in activityList" data-id="item.id">
          <div @click="getActivityDetail(item)">
            <ListItem>
              <ListItemMeta :title="item.activityName" />
              <template slot="extra">
                {{item.positionName}}
              </template >
            </ListItem>
            <br/>
          </div>
        </div>
      </List>

      <Page
        :current="pageNum"
        :page-size="pageSize"
        :page-size-opts="[5, 10, 20, ]"
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
    <Modal
      :title="activity.activityName"
      v-model="showModal"
    >
      <p>活动介绍：{{activity.activityRemark}}</p>
      <p>举办社团：{{activity.positionName}}</p>
      <p>活动地点：{{activity.place}}</p>
      <p>开始时间：{{activity.startTime}}</p>
      <p>结束时间：{{activity.stopTime}}</p>
      <p v-if="activity.status == 1">报名状态：正在审核</p>
      <p v-if="activity.status == 2">报名状态：报名失败</p>
      <p v-if="activity.status == 3">报名状态：报名成功</p>
      <p v-if="activity.joinStatus != 1">参与状态：未参与活动</p>
      <p v-if="activity.joinStatus == 1">参与状态：已参与活动</p>
      <p>当前人数：{{activity.activityNumber}}</p>
      <p>人数上限：{{activity.activityMaximum}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">确定</Button>
        <Button v-if="activity.joinStatus === 0"
          type="primary" size="large" :loading="modalLoading" @click="join">参与活动</Button>
      </div>
    </Modal>
    <!-- 查看活动 -->
  </div>
</template>

<script>
import { activityApi } from '@/api/activity';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'UserActivity',
  components: {},
  props: {},
  data() {
    return {
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
      searchData: {
        activityName: '',
        timeType: 2,
        status: 3,
      },
      approveStatusList:[
        {
          value: 1,
          label: "等待审核",
        },
        {
          value: 2,
          label: "报名不通过",
        },
        {
          value: 3,
          label: "报名通过",
        },
      ],
      activityList:[],
      activity: {},
      showModal: false,
      loading: true,
      modalLoading: false,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
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
        let result = await activityApi.getActivityRelationByRelAndPage({
          ...this.searchData,
          orders: [
              {
                "asc": false,
                "column": "id"
              },
          ],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isShow: true,
        });
        this.loading = false;
        console.log(result.data)
        this.activityList = result.data.list;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        console.error(e);
      }
    },
    // 参与活动
    async join() {
      try {
        this.modalLoading = true;
        let result = await activityApi.joinActivity({
          id: this.activity.id,
          joinStatus: 1
        });
        this.modalLoading = false;
        this.showModal = false;
        this.$Message.success("参与成功");
      } catch (e) {
        this.$Message.error("参与失败");
        this.showModal = false;
        console.error(e);
      }
    },
    cel() {
      this.showModal = false;
    },
    // 获取活动详情
    async getActivityDetail(data) {
      try {
        this.loading = true;
        let result = await activityApi.getActivityRelationById(data.id);
        this.activity = result.data;
        this.showModal = true;
        this.loading = false;
      } catch (e) {
        this.$Message.error("获取信息失败");
        console.error(e);
      }
    },
    //限制文本显示的字数
    controlTextList (list) {
      list.forEach((item, index) => {
        if (item.activityRemark.length > 200) { // 限制字数
          list[index].activityRemark = item.activityRemark.slice(0, 200) + '...'
        }
      })
      return list;
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
    },
  }
};
</script>
