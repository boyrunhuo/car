<template>
  <div class="home-header">
    <el-avatar icon="el-icon-user-solid"></el-avatar>
    <!-- <p class="title">益出行</p> -->
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.home-header {
  background-color: #409eff;
  height: 1.4rem;
  padding: .1rem .2rem;
  .el-avatar--icon {
    position: absolute;
    height: 0.4rem;
    width: 0.4rem;
  }
  .title {
    text-align: center;
    color: #fff;
    font-size:.18rem;
    font-weight: 500;
    height: 0.4rem;
    line-height: 0.4rem;
  }
}
</style>