<template>
  <div class="home-header">
    <div @click="goToOrder">
      <el-avatar icon="el-icon-user-solid" ></el-avatar>
    </div>
    <!-- <p class="title">益出行</p> -->
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goToOrder() {
      this.$router.push({
        name: 'personalCenter'
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.home-header {
  background-color: #409eff;
  height: 1.4rem;
  padding: 0.1rem 0.2rem;
  .el-avatar--icon {
    position: absolute;
    height: 0.4rem;
    width: 0.4rem;
  }
  .title {
    text-align: center;
    color: #fff;
    font-size: 0.18rem;
    font-weight: 500;
    height: 0.4rem;
    line-height: 0.4rem;
  }
}
</style>