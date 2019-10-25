<template>
  <div id="map">
    <div class="search-wrap">
      <div>
        <span @click="inputCity">
          <span>{{city}}</span>
          <i class="el-icon-caret-bottom"></i>
          <!-- <el-input ref="cityInputRef" id="cityInput" v-if="isCitySelectVisual" placeholder="城市名" v-model="cityInputContent"></el-input> -->
        </span>
        <input
          @click="inputAddress"
          id="tipInput"
          v-model="inputAddressName"
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
    <transition enter-active-class="animated faster slideInUp">
      <div id="citySelecterWrap" v-if="isCitySelectVisual">
        <citySelecter ref="citySelectRef" @handleSelectCity="handleSelectCity"></citySelecter>
      </div>
    </transition>

    <div
      v-show="!isTipOutputVisual && !isCitySelectVisual && pointType !== 'endPointer'"
      class="address-detail-wrap"
    >
      <div>
        <p class="address-name">{{addressName}}</p>
        <p class="address-detail">
          <i class="el-icon-location-outline"></i>
          <span>{{addressDetail}}</span>
        </p>
      </div>
      <div class="submit-btn">
        <span @click="submitAddress">确定</span>
      </div>
    </div>
    <div
      v-show="!isTipOutputVisual && !isCitySelectVisual && pointType !== 'endPointer'"
      id="GDMap"
      v-loading="loading"
    ></div>
  </div>
</template>

<script>
// import loadMap from "./loadMap";
import AMap from "AMap";
import mapMixin from "@/mixin/mapMixin";
import utils from "@/utils";
import citySelecter from "./citySelecter";
import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);

export default {
  data() {
    return {
      loading: true,
      addressName: "",
      inputAddressName: "",
      addressDetail: "",
      autoInput: {},
      inputPlaceholder: "",
      city: "",
      cityInputContent: "",
      isTipOutputVisual: false,
      isCitySelectVisual: false,
      tipsList: [],
      pointType: "",
      lnglat: [] //经纬度,
    };
  },
  mixins: [mapMixin],

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.pointType = localStorage.getItem("pointType");

      if (vm.pointType === "startPointer") {
        vm.inputPlaceholder = "从哪儿出发";
      } else if (vm.pointType === "endPointer") {
        vm.inputPlaceholder = "你要去哪儿";
      }
    });
  },
  mounted() {
    //初始化地图
    let currentCity = localStorage.getItem("currentCity");
    this.city = currentCity ? currentCity : "";
    this.dragMap("GDMap", this.dragSuccess, this.dragFail);
  },
  components: {
    citySelecter
  },
  watch: {
    inputAddressName(val) {
      if (this.isTipOutputVisual) {
        this.autoInputTip(val);
      }
    },
    cityInputContent(val) {
      this.$refs.citySelectRef.searchCity(val);
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
    dragSuccess(data) {
      //拖拽定位成功

      this.loading = false;
      let currentCity = data.regeocode.addressComponent.city;
      this.city = currentCity;
      localStorage.setItem("currentCity", currentCity);
      this.lnglat = [data.position.lng, data.position.lat];

      this.addressName = utils.addSuffix(data.address, 14);
      this.addressDetail = utils.addSuffix(data.address, 19);
    },
    dragFail(data) {},
    submitAddress() {
      this.regeoCode(this.lnglat)
        .then(res => {
          //根据起点还是终点将位置信息存储到对应的localStorage里
          let obj = Object.assign({}, res.regeocode);
          obj.lnglat = this.lnglat;
          this.setSelectedAddressInfo(JSON.stringify(obj));
          this.judgePath();
        })
        .catch(err => {});
    },
    onError() {
      //解析定位错误信息
      Toast("定位失败");
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
      this.isCitySelectVisual = false;
    },
    inputCity() {
      //输入城市
      this.isCitySelectVisual = true;
      this.isTipOutputVisual = false;
    },
    selectAddress(addressInfo) {
      //从提示中选择成功的回调
      this.isTipOutputVisual = false;

      this.addressName = addressInfo.name;

      this.lnglat = [addressInfo.location.lng, addressInfo.location.lat];
      this.regeoCode(this.lnglat)
        .then(res => {
          let obj = Object.assign({}, res.regeocode);
          obj.lnglat = this.lnglat;
          //根据起点还是终点将位置信息存储到对应的localStorage里
          this.setSelectedAddressInfo(JSON.stringify(obj));
          this.judgePath();
        })
        .catch(err => {});
    },

    setSelectedAddressInfo(data) {
      //存储地理逆解码后得到的位置信息
      let selectedAddressInfo =
        this.pointType === "startPointer"
          ? "selectedStartAddressInfo"
          : "selectedEndAddressInfo";
      localStorage.setItem(selectedAddressInfo, data);
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
    },
    handleSelectCity(city) {
      //选择中城市的回调
      this.city = city.name;
      localStorage.setItem("currentCity", city.name);
      this.isCitySelectVisual = false;
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
        font-size: 0.12rem;
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
    & > div:nth-child(1) {
      width: 2.4rem;
      display: inline-block;
      height: 0.4rem;
      padding: 0.2rem 0.1rem;
      & > p {
        overflow: hidden;
        white-space: nowrap;
        height: 0.2rem;
        line-height: 0.2rem;
      }
      & > .address-detail {
        font-size: 0.12rem;
        color: #868484;
      }
    }
    & > .submit-btn {
      display: inline-block;
      width: 0.8rem;
      height: 0.8rem;
      line-height: 0.8rem;
      vertical-align: bottom;
      text-align: center;
      padding: 0;
      & > span {
        padding: 0 0.2rem;
        width: 0.4rem;
        border-left: 0.01rem solid #868484;
      }
    }
  }

  #tipOutput {
    height: 100vh;
    position: absolute;
    top: 0.5rem;
    padding: 0.1rem 3%;
    width: 94%;
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
  #citySelecterWrap {
    position: absolute;
    top: 0.5rem;
    width: 100%;
  }
}
</style>
<style>
#map #cityInput {
  height: 0.3rem;
  border: 0;
  outline: 0;
  border-radius: 0;
  background-color: #efefef;
}
</style>