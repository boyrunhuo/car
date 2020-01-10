<template>
  <div id="commonRoute">
    <div class="common-route-header">
      <span>
        <b>常用路线</b>
      </span>
      <span>
        <span @click="goToAdd">添加</span>
        <span @click="goToMange" class="mange-btn" v-if="commonRouteList.length > 0">管理</span>
      </span>
    </div>
    <div class="common-route-list">
      <p v-if="commonRouteList.length === 0" @click="goToAdd">添加常用路线可快速约车</p>
      <ul>
        <li
          v-for="route in commonRouteList"
          :key="route.orderId"
          class="route-item"
          @click="sendOrder(route)"
        >
          <span class="route-name" id="originName">{{route.newOriginName}}</span>
          <svg-icon icon-class="arrowRight" />
          <span class="route-name" id="destinationName">{{route.newDestinationName}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";

export default {
  data() {
    return {
      commonRouteList: []
    };
  },
  created() {
    this.getCommonRouteList();
  },
  methods: {
    goToAdd() {
      this.$router.push({
        name: "addCommonRoute"
      });
    },
    goToMange() {
      this.$router.push({
        name: "mangeCommonRoute"
      });
    },
    getCommonRouteList() {
      this.$http
        .get(`/order/get_regular_order`)
        .then(res => {
          if (res.data.orderList) {
            this.commonRouteList = res.data.orderList;
            this.commonRouteList.map(item => {
              this.$set(
                item,
                "newOriginName",
                utils.addSuffix(item.originName, 8)
              );
              this.$set(
                item,
                "newDestinationName",
                utils.addSuffix(item.destinationName, 8)
              );
            });
          }
        })
        .catch(err => {});
    },
    sendOrder(route) {
      console.log("route", route);
      let selectedStartAddressInfo = {
        formattedAddress: route.originName,
        lnglat: [route.origin.split(",")[0], route.origin.split(",")[1]]
      };
      let selectedEndAddressInfo = {
        formattedAddress: route.destinationName,
        lnglat: [
          route.destination.split(",")[0],
          route.destination.split(",")[1]
        ]
      };
      this.$storage.set("selectedStartAddressInfo", selectedStartAddressInfo);
      this.$storage.set("selectedEndAddressInfo", selectedEndAddressInfo);
      this.$router.push({
        name: "releaseRouter"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#commonRoute {
  width: 3.4rem;
  margin-bottom: 0.2rem;
  .common-route-header {
    & > span:nth-child(2) {
      float: right;
      & > span {
        padding: 0 0.1rem;
        font-size: 0.12rem;
      }
      .mange-btn {
        border-left: 0.01rem solid black;
      }
    }
  }
  .common-route-list {
    margin-top: 0.1rem;

    & > p {
      color: #fff;
      text-align: center;
      font-size: 0.12rem;
      background: #409eff;
      padding: 0.1rem 0;
    }
    .route-item {
      background-color: #409eff;
      padding: 0.1rem;
      margin-top: 0.1rem;
      border-radius: 0.05rem;
      .route-name {
        height: 0.3rem;
        width: 1.4rem;
        line-height: 0.3rem;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        color: #ffffff;
      }
      svg {
        width: 0.4rem;
        height: 0.3rem;
        vertical-align: middle;
      }
    }
  }
}
</style>