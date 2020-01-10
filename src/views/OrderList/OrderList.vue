<template>
  <div id="orderList">
    <TopBar :title="'我的订单'" @goBack="goBack"></TopBar>
    <div class="order-list-condition">
      <el-radio-group v-model="charterRadio" size="mini" @change="charterRadioChange">
        <el-radio-button label="passenger">乘客</el-radio-button>
        <el-radio-button label="driver">车主</el-radio-button>
      </el-radio-group>
    </div>
    <div class="order-list-wrap">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="pull-wrap">
          <div
            class="order-list-item"
            v-for="item in orderList"
            :key="item.id"
            @click="checkOrder(item)"
          >
            <p class="order-list-item-time">
              <span class="time">{{item.goOffTime}}</span>
              <span class="member">
                <svg-icon icon-class="user" />
                <span>{{item.passengerNum}}</span>
              </span>
              <span class="money">
                <svg-icon icon-class="money" />
                <span>{{Number(item.moneyCost).toFixed(2)}}</span>
              </span>
            </p>
            <p>
              <span class="pointer start-pointer"></span>
              {{item.newOriginName}}
            </p>
            <p>
              <span class="pointer end-pointer"></span>
              {{item.newDestinationName}}
            </p>
            <p
              class="order-list-item-status"
              :class="{active:item.orderStatus===1||item.orderStatus===2}"
            >{{item.orderStatus | orderStatusFilter}}</p>
            <p class="order-list-item-orderNo">订单号：{{item.orderNo}}</p>
          </div>
          <el-divider v-if="orderList.length === 0">暂无订单</el-divider>
        </div>
      </van-pull-refresh>
    </div>
    <van-popup v-model="isWaitOrderVisual" position="bottom" :style="{ height: '50%' }">
      <p>订单详情</p>
    </van-popup>
  </div>
</template>
<script>
import utils from "@/utils";
import Vue from "vue";
import { PullRefresh, Toast, Popup } from "vant";
import TopBar from "@/components/TopBar";
import routeMixin from "@/mixin/routeMixin";
Vue.use(PullRefresh)
  .use(Toast)
  .use(Popup);

let that;
export default {
  data() {
    return {
      orderList: [],
      isLoading: false,
      character: "",
      charterRadio: "passenger",
      fromRoute: "",
      orderDetail: {}, //订单详情
      isWaitOrderVisual: false,
    };
  },
  mixins: [routeMixin],
  beforeCreate() {
    //在vue创建前的生命周期钩子函数中将that指向this，可以在filter中通过that访问vue实例了
    that = this;
  },
  created() {
    this.getMyOrderList();
    this.fromRoute = this.getRouteHistory();
  },
  filters: {
    orderStatusFilter(val) {
      switch (val) {
        case 0:
          return "已取消";
          break;
        case 1:
          return that.character === "passenger" ? "待司机接单" : "寻找乘客中";
          break;
        case 2:
          return "待出行";
          break;
        case 3:
          return "行程进行中";
          break;
        case 4:
          return "已完成";
          break;
      }
    }
  },
  components: {
    TopBar
  },
  methods: {
    getMyOrderList() {
      this.orderList = [];
      //获取我的订单
      this.character = this.$storage.get("character");
      this.charterRadio = this.character;
      const params = {
        type: this.character,
        page: 0
        // status: 1
      };
      let formData = new FormData();
      for (let item in params) {
        formData.append(item, params[item]);
      }

      this.$http
        .post(`/order/get_order`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        })
        .then(res => {
          this.orderList = res.data.orderList;
          this.orderList.forEach(item => {
            this.$set(
              item,
              "goOffTime",
              this.$dayjs(item.goOffTime).format("YYYY-MM-DD HH:mm")
            );

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
        })
        .catch(err => {
          Toast(err.data.message || "获取订单列表失败");
        });
    },

    checkOrder(val) {
      console.log("val", val);

      //查看订单详情
      this.$set(val, "isFromOrderList", true);
      switch (val.orderStatus) {
        case 0:
          Toast("订单已取消");
          break;
        case 1:
          this.$storage.set("orderDetail", val);
          this.$router.push({
            name: "matchOrderList"
          });
          break;
        case 2:
          this.orderWaitHandle(val.id);
          break;
        case 3:
          break;
        case 4:
          break;
        default:
          Toast("非法订单");
          break;
      }
    },
    goBack() {
      //回到首页
      if (this.fromRoute === "personalCenter") {
        this.$router.push({
          name: "personalCenter"
        });
      } else {
        this.$router.push({
          name: "home"
        });
      }
    },
    onRefresh() {
      //下拉刷新
      setTimeout(() => {
        this.isLoading = false;
        this.getMyOrderList();
      }, 500);
    },
    charterRadioChange(val) {
      this.character = this.$storage.set("character", val);
      this.character = val;
      this.getMyOrderList();
    },
    orderWaitHandle(orderId) {
      //待出行订单信息展示
      this.isWaitOrderVisual = true;
    }
  }
};
</script>
<style lang="scss" scoped>
#orderList {
  background-color: #e8e8e8;
  height: 100vh;

  .order-list-wrap {
    position: relative;
    top: 0.8rem;
    background-color: #e8e8e8;
    height: calc(100vh - 0.8rem);
    overflow-y: scroll;
    .pull-wrap {
      position: relative;
      top: 0.1rem;
      .order-list-item {
        width: 3.2rem;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 0.05rem;
        background-color: #fff;
        margin: 0.1rem 0;
        padding: 0.1rem;
        box-shadow: 0 0 0.05rem #d8d0d0;
        .order-list-item-time {
          margin-bottom: 0.06rem;
          color: #807d7d;
          height: 0.2rem;
          line-height: 0.2rem;

          .money,
          .member {
            margin-left: 0.2rem;
            & > svg {
              vertical-align: bottom;
            }
            & > span {
              display: inline-block;
              height: 0.2rem;
              line-height: 0.2rem;
            }
          }
        }
        .order-list-item-status {
          padding: 0.1rem 0;
          margin-top: 0.1rem;
          border-top: 0.01rem solid #d8d0d0;
          .mars {
            color: #64d1ff;
            & > img {
              vertical-align: top;
              margin-left: 0.1rem;
            }
          }
        }
        .order-list-item-orderNo {
          font-size: 0.12rem;
          color: #696565;
          user-select: text;
        }
        .active {
          color: #409eff;
        }
        .pointer {
          width: 0.1rem;
          height: 0.1rem;
          border-radius: 50%;
          display: inline-block;
        }
        .start-pointer {
          background-color: #409eff;
        }
        .end-pointer {
          background-color: #67c23a;
        }
      }
    }
  }

  .order-list-condition {
    position: fixed;
    top: 0.4rem;
    z-index: 1;
    width: 100%;
    height: 0.4rem;
    line-height: 0.4rem;
    background-color: #fff;
  }
}
</style>
<style>
#orderList .el-radio-group {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}
#orderList .el-divider__text {
  background-color: #e8e8e8;
}
#orderList .van-pull-refresh {
  background-color: #e8e8e8;
  height: calc(100vh - 0.8rem);
  overflow-y: scroll;
}
#orderList .van-pull-refresh__track {
  height: calc(100vh - 0.8rem);
}
#orderList .el-divider--horizontal {
  top: 0.24rem;
  margin: 0;
}
</style>