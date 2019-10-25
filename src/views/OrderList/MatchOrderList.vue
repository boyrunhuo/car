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
    </div>
    <div class="order-list-wrap">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          class="order-list-item"
          v-for="item in orderList"
          :key="item.id"
          @click="checkOrderDetail(item)"
        >
          <p class="order-list-item-time">{{item.goOffTime}}</p>
          <p>
            <span class="pointer start-pointer"></span>
            {{item.originName}}
          </p>
          <p>
            <span class="pointer end-pointer"></span>
            {{item.destinationName}}
          </p>
          <p class="order-list-item-status">
            <span>{{item.name}}</span>
            <span class="mars">
              <img src="@/assets/img/mars.png" />
              {{item.marsId}}
            </span>
          </p>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";
import Vue from "vue";
import { PullRefresh, Toast } from "vant";
Vue.use(PullRefresh);
Vue.use(Toast);

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
    localStorage.removeItem("orderDetail");
    next();
  },
  mounted() {
    //字体滚动
    utils.scroll("originName");
    utils.scroll("destinationName");
  },
  methods: {
    initData() {
      this.character = localStorage.getItem("character");
      this.orderDetail = JSON.parse(localStorage.getItem("orderDetail"));
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
                "originName",
                utils.addSuffix(item.originName, 18)
              );
              this.$set(
                item,
                "destinationName",
                utils.addSuffix(item.destinationName, 18)
              );
            });
          } else if (res.message) {
            Toast(res.message);
          }
        })
        .catch(err => {
          Toast(err.message || "获取订单列表失败");
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
        this.orderDetail.originName = utils.addSuffix(
          this.orderDetail.originName,
          10
        );
        this.orderDetail.destinationName = utils.addSuffix(
          this.orderDetail.destinationName,
          10
        );

        localStorage.setItem("orderDetail", JSON.stringify(res.data.order));
      });
    },
    cancelOrder() {
      //取消订单
      console.log( this.orderId,this.character);
      const params = {
        type: this.character,
        orderId: this.orderId
      };
      let formData = new FormData();
      for (let item in params) {
        formData.append(item, params[item]);
      }
      this.$http.post(`/order/cancel_order`,formData).then(res => {
        
      }).catch({
        
      })
    },
    onRefresh() {
      //下拉刷新
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        this.count++;
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
    height: $order-list-header-height * 2;
    line-height: $order-list-header-height * 2;
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
    top: 1rem;
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
  }
}
</style>