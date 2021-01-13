<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="content">
      <header class="logo center">
        <img alt
             src="../../assets/images/login-logo.png" />
      </header>
      <div class="form-con">
        <login-form @on-success-valid="handleSubmit"></login-form>
      </div>
      <footer class="center footerDesc">2020毕业设计 校园社团管理系统设计与实现 @hxy</footer>
    </div>
  </div>
</template>
<script>
import LoginForm from './components/login-form';
import { mapActions } from 'vuex';
import $ from 'jquery';
import { lonWave, canvasParticle } from './canvas';
export default {
  name: 'login',
  props: {},
  components: {
    LoginForm
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  filters: {},
  created () {},
  mounted () {
    this.$Spin.hide();
  },
  methods: {
    ...mapActions(['handleLogin']),
    // 提交
    handleSubmit (params) {
      this.handleLogin(params).then(res => {
        this.$router.push({
          name: this.$config.homeName
        });
      });
    }
  }
};
</script>
