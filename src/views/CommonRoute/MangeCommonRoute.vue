<template>
  <div id="mangeCommonRoute">
    <TopBar :title="'常用路线管理'" @goBack="goBack"></TopBar>
    <div class="mange-common-route-wrap">
      <div v-for="route in commonRouteList" :key="route.orderId" class="route-item">
        <van-swipe-cell>
          <p class="route-name common-start-pointer">
            <span class="pointer"></span>
            <span>{{route.newOriginName}}</span>
          </p>
          <p class="route-name common-end-pointer">
            <span class="pointer"></span>
            <span>{{route.newDestinationName}}</span>
          </p>
          <template slot="right">
            <el-button type="primary" @click="editRoute(route)">编辑</el-button>
            <el-button type="danger" @click="deleteRoute(route)">删除</el-button>
          </template>
        </van-swipe-cell>
      </div>
      <p class="tips">
        <i class="el-icon-info"></i>最多设置5条常用路线
      </p>
    </div>
    <el-button
      id="submitAddBtn"
      :type="btnType"
      :disabled="btnDisabled"
      @click="addCommonRoute"
    >添加常用路线</el-button>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar";
import Vue from "vue";
import { Toast, SwipeCell, Button, Dialog } from "vant";
import utils from "@/utils";
import routeMixin from "@/mixin/routeMixin";
Vue.use(Toast).use(SwipeCell).use(Button).use(Dialog);


export default {
  data() {
    return {
      commonRouteList: [],
      btnType: "primary",
      btnDisabled: false,
      fromRoute: ""
    };
  },
  mixins: [routeMixin],
  components: {
    TopBar
  },
  created() {
    this.getCommonRouteList();
    this.fromRoute = this.getRouteHistory();
  },

  methods: {
    goBack() {
      if (
        this.fromRoute === "personalCenter" ||
        this.fromRoute === "mangeCommonRoute"
      ) {
        this.$router.push({
          name: "personalCenter"
        });
      } else {
        this.$router.push({
          name: "home"
        });
      }
    },
    getCommonRouteList() {
      this.commonRouteList = [];
      this.$http
        .get(`/order/get_regular_order`)
        .then(res => {
          this.commonRouteList = res.data.orderList;
          this.commonRouteList.forEach(item => {
            this.$set(
              item,
              "newOriginName",
              utils.addSuffix(item.originName, 18)
            );
            this.$set(
              item,
              "newDestinationName",
              utils.addSuffix(item.destinationName, 18)
            );
          });
          this.setBtnStatus();
        })
        .catch(err => {});
    },
    setBtnStatus() {
      //设置按钮状态
      let isBtnDisabled = this.commonRouteList.length === 5 ? true : false;
      this.btnType = isBtnDisabled ? "info" : "primary";
      this.btnDisabled = isBtnDisabled ? true : false;
    },
    editRoute(route) {
      let commonStartPoint = {
        formattedAddress: route.originName,
        lnglat: [route.origin.split(",")[0], route.origin.split(",")[1]]
      };
      let commonEndPoint = {
        formattedAddress: route.destinationName,
        lnglat: [
          route.destination.split(",")[0],
          route.destination.split(",")[1]
        ]
      };
      this.$storage.set("orderId", route.orderId);
      this.$storage.set("commonStartPoint", commonStartPoint);
      this.$storage.set("commonEndPoint", commonEndPoint);
      this.setRouteHistory();
      this.$router.push({
        name: "addCommonRoute"
      });
    },
    deleteRoute(route) {
      Dialog.confirm({
        title: "取消订单",
        message: "确定要删除该订单吗？"
      })
        .then(response => {
          let params = {
            orderId: route.orderId
          };
          let formData = new FormData();
          for (let item in params) {
            formData.append(item, params[item]);
          }
          this.$http
            .post(`/order/delete_regular_order`, formData, {
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=utf-8"
              }
            })
            .then(res => {
              this.getCommonRouteList();
              Toast(res.data.message || "删除常用路线成功");
            })
            .catch(err => {
              this.getCommonRouteList();
              Toast(err.data.message || "删除常用路线失败");
            });
        })
        .catch(error => {});
    },
    addCommonRoute() {
      this.setRouteHistory();
      this.$router.push({
        name: "addCommonRoute"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#mangeCommonRoute {
  height: 100%;
  $route-item-height: 0.8rem;
  .mange-common-route-wrap {
    position: relative;
    top: 0.4rem;
    .route-item {
      border-bottom: 0.01rem solid #e8e8e8;
      height: $route-item-height;
      line-height: $route-item-height;
      padding: 0 0.1rem;
      .route-name {
        height: $route-item-height / 2;
        line-height: $route-item-height / 2;
        overflow: hidden;
      }
      svg {
        width: 0.4rem;
      }
      .pointer {
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        display: inline-block;
        margin-right: 0.1rem;
      }
      .common-start-pointer {
        .pointer {
          background-color: #409eff;
        }
      }
      .common-end-pointer {
        .pointer {
          background-color: #67c23a;
        }
      }
    }
    .tips {
      color: #409eff;
      font-size: 0.14rem;
      padding: 0.1rem;
      float: right;
    }
  }
  #submitAddBtn {
    width: 90%;
    position: fixed;
    bottom: 0.2rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>