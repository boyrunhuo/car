<template>
  <div id="home">
    <div id="GDMap" v-show="false"></div>
    <Header></Header>
    <div class="address-panel-wrap">
      <AddressPanel :startPointerInfo="startPointerInfo" :endPointerInfo="endPointerInfo"></AddressPanel>
    </div>
    <div class="order-list-wrap">
      <handleOrder></handleOrder>
    </div>
    <div class="common-route-wrap">
      <CommonRoute></CommonRoute>
    </div>
    <div class="route-panel"></div>
  </div>
</template>

<script>
import Header from "./Header";
import AddressPanel from "./AddressPanel";
import CommonRoute from "./CommonRoute";
import mapMixin from "@/mixin/mapMixin";
import handleOrder from "./handleOrder";
import Vue from "vue"
import { Toast } from "vant";
Vue.use(Toast);

export default {
  data() {
    return {
      startPointerInfo: {},
      endPointerInfo: {}
    };
  },
  mixins: [mapMixin],

  mounted() {
    //清空到达地点信息
    localStorage.setItem("selectedEndAddressInfo", "");
    if (!localStorage.getItem("selectedStartAddressInfo")) {
      //如果有来自用户输入的位置信息，就不使用自动定位
      this.initLocalStorage();
    } else {
      this.getLocationFormLocalStorage();
    }
  },
  methods: {
    initLocalStorage() {
      this.mapInit("GDMap")
        .then(res => {
          this.onComplete(res);
        })
        .catch(() => {
          this.onError();
        });
    },
    onComplete(data) {
      let lnglat = [data.position.lng, data.position.lat];
      let currentCity = data.addressComponent.city;
      if (currentCity) {
        localStorage.setItem("currentCity", currentCity);
      }
      this.regeoCode(lnglat)
        .then(res => {
          //根据起点还是终点将位置信息存储到对应的localStorage里
          let obj = Object.assign({}, res.regeocode);
          obj.lnglat = lnglat;
          localStorage.setItem("selectedStartAddressInfo", JSON.stringify(obj));
          this.getLocationFormLocalStorage();
        })
        .catch(() => {});
    },
    onError() {
      //解析定位错误信息

      Toast("定位失败");
    },
    getLocationFormLocalStorage() {
      //如果localStorage里有相应的位置信息，将数据传送给AddressPanel组件
      if (localStorage.getItem("selectedStartAddressInfo")) {
        this.startPointerInfo = JSON.parse(
          localStorage.getItem("selectedStartAddressInfo")
        );
      }
    }
  },
  components: {
    Header,
    AddressPanel,
    CommonRoute,
    handleOrder
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#home {
  .address-panel-wrap,
  .common-route-wrap,
  .order-list-wrap {
    & > div {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .common-route-wrap,
  .order-list-wrap {
    margin-top: 0.2rem;
  }
  .address-panel-wrap {
    margin-top: -1rem;
  }
}
</style>
