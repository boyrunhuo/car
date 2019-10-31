<template>
  <div id="handleOrder">
    <p v-if="orderList.length > 0">
      <b>待处理订单({{character | characterFilter}})</b>
    </p>
    <div class="order-item" v-for="item in orderList" :key="item.id" @click="checkOrder(item)">
      <p class="order-item-msg">
        <span>{{item.orderStatus | orderStatusFilter}}</span>
        <span>{{item.goOffTime}}</span>
        <span>{{item.passengerNum}}人</span>
      </p>
      <p class="order-item-time">
        <span class="pointer start-pointer"></span>
        <span class="pointer-address">{{item.newOriginName}}</span>
        <i class="el-icon-right"></i>
        <span class="pointer end-pointer"></span>
        <span class="pointer-address">{{item.newDestinationName}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";


let that;

export default {
  data() {
    return {
      orderList: [],
      character: "passenger"
    };
  },
  beforeCreate() {
    //在vue创建前的生命周期钩子函数中将that指向this，可以在filter中通过that访问vue实例了
    that = this;
  },
  created() {
    this.getHandleOrder();
  },
  filters: {
    orderStatusFilter(val) {
      switch (val) {
        case 0:
          return "已取消";
        case 1:
          if (that.character === "passenger") {
            return "待司机接单";
          } else if (that.character === "driver") {
            return "寻找乘客中";
          }
        case 2:
          return "待出行";
        case 3:
          return "行程进行中";
        case 4:
          return "已完成";
      }
    },
    characterFilter(val) {
      switch (val) {
        case "passenger":
          return "乘客";
        case "driver":
          return "车主";
      }
    }
  },
  methods: {
    getHandleOrder() {
      this.character = this.$storage.get("character");
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
          this.orderList = this.orderList.filter(item => {
            return item.orderStatus == 1 || item.orderStatus == 2;
          });

          this.orderList.forEach(item => {
            this.$set(
              item,
              "goOffTime",
              this.$dayjs(item.goOffTime).format("YYYY-MM-DD HH:mm")
            );
            this.$set(
              item,
              "newOriginName",
              utils.addSuffix(item.originName, 6)
            );
            this.$set(
              item,
              "newDestinationName",
              utils.addSuffix(item.destinationName, 6)
            );
          });
        })
        .catch(err => {});
    },
    checkOrder(val) {
      //查看订单详情
      this.$set(val, "isFromOrderList", false);
      console.log("orderDetail", val);
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
          break;
        case 3:
          break;
        case 4:
          break;
        default:
          Toast("非法订单");
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#handleOrder {
  width: 3.4rem;
  .order-item {
    padding: 0.1rem;
    background-color: #efefef;
    margin-top: 0.1rem;
    border-radius: 0.05rem;
    .order-item-msg {
      & > span:nth-child(1) {
        color: #2196f3;
        margin-right: 0.1rem;
      }
      & > span:nth-child(3) {
        float: right;
      }
    }
    .order-item-time {
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
        width: 1rem;
        display: inline-block;
        height: 0.24rem;
        line-height: 0.24rem;
        overflow: hidden;
        // text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
      }
      & > i {
        padding: 0 0.1rem;
      }
    }
  }
}
</style>