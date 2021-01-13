<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem class="marginBottom20" v-privilege="'fund-apply-query'" prop="club">
          <Select v-model="searchData.positionId" clearable placeholder="选择社团" filterable><!-- 支持搜索 -->
            <Option v-for="item in positionList" :value="item.id" :key="item.id">{{item.positionName}}</Option>
          </Select>
        </FormItem>
        <FormItem v-privilege="'fund-apply-query'">
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
              v-privilege="'fund-apply-query'"
            >查询</Button>
            <Button
              @click="showAddModal"
              v-privilege="'fund-apply-query'"
            >申请经费</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <Table :columns="fundColumns" :data="fundData" :loading="loading" border></Table>

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
    <Modal title="经费申请" v-model="showModal" >
      <p>申请理由：{{fund.remark}}</p>
      <p>申请社团：{{fund.positionName}}</p>
      <p>经费数额：{{fund.fund}}</p>
      <p>申请时间：{{fund.createTime}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">确定</Button>
      </div>
    </Modal>
    <!-- 查看经费 -->

    <!-- 编辑经费 -->
    <Modal
      :loading="saveLoading"
      title="添加经费"
      @on-cancel="cancelSave"
      @on-ok="addFund"
      v-model="addModal"
    >
      <Form :label-width="80" :model="formData" ref="formRef" :rules="formValidate" v-privilege="'fund-apply-add'">
        <FormItem label="申请理由" prop="remark">
          <Input
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入申请理由"
            type="textarea"
            v-model="formData.remark"
          ></Input>
        </FormItem>
        <FormItem label="申请社团" class="marginBottom20" prop="club">
          <Select v-model="formData.positionId" clearable placeholder="选择社团" filterable><!-- 支持搜索 -->
            <Option v-for="item in positionList" :value="item.id" :key="item.id">{{item.positionName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="申请金额" prop="fund">
          <Input placeholder="请输入申请金额" v-model="formData.fund"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">取消</Button>
        <Button type="primary" size="large" :loading="modalLoading" @click="addFund">提交</Button>
      </div>
    </Modal>
    <!-- 编辑经费 -->
  </div>
</template>

<script>
import { fundApi } from '@/api/fund';
import { NOTICE_STATUS } from '@/constants/notice';
import { positionApi } from '@/api/position';

export default {
  name: 'FundApply',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        timeType: 0,
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
      fundData:[],
      modalType: 'add',
      showModal: false,
      addModal: false,
      fund:{},
      loading: true,
      modalLoading: false,
      saveLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formData: {},
      // table表头
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
          key: 'status',
          render: (h, params) => {
            return h(
              'span', 
              params.row.approveStatus == 3 ? '通过' : '等待审核或未通过'
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
                    value: 'fund-apply-detail'
                  }
                ],
                action: () => {
                  this.getFundDetail(params.row)
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
        remark: [{ required: true, message: '请输入经费申请理由', trigger: 'blur' }],
        club: [],
        fund: [
          { required: true, message: '请输入经费', trigger: 'blur' },
          { pattern: /^[0-9]+\.{0,1}[0-9]{0,2}$/, message: '必须为小数或整数', trigger: 'blur'}
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
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 获取经费详情
    getFundDetail(data) {
      this.loading = true;
      this.fund = data;
      this.showModal = true;
      this.loading = false;
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
      this.getFundList();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getFundList();
    },
    // 删除经费
    async deleteFund(id) {
      this.$Spin.show();
      let result = await fundApi.deleteFund(id);
      this.$Spin.hide();
      this.$Message.success('删除经费成功!');
      this.getFundList();
    },
    // 取消
    cel() {
      this.showModal = false;
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getFundList();
    },
    // 经费申请
    showAddModal(){
      this.addModal = true;
    },
    addFund() {
      try {
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            this.applyFund();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    async applyFund(){
      try {
        this.loading = true;
        let result = await fundApi.applyFund(this.formData);
        this.$Message.success('已提交申请');
        this.addModal = false;
        this.getFundList();
        this.loading = false;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
        this.loading = false;
      }
    },
    // 取消添加/修改
    cancelSave() {
      this.addModal = false;
      this.$refs['formRef'].resetFields();
    },
  }
};
</script>
