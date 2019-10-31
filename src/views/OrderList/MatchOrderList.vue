<template>
  <div id="matchOrderList">
    <div class="order-list-header">
      <i class="el-icon-arrow-left" @click="goBack"></i>
      <p>
        匹配订单
        <span class="cancel-order" @click="cancelOrder">取消订单</span>
      </p>
      <p class="order-item-address">
        <span class="pointer start-pointer"></span>
        <span class="pointer-address" id="originName">{{orderDetail.originName}}</span>
        <i class="el-icon-right"></i>
        <span class="pointer end-pointer"></span>
        <span class="pointer-address" id="destinationName">{{orderDetail.destinationName}}</span>
      </p>
      <p class="order-item-time">
        <span>{{orderDetail.goOffTime}}</span>
        <span>{{orderDetail.passengerNum}}人</span>
      </p>
    </div>
    <div class="order-list-wrap">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          class="order-list-item"
          v-for="item in orderList"
          :key="item.id"
          @click="checkOrderDetail(item)"
        >
          <p class="order-list-item-time">
            {{item.goOffTime}}
            <span>{{item.passengerNum || item.seatStatus}}人</span>
          </p>
          <p>
            <span class="pointer start-pointer"></span>
            {{item.newOriginName}}
          </p>
          <p>
            <span class="pointer end-pointer"></span>
            {{item.newDestinationName}}
          </p>
          <p class="order-list-item-status">
            <span>{{item.name}}</span>
            <span class="mars">
              <img src="@/assets/img/mars.png" />
              {{item.marsId}}
            </span>
            <el-button
              type="primary"
              size="mini"
              @click.stop="joinOrder(item)"
            >{{character === 'passenger' ? '请他接我' : '接单'}}</el-button>
          </p>
        </div>
        <el-divider v-if="orderList.length === 0">暂无匹配订单</el-divider>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";
import Vue from "vue";
import { PullRefresh, Toast, Dialog } from "vant";


Vue.use(PullRefresh);
Vue.use(Toast);
Vue.use(Dialog);

export default {
  data() {
    return {
      isLoading: false,
      orderList: [],
      character: "",
      orderId: "",
      orderNo: "",
      orderDetail: {}
    };
  },
  created() {
    this.initData();
  },
  beforeRouteLeave(to, from, next) {
    this.$storage.remove("orderDetail");
    next();
  },
  mounted() {
    //字体滚动
    utils.scroll("originName");
    utils.scroll("destinationName");
  },
  methods: {
    initData() {
      this.character = this.$storage.get("character");
      this.orderDetail = this.$storage.get("orderDetail");
      this.orderId = this.orderDetail.orderId || this.orderDetail.id;
      this.orderNo = this.orderDetail.orderNo;
      if (!this.orderDetail.goOffTime) {
        //如果localStorage里没有起点终点和时间信息，用id查询
        this.getOrderByID();
      }

      this.getMatchOrderList();
    },
    getMatchOrderList() {
      this.orderList = [];
      //获取匹配的订单
      const params = {
        type: this.character,
        orderId: this.orderId
        // type: "driver",
        // orderId: 10
      };
      let formData = new FormData();
      for (let item in params) {
        formData.append(item, params[item]);
      }
      this.$http
        .post(`/order/get_hitching_order`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        })
        .then(res => {
          if (res.data) {
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
          } else if (res.data.message) {
            Toast(res.data.message);
          }
        })
        .catch(err => {
          Toast(err.data.message || "获取订单列表失败");
        });
    },
    getOrderByID() {
      //根据ID查询订单
      const params = {
        type: this.character,
        orderId: this.orderId
      };
      let formData = new FormData();
      for (let item in params) {
        formData.append(item, params[item]);
      }
      this.$http.post(`/order/get_order_by_id`, formData).then(res => {
        this.orderDetail = res.data.order;
        this.orderDetail.goOffTime = this.$storage.get("orderDetail")
          ? this.orderDetail.goOffTime
          : this.$dayjs(this.orderDetail.goOffTime).format("YYYY-MM-DD HH:mm");

        this.$storage.set("orderDetail", res.data.order);
      });
    },
    checkOrderDetail(val) {
      console.log("orderDetail", val);
    },
    joinOrder(val) {
      //加入订单
      console.log("val", val, this.orderDetail.id);

      const params = {
        driverOrderId:
          this.character === "passenger" ? val.id : this.orderDetail.id,
        passengerOrderId:
          this.character === "passenger" ? this.orderDetail.id : val.id
      };
      let formData = new FormData();
      for (let item in params) {
        formData.append(item, params[item]);
      }
      this.$http
        .post(`/order/order_join`, formData)
        .then(res => {})
        .catch(err => {});
    },
    cancelOrder() {
      //取消订单
      Dialog.confirm({
        title: "取消订单",
        message: "确定要取消该订单吗？"
      })
        .then(response => {
          console.log('response',response);
          
          const params = {
            type: this.character,
            orderId: this.orderId
          };
          let formData = new FormData();
          for (let item in params) {
            formData.append(item, params[item]);
          }
          this.$http
            .post(`/order/cancel_order`, formData)
            .then(res => {
              Toast(res.data.message || '取消订单成功')
              this.$router.push({
                name:'home',
              })
            })
            .catch(err => {
              Toast(err.data.message || '取消订单失败')
              
            });
        })
        .catch(error => {
          
        });
      //取消订单
    },
    onRefresh() {
      //下拉刷新
      setTimeout(() => {
        this.initData();
        this.isLoading = false;
      }, 500);
    },
    goBack() {
      this.$router.push({
        name:
          this.orderDetail && this.orderDetail.isFromOrderList
            ? "orderList"
            : "home"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$order-list-header-height: 0.4rem;
#matchOrderList {
  background-color: #e8e8e8;
  height: 100vh;
  .order-list-header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #ffffff;
    height: $order-list-header-height * 3;
    line-height: $order-list-header-height * 3;
    z-index: 1;
    box-shadow: 0 0 0.05rem #d8d0d0;
    .order-item-address {
      text-align: center;
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
      .pointer-address {
        padding: 0 0.1rem;
        width: 1.2rem;
        display: inline-block;
        height: 0.24rem;
        line-height: 0.24rem;
        overflow: hidden;
        // text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
    }
    .order-item-time {
      display: flex;
      justify-content: space-around;
      font-size: 0.14rem;
    }
    & > i {
      height: $order-list-header-height;
      line-height: $order-list-header-height;
      position: absolute;
      left: 0.1rem;
    }
    & > p {
      text-align: center;
      height: $order-list-header-height;
      line-height: $order-list-header-height;
    }
    .cancel-order {
      position: absolute;
      right: 0.1rem;
      font-size: 0.12rem;
      color: #847f7f;
    }
  }
  .order-list-wrap {
    position: relative;
    top: 1.2rem;
    height: calc(100vh - 1.2rem);
    overflow-y: scroll;
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
        & > span {
          float: right;
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
  .van-pull-refresh {
    background-color: #e8e8e8;
    height: calc(100vh - 1.2rem);
    overflow-y: scroll;
  }
  .el-button--mini {
    float: right;
  }
  .el-divider__text {
    background-color: #e8e8e8;
  }
}
</style>