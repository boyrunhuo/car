<template>
  <div id="orderList">
    <div class="order-list-header">
      <i class="el-icon-arrow-left" @click="goBackToHome"></i>
      <p>我的订单</p>
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
      orderList: [],
      isLoading: false,
      count: 0,
      character: ""
    };
  },
  created() {
    this.getMyOrderList();
  },

  filters: {
    orderStatusFilter(val) {
      switch (val) {
        case 0:
          return "已取消";
          break;
        case 1:
          return "待接单";
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
  methods: {
    getMyOrderList() {
      this.orderList = [];
      //获取我的订单
      this.character = localStorage.getItem("character");
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

            this.$set(item, "newOriginName", utils.addSuffix(item.originName, 18));
            this.$set(
              item,
              "newDestinationName",
              utils.addSuffix(item.destinationName, 18)
            );
          });
        })
        .catch(err => {
          Toast(err.message || "获取订单列表失败");
        });
    },

    checkOrderDetail(orderDetail) {      
      //查看订单详情
      this.$set(orderDetail,'isFromOrderList', true);
      switch (orderDetail.orderStatus) {
        case 0:
          Toast("订单已取消");
          break;
        case 1:
          localStorage.setItem('orderDetail',JSON.stringify(orderDetail))
          this.$router.push({
            name:'matchOrderList'
          })
          break;
        case 2:
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
    goBackToHome() {
      //回到首页
      this.$router.push({
        name: "home"
      });
    },
    onRefresh() {
      //下拉刷新
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        this.count++;
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
$order-list-header-height: 0.4rem;
#orderList {
  background-color: #e8e8e8;
  height: 100vh;
  .order-list-header {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #ffffff;
    height: $order-list-header-height;
    line-height: $order-list-header-height;
    z-index: 1;
    box-shadow: 0 0 0.05rem #d8d0d0;

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
  }
  .order-list-wrap {
    position: relative;
    top: 0.5rem;
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