<template>
  <div id="addCommonRoute">
    <TopBar :title="'添加常用路线'" @goBack="goBack"></TopBar>
    <div class="add-common-route-wrap">
      <div class="common-start-pointer">
        <div class="pointer"></div>
        <el-input
          id="startPointeAddress"
          v-model="startPointeAddress"
          placeholder="常用出发地"
          @focus="checkAddress($event,'startPointer')"
        ></el-input>
      </div>
      <div class="common-end-pointer">
        <div class="pointer"></div>
        <el-input
          id="endPointeAddress"
          v-model="endPointeAddress"
          placeholder="常用目的地"
          @focus="checkAddress($event,'endPointer')"
        ></el-input>
      </div>
    </div>
    <el-button
      :type="btnType"
      :disabled="isBtnDisabled"
      @click="addRoute"
      class="add-route-btn"
    >{{submitBtnText}}</el-button>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar";
import Vue from "vue";
import { Toast } from "vant";
import utils from "@/utils";
import routeMixin from "@/mixin/routeMixin";
Vue.use(Toast);

export default {
  data() {
    return {
      startPointeAddress: "",
      endPointeAddress: "",
      commonStartPoint: {},
      commonEndPoint: {},
      isBtnDisabled: true,
      btnType: "info",
      fromRoute: "",
      submitBtnText: "添加常用路线",
      orderId: null
    };
  },
  mixins: [routeMixin],
  components: {
    TopBar
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== "map") {
      this.$storage.remove("commonStartPoint");
      this.$storage.remove("commonEndPoint");
    }
    next();
  },
  created() {
    this.initData();
  },
  mounted() {
    utils.scroll("startPointeAddress");
    utils.scroll("endPointeAddress");
  },
  watch: {
    startPointeAddress(val) {
      if (val && this.endPointeAddress) {
        this.isBtnDisabled = false;
        this.btnType = "primary";
      }
    },
    endPointeAddress(val) {
      if (val && this.startPointeAddress) {
        this.isBtnDisabled = false;
        this.btnType = "primary";
      }
    }
  },
  methods: {
    initData() {
      this.commonStartPoint = this.$storage.get("commonStartPoint");
      this.commonEndPoint = this.$storage.get("commonEndPoint");
      this.startPointeAddress =
        this.commonStartPoint && this.commonStartPoint.formattedAddress
          ? this.commonStartPoint.formattedAddress
          : "";
      this.endPointeAddress =
        this.commonEndPoint && this.commonEndPoint.formattedAddress
          ? this.commonEndPoint.formattedAddress
          : "";
      this.fromRoute = this.getRouteHistory();
      this.orderId = this.$storage.get("orderId")
      this.submitBtnText =  this.orderId !== null ? '修改常用路线' : '添加常用路线'
    },
    goBack() {
      if (
        this.orderId !== null
      ) {
        this.$router.push({
          name: "mangeCommonRoute"
        });
      } else {
        this.$router.push({
          name: "home"
        });
      }
      this.$storage.remove("orderId");
    },
    addRoute() {
      let params = {
        originName: this.commonStartPoint.formattedAddress,
        origin: this.commonStartPoint.lnglat.join(),
        destinationName: this.commonEndPoint.formattedAddress,
        destination: this.commonEndPoint.lnglat.join()
      };
      if (this.orderId !== null) {
        params.id = this.orderId;
        this.$http
          .post(`/order/update_regular_order`, params)
          .then(res => {
            Toast(res.data.message || "修改常用路线成功");
            this.$router.push({
              name: "mangeCommonRoute"
            });
            this.$storage.remove("orderId");
          })
          .catch(err => {
            Toast(err.data.message || "修改常用路线失败");
          });
      } else {
        this.$http
          .post(`/order/create_regular_order`, params)
          .then(res => {
            Toast(res.data.message || "创建常用路线成功");
            this.$router.push({
              name: "home"
            });
          })
          .catch(err => {
            Toast(err.data.message || "创建常用路线失败");
          });
      }
    },
    checkAddress(e, type) {
      //输入地址
      // this.$storage.set("fromRoute", this.$route.name);
      this.setRouteHistory();
      this.$storage.set("pointType", type);
      this.$router.push({
        name: "map"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#addCommonRoute {
  height: 100%;
  .add-common-route-wrap {
    position: relative;
    top: 0.6rem;
    width: 3rem;
    box-shadow: 0 0.02rem 0.08rem #928f8f;
    padding: 0.2rem;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0.05rem;
    .pointer {
      width: 0.1rem;
      height: 0.1rem;
      border-radius: 50%;
      display: inline-block;
    }
    .common-start-pointer {
      .pointer {
        background-color: #409eff;
      }
    }
    .common-end-pointer {
      .pointer {
        background-color: #67c23a;
      }
    }
  }
}
</style>
<style>
#addCommonRoute .el-input__inner {
  color: #000;
  border: 0;
  border-bottom: 1px solid #b3b3b3;
  border-radius: 0;
  padding: 0;
}
#addCommonRoute .el-input {
  width: 2.6rem;
  margin-left: 0.1rem;
}
#addCommonRoute .add-route-btn {
  position: absolute;
  bottom: 0.2rem;
  width: 3.4rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>