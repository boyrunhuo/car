<template>
  <div id="home">
    <div id="GDMap" v-show="false"></div>
    <Header></Header>
    <div class="address-panel-wrap">
      <AddressPanel :startPointerInfo="startPointerInfo" :endPointerInfo="endPointerInfo"></AddressPanel>
    </div>
    <div class="common-route-wrap">
      <CommonRoute></CommonRoute>
    </div>
    <div class="route-panel"></div>
  </div>
</template>

<script>
import AMap from "AMap";
import Header from "./Header";
import AddressPanel from "./AddressPanel";
import CommonRoute from "./CommonRoute";
export default {
  data() {
    return {
      startPointerInfo: {},
      endPointerInfo: {},
      GDMap: null
    };
  },

  mounted() {
    //来到主页移除终点位置信息
    localStorage.removeItem("selectedEndAddressInfo")
    if (!localStorage.getItem("selectedStartAddressInfo")) {
      //如果有来自用户输入的位置信息，就不使用自动定位
      this.locationInit();
    } else {
      this.getLocationFormLocalStorage();
    }
  },
  methods: {
    locationInit() {
      //初始化定位
      this.GDMap = new AMap.Map("GDMap", {
        resizeEnable: true
      });
      AMap.plugin("AMap.Geolocation", () => {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：5s
          buttonPosition: "RB", //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true //定位成功后是否自动调整地图视野到定位点
        });
        //添加精确定位插件
        this.GDMap.addControl(geolocation);
        geolocation.getCurrentPosition((status, result) => {
          if (status == "complete") {
            this.onComplete(result);
          } else {
            this.onError();
          }
        });
      });
    },
    onComplete(data) {
      // console.log("data", data);
      let lnglat = [data.position.lng, data.position.lat];
      this.regeoCode(lnglat);
    },
    onError() {
      //解析定位错误信息
      this.$message({
        message: "定位失败",
        type: "warning"
      });
    },
    getLocationFormLocalStorage() {
      //如果localStorage里有相应的位置信息，将数据传送给AddressPanel组件
      if (localStorage.getItem("selectedStartAddressInfo")) {
        this.startPointerInfo = JSON.parse(
          localStorage.getItem("selectedStartAddressInfo")
        );
      }
    },
    regeoCode(lnglat) {
      //地理逆解码
      AMap.plugin("AMap.Geocoder", () => {
        let geocoder = new AMap.Geocoder();
        geocoder.getAddress(lnglat, (status, result) => {
          if (status === "complete" && result.regeocode) {
            //根据起点还是终点将位置信息存储到对应的localStorage里
            localStorage.setItem(
              'selectedStartAddressInfo',
              JSON.stringify(result.regeocode)
            );
            this.getLocationFormLocalStorage()
          } else {
            this.$message({
              message: "查询位置失败",
              type: "warning"
            });
          }
        });
      });
    }
  },
  components: {
    Header,
    AddressPanel,
    CommonRoute
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#home {
  .address-panel-wrap,
  .common-route-wrap {
    position: absolute;
    top: 0.8rem;
    left: 50%;
    transform: translateX(-50%);
  }
  .common-route-wrap {
    top: 3rem;
  }
}
</style>
