<template>
  <div>
    <Card class="warp-card" dis-hover>
      <Form :label-width="80" :model="form" :rules="ruleInline">
        <FormItem class="marginBottom20" label="标题" prop="title">
          <Input class="addressWidth" placeholder="请输入标题" v-model="form.newsTitle"></Input>
        </FormItem>
        <FormItem label="内容" prop="contant">
          <div id="editor"></div>
        </FormItem>
        <FormItem label="社团" prop="club">
          <Select v-model="form.positionId" filterable><!-- 支持搜索 -->
              <Option v-for="item in positionList" :value="item.id" :key="item.positionName">{{item.positionName}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <ButtonGroup>
          <Button
            :loading="isShowSaveButtonLoading"
            @click="sendNews"
            type="primary"
            v-privilege="'news-edit'"
          >发布</Button>
          <Button
            :loading="isShowSaveButtonLoading"
            @click="addOrUpdateNews"
            type="default"
            v-privilege="'news-edit'"
          >保存</Button></ButtonGroup>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
import WangEditor from 'wangeditor';
import Cookies from 'js-cookie';
import config from '@/config';
import { fileApi } from '@/api/file';
import { newsApi } from '@/api/news';
import { positionApi } from '@/api/position';

const baseUrl = config.baseUrl.apiUrl;
export default {
  name: 'NewsEdit',
  components: {},
  props: {},
  data() {
    let baseUrl = process.env.VUE_APP_URL;
    return {
      // loading
      isShowSaveButtonLoading: false,
      positionList:[{id:-1,positionName:"未获取到社团"}],
      // 上传
      upload: {
        uploadList: [],
        data: {
          type: 'NEWS_PIC'
        }
      },
      // 富文本编辑器对象
      editor: null,
      // 基础路径
      baseUrl: baseUrl,
      // 传输内容
      form: {
        title: '',
        content: ''
      },
      // 验证规则
      ruleInline: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        contant: [
          { required: true, message: '请输入内容', trigger: 'blur' },
        ],
      }
    };
  },
  computed: {},
  watch: {},
  filters: {},
  created() {},
  mounted() {
    this.initEditor();
    this.getNewsDetails();
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
    // 富文本初始化
    initEditor() {
      let g = this;
      g.editor = new WangEditor('#editor');
      g.editor.customConfig = {
        // 功能键
        menus: [
          'head', // 标题
          'bold', // 粗体
          'fontSize', // 字号
          'fontName', // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          'backColor', // 背景颜色
          'list', // 列表
          'justify', // 对齐方式
          'emoticon', // 表情
          //'image', // 插入图片
          'table', // 表格
          'undo', // 撤销
          'redo' // 重复
        ],
        showLinkImg: false,
        uploadImgShowBase64: false,
        // 上传路径
        uploadImgServer: g.baseUrl + fileApi.fileUploadUrl + '1',
        // 上传文件名key
        uploadFileName: 'file',
        // 参数
        uploadImgParams: {
          'x-access-token': Cookies.get('token')
        },
        uploadImgHooks: {
          customInsert: function(insertImg, result, editor) {
            insertImg(result.data.url);
          }
        }
      };
      g.editor.create();
    },
    // 新增或保存新闻
    addOrUpdateNews() {
      this.saveOrSendNews(false);
    },
    // 发布新闻
    sendNews(){
      this.saveOrSendNews(true);
    },
    // 保存或发布新闻
    async saveOrSendNews(send) {
      // 富文本
      this.form.newsText = this.editor.txt.html();
      let type = this.$route.params.type;
      if(send){
        this.form.status = 1;
      }else {
        this.form.status = 0;
      }
      try {
        this.$Spin.show();
        this.isShowSaveButtonLoading = true;
        let res;
        if (type == 'add') {
          // 新增
          res = await newsApi.addNews(this.form);
        } else {
          // 编辑
          res = await newsApi.updateNews(this.form);
        }
        this.isShowSaveButtonLoading = false;
        this.$Spin.hide();
        if(send){
          this.$Message.success('发布成功');
        }else {
          this.$Message.success('保存成功');
        }

        this.goBack();
      } catch (error) {
        //TODO zhuoda sentry
        console.error(e);
        this.isShowSaveButtonLoading = false;
        this.$Spin.hide();
      }
    },
    // 获取详情
    async getNewsDetails() {
      this.$Spin.show();
      try {
        if(this.$route.params.type == 'edit'){
          this.form = this.$route.params.newsData;
          this.editor.txt.html(this.$route.params.newsData.newsText);
          this.isAdd = false;
        }
      } catch (error) {
        //TODO zhuoda sentry
        console.error(e);
      } finally {
        this.$Spin.hide();
      }
    },
    // 获取社团列表
    async getPositionList() {
      this.$Spin.show();
      try {
        let res = await positionApi.getAdmin();
        this.positionList = res.data;
        alert(getPositionList.get(0));
      } catch (error) {
        console.error(e);
      } finally {
        this.$Spin.hide();
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
