<template>
  <div id="commonRoute">
    <div class="common-route-header">
      <span>
        <b>常用路线</b>
      </span>
      <span>
        <span>添加</span>
        <span class="mange-btn" v-if="commonRouteList.length > 0">管理</span>
      </span>
    </div>
    <div class="common-route-list">
      <p v-if="commonRouteList.length === 0">添加常用路线可快速约车</p>
      <ul>
        <li v-for="route in commonRouteList" :key="route">{{route}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      commonRouteList: []
    };
  }
};
</script>
<style lang="scss" scoped>
#commonRoute {
  width: 3.4rem;
  .common-route-header {
    & > span:nth-child(2) {
      float: right;
      & > span {
        padding: 0 0.1rem;
        font-size:.12rem;
      }
      .mange-btn {
        border-left: 0.02rem solid black;
      }
    }
  }
  .common-route-list {
    background-color: #8cc5ff;
    padding:.1rem;
    margin-top:.1rem;
    & > p {
      color: #928f8f;
      text-align:center;
      font-size:.12rem;
    }
  }
}
</style>