<template>
  <Modal :footer-hide="true" :width="700" title="用户详情" v-model="isShowDetailModal">
    <Form :label-width="80">
      <Row :gutter="16">
        <Col span="8">
          <FormItem label="姓名:">{{detail.actualName}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="登录名:">{{detail.loginName}}</FormItem>
        </Col>
        <Col span="8">
          <FormItem label="手机:">{{detail.phone}}</FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>
</template>
<script>
export default {
  name: 'EmployeeTableDetail',
  components: {},
  props: {},
  data() {
    return {
      isShowDetailModal: false,
      detail: {}
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    showModal(detail) {
      this.isShowDetailModal = true;
      this.detail = detail;
    }
  }
};
</script>
<style lang="less" scoped>
</style>
