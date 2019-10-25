<template>
  <div id="handleOrder">
    <p>
      <b>待处理订单</b>
    </p>
    <div class="order-item" v-for="item in orderList" :key="item.id">
      <p class="order-item-msg">
        <span>{{item.orderStatus | orderStatusFilter}}</span>
        <span>{{item.goOffTime}}</span>
      </p>
      <p class="order-item-time">
        <span class="pointer start-pointer"></span>
        <span class="pointer-address">{{item.originName}}</span>
        <i class="el-icon-right"></i>
        <span class="pointer end-pointer"></span>
        <span class="pointer-address">{{item.destinationName}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";

export default {
  data() {
    return {
      orderList: []
    };
  },
  created() {
    this.getHandleOrder()
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
    getHandleOrder() {
      const params = {
        type: "driver",
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
          this.orderList = res.data.orderList
          this.orderList = this.orderList.filter((item) => {
            return item.orderStatus == 1 || item.orderStatus == 2
          })
          
          this.orderList.forEach(item => {
            this.$set(
              item,
              "goOffTime",
              this.$dayjs(item.goOffTime).format("YYYY-MM-DD HH:mm")
            );
          });
        })
        .catch(err => {});
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
        text-overflow: ellipsis;
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