<template>
  <div class="home-header">
    <div>
      <el-avatar icon="el-icon-user-solid"  @click.native="goToPersonalCenter"></el-avatar>
      <span class="money-rule" @click="checkMoneyRule">系统计费规则</span>
    </div>
    <!-- <p class="title">益出行</p> -->
  </div>
</template>
<script>
import Vue from "vue";
import { Dialog } from "vant";
Vue.use(Dialog);

export default {
  data() {
    return {};
  },
  methods: {
    goToPersonalCenter() {
      this.$router.push({
        name: "personalCenter"
      });
    },
    checkMoneyRule() {
      this.$http
        .get(`/order/get_bill_rules`)
        .then(res => {
          Dialog.alert({
            message: res.data.rules
          }).then(() => {});
        })
        .catch(err => {});
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
  .money-rule {
    float: right;
    font-size: 0.12rem;
    height: 0.2rem;
    line-height: 0.2rem;
    color: #fff;
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