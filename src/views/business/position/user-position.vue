<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'user-position-query'">
          <Input placeholder="请输入社团名称" v-model="searchData.positionName"></Input>
        </FormItem>
        <FormItem v-privilege="'user-position-query'">
          <Select placeholder="选择状态" v-model="searchData.status" clearable style="width:130px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getPositionList"
              icon="ios-search"
              type="primary"
              v-privilege="'user-position-query'"
            >查询</Button>
            <Button
              @click="showAddModal"
              v-privilege="'position-manage-add'"
            >新增社团</Button>
            </ButtonGroup>
          </ButtonGroup>
        </FormItem>
      </Form>

      <List item-layout="vertical" size="small" border v-privilege="'user-position-detail'">
        <div v-for="item in positionList" data-id="item.id">
          <div @click="getPositionDetail(item)">
            <ListItem>
              <ListItemMeta :title="item.positionName" :description="item.remark" />
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

    <!-- 查看社团 -->
    <Modal
      :title="position.positionName"
      v-model="isShowModal"
    >
      <p>社团介绍：{{position.remark}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">确定</Button>
        <Button v-if="status === 3" type="primary" size="large" :loading="modalLoading" @click="apply">退出社团</Button>
      </div>
    </Modal>
    <!-- 查看社团 -->

    <!-- 编辑社团 -->
    <Modal
      :loading="modalLoading"
      title="添加社团"
      @on-cancel="cancelSave"
      @on-ok="addOrPosition"
      v-model="addModal"
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
  name: 'UserPosition',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        positionName: '',
      },
      statusList: [
        {
          value:1,
          label:'等待入团'
        },
        {
          value:3,
          label:'已加入的社团'
        },
        {
          value:4,
          label:'等待退团'
        },
        {
          value:6,
          label:'已退出的社团'
        },
        {
          value:7,
          label:'我管理的社团'
        },
      ],
      status: 2,
      positionList:[],
      position: {},
      formData: {},
      isShowModal: false,
      addModal: false,
      loading: true,
      modalLoading: false,
      pageNum: 1,
      pageSize: 10,
      pageTotal: 0,
      formValidate: {
        remark: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        positionName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
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
    async getPositionList() {
      try {
        this.loading = true;
        let result = await positionApi.getPositionRelationByPage({
          ...this.searchData,
          orders: [
              {
                "asc": false,
                "column": "id"
              },
          ],
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          isShow: false,
        });
        this.status = this.searchData.status;
        this.loading = false;
        console.log(result);
        this.positionList = result.data.list;
        this.pageTotal = result.data.total;
        this.pageNum = result.data.pageNum;
        this.pageSize = result.data.pageSize;
      } catch (e) {
        console.error(e);
      }
    },
    async apply() {
      try {
        this.modalLoading = true;
        let result = await positionApi.applyPositionRelation({
          id: this.position.id
        });
        this.modalLoading = false;
        this.isShowModal = false;
        this.$Modal.success({
          title: "申请成功",
        });
        this.getPositionList();
      } catch (e) {
        console.error(e);
      }
    },
    cel() {
      this.isShowModal = false;
    },
    // 获取社团详情
    getPositionDetail(data) {
      this.position = data;
      this.isShowModal = true;
    },
    //限制文本显示的字数
    controlTextList (list) {
      list.forEach((item, index) => {
        if (item.positionRemark.length > 200) { // 限制字数
          list[index].positionRemark = item.positionRemark.slice(0, 200) + '...'
        }
      })
      return list;
    },
    // 分页
    changePage(pageNum) {
      this.pageNum = pageNum;
      this.getPositionList();
    },
    // 更改分页查询条数
    changePageSize(pageSize) {
      this.pageNum = 1;
      this.pageSize = pageSize;
      this.getPositionList();
    },
    // 重置
    refresh() {
      this.pageNum = 1;
      this.searchData.title = '';
      this.getPositionList();
    },
    showAddModal(){
      this.addModal = true;
    },
    // 编辑社团
    addOrPosition() {
      try {
        this.$refs['formRef'].validate(valid => {
          if (valid) {
            this.addPosition();
          }
        });
      } catch (e) {
        console.error(e);
      }
    },
    async addPosition(){
      try {
        this.loading = true;
        let result = await positionApi.addPosition(this.formData);
        this.$Message.success('添加成功');
        this.editModal = false;
        this.getPositionByPage();
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
  }
};
</script>
