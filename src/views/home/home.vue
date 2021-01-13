<template>
  <div>
    <Row>
      <Carousel autoplay autoplay-speed="5000" height="420px" v-model="value1" loop>
        <CarouselItem>
            <div class="demo-carousel">
              <img class="carousel-img" src="http://www.hziee.edu.cn/uploadfile/linklogo/2020-12-22/5fe183ce1ec2c.jpg"/>
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
              <img class="carousel-img" src="http://www.hziee.edu.cn/uploadfile/linklogo/2020-12-19/5fddbdecc4b34.png"/>
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
              <img class="carousel-img" src="http://www.hziee.edu.cn/uploadfile/linklogo/2020-12-01/5fc58fdebc0d6.jpg"/>
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
              <img class="carousel-img" src="http://www.hziee.edu.cn/uploadfile/linklogo/2020-11-27/5fc04eb1f0c08.png"/>
            </div>
        </CarouselItem>
      </Carousel>
      <HomeCard desc="Pending transaction" title="新闻">
        <News/>
      </HomeCard>
    </Row>
  </div>
</template>

<script>
import News from '@/views/business/news/news-show.vue';

export default {
  name: 'Home',
  components: {
    News
  },
  props: {},
  data() {
    return {
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
  methods: {}
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
