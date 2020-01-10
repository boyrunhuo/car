<template>
  <div id="personalCenter">
    <TopBar :title="'个人中心'" @goBack="goBack"></TopBar>
    <div class="personal-center-wrap">
      <div class="personal-msg">
        <div class="personal-basic-msg" v-if="userInfo.name">
          <p class="title">个人信息:</p>
          <div>
            <span class="name">{{userInfo.name}}({{userInfo.marsId}})</span>
            <!-- <span class="sex">{{userInfo.sex | sexFilter}}</span> -->
            <span class="department">{{userInfo.department}}</span>
          </div>
        </div>
        <div class="car-msg" v-if="userInfo.carplate">
          <p class="title">车辆信息:</p>
          <p>
            <span>{{userInfo.modelOfCar}}({{userInfo.carColor}})</span>
            <span class="carplate">{{userInfo.carplate}}</span>
          </p>
        </div>
      </div>
      <div class="personal-center-card" @click="goToMyList">
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
      <div class="personal-center-card" @click="goToBill">
        <svg-icon icon-class="bill" />
        <div>
          <p>我的账单</p>
          <p>查看账单详情</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar";
import routeMixin from "@/mixin/routeMixin";
import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);

export default {
  data() {
    return {
      userInfo: {}
    };
  },
  mixins: [routeMixin],
  beforeRouteLeave(to, from, next) {
    if (to.name !== "home") {
      this.setRouteHistory();
    }
    next();
  },
  created() {
    this.getInfo();
  },
  filters: {
    sexFilter(val) {
      return val ? "男" : "女";
    }
  },
  methods: {
    goBack() {
      this.removeRouteHistory();
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
      this.$router.push({
        name: "mangeCommonRoute"
      });
    },
    goToBill() {
      this.$router.push({
        name: "bill"
      });
    },
    getInfo() {
      //获取用户详情
      this.$http
        .get(`/user/get_info`)
        .then(res => {
          this.userInfo = res.data;
        })
        .catch(err => {
          Toast(err.data.message || "获取个人信息失败");
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
    position: relative;
    top: 0.4rem;
    padding: 0.1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .personal-msg {
      width: 100%;
      background-color: #fff;
      padding: 0.1rem;
      border-radius: 0.05rem;
      .personal-basic-msg {
        & > div {
          & > span {
            margin-left: 0.2rem;
          }
          & > span:nth-child(1) {
            margin-left: 0;
          }
        }
      }
      .car-msg {
        margin-top: 0.1rem;
        .carplate {
          margin-left: 0.2rem;
        }
      }
      .title {
        font-weight: 600;
        margin-bottom: 0.1rem;
      }
    }
    .personal-center-card {
      background-color: #fff;
      width: 1.4rem;
      border-radius: 0.05rem;
      padding: 0.1rem;
      margin-top: 0.1rem;
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