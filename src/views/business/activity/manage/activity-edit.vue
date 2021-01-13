<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form :label-width="80" :model="form" :rules="ruleInline">
        <FormItem class="marginBottom20" label="活动名称:" prop="name">
          <Input class="addressWidth" placeholder="活动名称" v-model="form.activityName"></Input>
        </FormItem>
        <FormItem label="活动介绍:" prop="remark">
          <Input class="" type="textarea" placeholder="请输入内容" v-model="form.activityRemark"></Input>
        </FormItem>
        <FormItem v-if="isAdd" class="marginBottom20" label="举办社团:" prop="club">
          <Select v-model="form.positionId" filterable><!-- 支持搜索 -->
            <Option v-for="item in positionList" :value="item.id" :key="item.id">{{item.positionName}}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="!isAdd" class="marginBottom20" label="举办社团:" prop="club">
          <div>{{form.positionName}}</div>
        </FormItem>
        <FormItem class="marginBottom20" label="活动地点:" prop="place">
          <Input class="addressWidth" placeholder="活动地点" v-model="form.place"></Input>
        </FormItem>
        <FormItem class="marginBottom20" label="开始时间:" prop="startTime">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="form.startTime"
            placeholder="选择开始时间" style="width: 200px">
          </DatePicker>
        </FormItem>
        <FormItem class="marginBottom20" label="结束时间:" prop="stopTime">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="form.stopTime"
            placeholder="选择结束时间" style="width: 200px">
          </DatePicker>
        </FormItem>
        <FormItem class="marginBottom20" label="人数上限:" prop="activityMaximum">
          <Input type="number" class="marginBottom20" placeholder="请输入内容" v-model="form.activityMaximum"></Input>
        </FormItem>

        <FormItem>
          <ButtonGroup>
            <Button
              v-if="isAdd"
              :loading="isButtonLoading"
              @click="applyActivity"
              type="primary"
              v-privilege="'activity-edit'"
            >申请</Button>
            <Button
              v-if="!isAdd"
              :loading="isButtonLoading"
              @click="updateActivity"
              type="primary"
              v-privilege="'activity-edit'"
            >保存</Button>
          </ButtonGroup>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import WangEditor from 'wangeditor';
import Cookies from 'js-cookie';
import config from '@/config';
import { activityApi } from '@/api/activity';
import { positionApi } from '@/api/position';

const baseUrl = config.baseUrl.apiUrl;
export default {
  name: 'ActivityEdit',
  components: {},
  props: {},
  data() {
    let baseUrl = process.env.VUE_APP_URL;
    return {
      isAdd:true,
      isButtonLoading: false,
      positionList:[{id:-1,positionName:"未获取到社团"}],
      form: {},
      // 验证规则
      ruleInline: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        club: [],
        place: [{ required: true, message: '不能为空', trigger: 'blur' }],
        startTime: [],
        stopTime: [],
        activityMaximum: [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            pattern: /^[0-9]*$/,
            message: '必须为正整数',
            trigger: 'blur'
          }
        ],
        remark: [{ required: true, message: '不能为空', trigger: 'blur' }],
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
    this.getActivityDetails();
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
    // 后退
    goBack() {
      this.$router.closeCurrentPage();
    },
    convertDateTime(d){
      function addDateZero(num) {
        return (num < 10 ? "0" + num : num);
      }
      return d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
    },
    // 申请活动
    async applyActivity(){
      try {
        this.$Spin.show();
        this.isButtonLoading = true;
        this.form.startTime = this.convertDateTime(this.form.startTime);
        this.form.stopTime = this.convertDateTime(this.form.stopTime);
        let res = await activityApi.applyActivityApprove(this.form);
        this.isButtonLoading = false;
        this.$Spin.hide();
        this.$Message.success("活动申请已提交");
        this.goBack();
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
        this.isButtonLoading = false;
        this.$Spin.hide();
      }
    },
    // 保存活动
    async updateActivity() {
      try {
        this.$Spin.show();
        this.isButtonLoading = true;
        this.form.startTime = this.convertDateTime(this.form.startTime);
        this.form.stopTime = this.convertDateTime(this.form.stopTime);
        let res = await activityApi.updateActivity(this.form);
        this.isButtonLoading = false;
        this.$Spin.hide();
        this.$Message.success("活动已保存");
        this.goBack();
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
        this.isButtonLoading = false;
        this.$Spin.hide();
      }
    },
    // 获取详情
    async getActivityDetails() {
      this.$Spin.show();
      try {
        if(this.$route.params.type == 'edit'){
          this.form = this.$route.params.activityData;
          this.isAdd = false;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.$Spin.hide();
      }
    },
    // 获取社团列表
    async getPositionList() {
      //this.$Spin.show();
      try {
        let res = await positionApi.getAdmin();
        this.positionList = res.data;
      } catch (e) {
        console.error(e);
      } finally {
        //this.$Spin.hide();
      }
    },
  }
};
</script>
<style lang="less" scoped>
.addressWidth {
  width: 350px;
}
.marginTop20 {
  margin-top: 20px;
}
.marginBottom20 {
  margin-bottom: 20px;
}
</style>
