<template>
  <div id="personalCenter">
    <div class="personal-center-header">
      <i class="el-icon-arrow-left" @click="goBack"></i>
      <p>个人中心</p>
    </div>
    <div class="personal-center-wrap">
      <div class="personal-center-card" @click="goToMyList">
        <img src="@/assets/img/list.png" />
        <div>
          <p>我的订单</p>
          <p>查看行程详情</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "home"
      });
    },
    goToMyList() {
        this.$router.push({
            name: "orderList"
        })
    }
  }
};
</script>
<style lang="scss" scoped>
$release-router-header-height: 0.4rem;

#personalCenter {
  background-color: #e8e8e8;
  height: 100vh;
  .personal-center-header {
    height: $release-router-header-height;
    line-height: $release-router-header-height;
    background-color: #fff;
    & > p {
      height: $release-router-header-height;
      line-height: $release-router-header-height;
      text-align: center;
    }
    & > i {
      height: $release-router-header-height;
      line-height: $release-router-header-height;

      position: absolute;
      left: 0.1rem;
    }
  }
  .personal-center-wrap {
    margin-top: 0.1rem;
    padding: .1rem;
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
    }
  }
}
</style>