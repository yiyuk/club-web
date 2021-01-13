<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'position-manage-query'">
          <Input placeholder="请输入社团名" v-model="searchData.positionName"></Input>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getPositionByPage"
              icon="ios-search"
              type="primary"
              v-privilege="'position-manage-query'"
            >查询</Button>

          <Button
            @click="showModal"
            v-privilege="'position-manage-add'"
          >新增社团</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <Table :columns="positionColumns" :data="positionData" :loading="loading" border></Table>

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

    <!-- 编辑社团 -->
    <Modal
      :loading="saveLoading"
      :title="modalType=='add'?'添加社团':'修改社团信息'"
      @on-cancel="cancelSave"
      @on-ok="addOrUpdatePosition"
      v-model="editModal"
    >
      <Form :label-width="80" :model="formData" ref="formRef" :rules="formValidate">
        <FormItem label="标题" prop="positionName">
          <Input placeholder="请输入社团名称" v-model="formData.positionName"></Input>
        </FormItem>
        <FormItem label="内容" prop="remark">
          <Input
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="请输入社团介绍"
            type="textarea"
            v-model="formData.remark"
          ></Input>
        </FormItem>
      </Form>
      </Modal>
    <!-- 编辑社团 -->
  </div>
</template>

<script>
import { positionApi } from '@/api/position';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'PositionManage',
  components: {},
  props: {},
  data() {
    return {
      searchData: {},
      modalType: 'add',
      approveStatusList:[
        {
          value: 1,
          label: "等待审核",
        },
        {
          value: 3,
          label: "申请通过",
        },
      ],
      positionList:[],
      positionData:[],
      modalType: 'add',
      editModal: false,
      position:{},
      loading: true,
      modalLoading: false,
      saveLoading: true,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formData: {},
      // table表头
      positionColumns: [
        {
          title: 'ID',
          width: 60,
          key: 'id'
        },
        {
          title: '社团标题',
          key: 'positionName'
        },
        {
          title: '创建时间',
          key: 'createTime',
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
                title: '修改',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-manage-detail'
                  }
                ],
                action: () => {
                  this.getPositionDetail(params.row);
                }
              },
              {
                title: '删除',
                directives: [
                  {
                    name: 'privilege',
                    value: 'position-manage-delect'
                  }
                ],
                action: () => {
                  this.$Modal.confirm({
                    title: '删除社团',
                    content: '确认删除该社团吗？',
                    onOk: () => {
                      this.delectPosition(params.row.id);
                    }
                  });
                }
              },
            ];
            return this.$tableAction(h, btns);
          }
        },
       ],
      formValidate: {
        positionName: [{ required: true, message: '请输入社团标题', trigger: 'blur' }],
        remark: [
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
    //this.getPositionList();
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
        let result = await positionApi.getPositionByPage({
          ...this.searchData,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isShow: false,
        });
        this.loading = false;
        console.log(result);
        this.positionData = result.data.list;
        this.status = this.searchData.status;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
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
    // 获取社团详情
    async getPositionDetail(data) {
      console.log("开始获取数据");
      try {
        this.loading = true;
        let result = await positionApi.getPositionById(data.id);console.log("获取数据");
        this.loading = false;
        this.formData = result.data;
        this.modalType = 'edit',
        this.editModal = true;
      } catch (e) {
        console.error(e);
      }
    },
    //限制文本显示的字数
    controlTextList (list) {
      list.forEach((item, index) => {
        if (item.remark.length > 20) { // 限制字数
          list[index].remark = item.remark.slice(0, 20) + '...'
        }
      })
      return list;
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
      this.editModal = false;
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getPositionByPage();
    },
    showModal(){
      this.modalType = 'add';
      this.editModal = true;
    },
    // 编辑社团
    addOrUpdatePosition() {
      try {
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            if (this.modalType == 'add') {
              this.addPosition();
            } else {
              this.editPosition();
            }
          }
        });
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
      }
    },
    // 修改社团
    async editPosition() {
      try {
        this.loading = true;
        let result = await positionApi.updatePosition(this.formData);
        this.$Message.success('修改成功');
        this.editModal = false;
        this.getPositionByPage();
        this.loading = false;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
        this.loading = false;
      }
    },
    // 新增社团
    async addPosition() {
      try {
        this.loading = true;
        let result = await positionApi.addPositionApprove(this.formData);
        this.$Message.success('申请成功');
        this.editModal = false;
        this.getPositionByPage();
        this.loading = false;
      } catch (e) {
        //TODO zhuoda sentry
        console.error(e);
        this.loading = false;
      }
    },
    // 删除
    async delectPosition(id){
      try {
        this.loading = true;
        let result = await positionApi.deletePosition(id);
        this.$Message.success('删除成功');
        this.getPositionByPage();
        this.loading = false;
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    },
    // 取消添加/修改
    cancelSave() {
      this.editModal = false;
      this.$refs['formRef'].resetFields();
    },
  }
};
</script>
