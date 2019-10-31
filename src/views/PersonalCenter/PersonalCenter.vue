<template>
  <div id="personalCenter">
    <TopBar :title="'个人中心'" @goBack="goBack"></TopBar>
    <div class="personal-center-wrap">
      <div class="personal-center-card" @click="goToMyList">
        <!-- <img src="@/assets/img/list.png" /> -->
        <svg-icon icon-class="list" />
        <div>
          <p>我的订单</p>
          <p>查看行程详情</p>
        </div>
      </div>
      <div class="personal-center-card" @click="goToCommonRouteList">
        <svg-icon icon-class="route" />
        <div>
          <p>常用路线</p>
          <p>查看常用路线</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar";
import routeMixin from '@/mixin/routeMixin'

export default {
  data() {
    return {};
  },
  mixins: [routeMixin],

  methods: {
    goBack() {
      this.$router.push({
        name: "home"
      });
    },
    goToMyList() {
      this.$router.push({
        name: "orderList"
      });
    },
    goToCommonRouteList() {
      this.setRouteHistory()
      this.$router.push({
        name: "mangeCommonRoute"
      });
    }
  },
  components: {
    TopBar
  }
};
</script>
<style lang="scss" scoped>
#personalCenter {
  background-color: #e8e8e8;
  height: 100vh;
  .personal-center-wrap {
    margin-top: 0.4rem;
    padding: 0.1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .personal-center-card {
      background-color: #fff;
      width: 1.4rem;
      border-radius: 0.05rem;
      padding: 0.1rem;
      & > div {
        display: inline-block;
        margin-left: 0.1rem;
        & > p:nth-child(2) {
          color: #868181;
          font-size: 0.12rem;
        }
      }
      & > svg {
        width: 0.3rem;
        height: 0.37rem;
        vertical-align: bottom;
        fill: currentColor;
        overflow: hidden;
      }
    }
  }
}
</style>