<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form class="tools" inline>
        <FormItem v-privilege="'position-show-query'">
          <Input placeholder="请输入社团名称" v-model="searchData.positionName"></Input>
        </FormItem>
        <FormItem>
          <ButtonGroup>
            <Button
              @click="getPositionList"
              icon="ios-search"
              type="primary"
              v-privilege="'position-show-query'"
            >查询</Button>
          </ButtonGroup>
        </FormItem>
      </Form>

      <List item-layout="vertical" border="false" size="small" split="true" v-privilege="'position-show-detail'">
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
      v-model="showModal"
    >
      <p>社团介绍：{{position.remark}}</p>
      <div slot="footer">
        <Button size="large" :loading="modalLoading" @click="cel">取消</Button>
        <Button type="primary" size="large" :loading="modalLoading" @click="apply">加入社团</Button>
      </div>
    </Modal>
    <!-- 查看社团 -->
  </div>
</template>

<script>
import { positionApi } from '@/api/position';
import { NOTICE_STATUS } from '@/constants/notice';

export default {
  name: 'PositionShow',
  components: {},
  props: {},
  data() {
    return {
      searchData: {
        positionName: '',
      },
      positionList:[],
      position: {},
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
        let result = await positionApi.getPositionByPage({
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
          positionId: this.position.id
        });
        this.modalLoading = false;
        this.showModal = false;
        this.$Modal.success({
          title: "申请成功",
        });
      } catch (e) {
        this.modalLoading = false;
        this.showModal = false;
        console.error(e);
      }
    },
    cel() {
      this.showModal = false;
    },
    // 获取社团详情
    getPositionDetail(data) {
      this.position = data;
      this.showModal = true;
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
  }
};
</script>
