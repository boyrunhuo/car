<template>
  <div id="map">
    <div class="search-wrap">
      <div>
        <span @click="inputAddress">
          <span>{{city}}</span>
          <i class="el-icon-caret-bottom"></i>
        </span>
        <input
          @click="inputAddress"
          id="tipInput"
          v-model="addressName"
          :placeholder="inputPlaceholder"
        />
        <span @click="backToHome">取消</span>
      </div>
    </div>
    <transition enter-active-class="animated faster slideInUp">
      <div v-if="isTipOutputVisual">
        <div id="tipOutput" v-show="tipsList.length>0">
          <div
            @click="selectAddress(tip)"
            class="tip-wrap"
            v-for="(tip,index) in tipsList"
            :key="index"
          >
            <p>
              <i class="el-icon-place"></i>
              <span>{{tip.name}}</span>
            </p>
            <p>{{tip.district | noneEmpty}}{{tip.address | noneEmpty}}</p>
          </div>
        </div>
      </div>
    </transition>

    <div v-if="!isTipOutputVisual" class="address-detail-wrap"></div>
    <div v-if="!isTipOutputVisual" id="GDMap" v-loading="loading"></div>
  </div>
</template>

<script>
import loadMap from "./loadMap";
import AMap from "AMap";
export default {
  data() {
    return {
      // 地图实例
      GDMap: null,
      // 加载的一些插件
      // 更多参考：https://lbs.amap.com/api/javascript-api/guide/abc/plugins#plugins
      plugins: ["AMap.Geolocation", "AMap.Autocomplete"],
      // key
      key: "dbf6b3581005e3497224e724ea1c6814",
      // 地图版本
      v: "1.4.15",
      loading: true,
      addressName: "",
      autoInput: {},
      inputPlaceholder: "",
      city: "",
      isTipOutputVisual: false,
      tipsList: []
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let pointType = localStorage.getItem("pointType");
      if (pointType === "startPointer") {
        vm.inputPlaceholder = "从哪儿出发";
      } else if (pointType === "endPointer") {
        vm.inputPlaceholder = "你要去哪儿";
      }
    });
  },

  mounted() {
    this.mapInit();
  },
  watch: {
    addressName(val) {
      this.autoInputTip(val);
    }
  },
  filters: {
    noneEmpty(val) {
      if (val.length === 0) {
        return "";
      } else if (val instanceof Array && val.length > 0) {
        return val[0];
      } else {
        return val;
      }
    }
  },
  methods: {
    mapInit() {
      //初始化地图
      loadMap(this.key, this.plugins, this.v)
        .then(AMap => {
          this.GDMap = new AMap.Map("GDMap", {
            zoom: 11,
            center: [116.397428, 39.90923]
          });
          AMap.plugin("AMap.Geolocation", () => {
            var geolocation = new AMap.Geolocation({
              enableHighAccuracy: true, //是否使用高精度定位，默认:true
              timeout: 10000, //超过10秒后停止定位，默认：5s
              buttonPosition: "RB", //定位按钮的停靠位置
              buttonOffset: new AMap.Pixel(10, 100), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
              zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
              markerOptions: {
                content:
                  '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
              }
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

          //加载完成
          this.GDMap.on("complete", () => {
            this.loading = false;
          });
        })
        .catch(() => {
          this.loading = false;
          this.$message({
            message: "地图加载失败",
            type: "warning"
          });
        });
    },
    onComplete(data) {
      //定位成功
      this.city = data.addressComponent.city;
    },
    onError() {
      //解析定位错误信息
      this.$message({
        message: "定位失败",
        type: "warning"
      });
    },
    backToHome() {
      this.$router.push({
        name: "home"
      });
    },
    autoInputTip(keywords) {
      //添加自动提示
      AMap.plugin("AMap.Autocomplete", () => {
        this.autoInput = new AMap.Autocomplete();
        this.autoInput.setCity(this.city);
        this.autoInput.search(keywords, (status, result) => {
          if (status === "complete") {
            this.tipsList = result.tips;
          }
        });
      });
    },
    inputAddress() {
      //输入地址
      this.isTipOutputVisual = true;
    },
    selectAddress(addressInfo) {
      let pointType = localStorage.getItem("pointType");
      let lnglat = [addressInfo.location.lng, addressInfo.location.lat];
      this.regeoCode(lnglat);
    },
    regeoCode(lnglat) {
      let pointType = localStorage.getItem("pointType")
        ? localStorage.getItem("pointType")
        : "startPointer";
      //地理逆解码
      AMap.plugin("AMap.Geocoder", () => {
        let geocoder = new AMap.Geocoder();
        geocoder.getAddress(lnglat, (status, result) => {
          if (status === "complete" && result.regeocode) {
            //根据起点还是终点将位置信息存储到对应的localStorage里
            let selectedAddressInfo =
              pointType === "startPointer"
                ? "selectedStartAddressInfo"
                : "selectedEndAddressInfo";
            localStorage.setItem(
              selectedAddressInfo,
              JSON.stringify(result.regeocode)
            );
            this.judgePath();
          } else {
            this.$message({
              message: "查询位置失败,请重新选择位置",
              type: "warning"
            });
          }
        });
      });
    },
    judgePath() {
      //判断要跳转到哪个路由
      let path;
      if (
        localStorage.getItem("selectedStartAddressInfo") &&
        localStorage.getItem("selectedEndAddressInfo")
      ) {
        //起点和终点都有了，跳转到发布行程页面
        path = "/releaseRouter";
      } else if (
        localStorage.getItem("selectedStartAddressInfo") &&
        !localStorage.getItem("selectedEndAddressInfo")
      ) {
        //只有起点，没有终点，跳回到主页
        path = "/";
      } else {
        //其他情况也回主页
        path = "/";
      }

      this.$router.push({
        path: path
      });
    }
  }
};
</script>



<style lang="scss" scoped>
#map {
  min-height: 100vh;
  #GDMap {
    min-height: 100vh;
    position: relative;
  }
  .search-wrap {
    z-index: 1;
    height: 0.5rem;
    line-height: 0.5rem;
    width: 100%;
    background-color: #fff;
    position: fixed;
    top: 0;
    & > div {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      width: 3.4rem;
      & > span {
        display: inline-block;
        height: 0.3rem;
        line-height: 0.3rem;
        vertical-align: middle;

        font-size: 0.12rem;
      }

      & > span:nth-child(1) {
        border-right: 0.01rem solid #e4dfdf;
        background-color: #efefef;
        text-align: center;
        width: 0.8rem;
        & > span {
          overflow: hidden;
          overflow: hidden;
          height: 0.3rem;
          line-height: 0.3rem;
          width: 0.6rem;
          display: inline-block;
        }
        & > i {
          height: 0.3rem;
          line-height: 0.3rem;
          vertical-align: top;
          width: 0.1rem;
        }
      }
      & > span:nth-child(3) {
        text-align: right;
        width: 0.4rem;
      }
      & > input {
        background-color: #efefef;
        overflow: hidden;
        height: 0.3rem;
        border: 0;
        width: 1.98rem;
        padding: 0 0.1rem;
        outline: none;
        vertical-align: middle;
      }
    }
  }
  .address-detail-wrap {
    background-color: #fff;
    height: 0.8rem;
    width: 3.4rem;
    position: fixed;
    bottom: 0.1rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0.05rem;
    z-index: 999;
  }
  #tipOutput {
    height: 100vh;
    position: absolute;
    top: 0.5rem;
    padding: 0.1rem 3%;
    width: 94%;
    overflow-y: scroll;
    .tip-wrap {
      border-bottom: 0.01rem solid #eae4e4;
      padding: 0.1rem 0;
      width: 100%;
      height: 0.4rem;

      & > p {
        overflow: hidden;
      }
      & > p:nth-child(1) {
        & > i {
          width: 0.2rem;
        }
      }
      & > p:nth-child(2) {
        font-size: 0.12rem;
        color: #928f8f;
        height: 0.2rem;
        line-height: 0.2rem;
        margin-left: 0.2rem;
      }
    }
  }
}
</style>