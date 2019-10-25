<template>
  <div id="addressPanel">
    <div class="character-select">
      <span @click="selectCharacter('passenger')" :class="{selected:isPassenger}">乘客</span>
      <span @click="selectCharacter('driver')" :class="{selected:isDriver}">车主</span>
    </div>

    <div class="address-form">
      <transition :enter-active-class="enterClass">
        <div v-show="isShowAddressForm && !isShowDriverAuth">
          <div class="address-input">
            <img src="@/assets/img/portal_start_icon.png" />
            <el-input
              v-model="startPointerAddressName"
              placeholder="你从哪出发"
              id="startPointerAddressName"
              @focus="checkAddress($event,'startPointer')"
            ></el-input>
          </div>
          <div class="address-input">
            <img src="@/assets/img/portal_end_icon.png" />
            <el-input
              v-model="endPointerAddressName"
              placeholder="你想要去哪"
              id="endPointerAddressName"
              @focus="checkAddress($event,'endPointer')"
            ></el-input>
          </div>
          <p class="tips">常用目的地 : 添加后可快速输入终点</p>
        </div>
      </transition>
      <transition :enter-active-class="enterClass">
        <div v-show="isShowDriverAuth" class="driver-auth-wrap">
          <el-button type="primary" class="submit-Btn" @click="toApplyDriver">认证成为车主</el-button>
          <p class="tips">通过车主认证即可接单</p>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import utils from "@/utils";

export default {
  props: {
    startPointerInfo: {
      type: Object
    },
    endPointerInfo: {
      type: Object
    }
  },
  data() {
    return {
      isPassenger: true,
      isDriver: false,
      isShowAddressForm: true,
      isShowDriverAuth: false,
      enterClass: "",
      driverAuth: false //是否通过车主验证
    };
  },
  created() {
    this.judgeCharacter();
  },
  mounted() {
    utils.scroll("startPointerAddressName");
    utils.scroll("endPointerAddressName");
  },
  computed: {
    startPointerAddressName() {
      if (this.startPointerInfo.formattedAddress) {
        let formattedAddress = this.startPointerInfo.formattedAddress;
        return formattedAddress;
        // return utils.addSuffix(formattedAddress, 15);
      } else {
        return "";
      }
    },
    endPointerAddressName() {
      if (this.endPointerInfo.formattedAddress) {
        let formattedAddress = this.endPointerInfo.formattedAddress;
        return formattedAddress;
        // return utils.addSuffix(formattedAddress, 15);
      } else {
        return "";
      }
    }
  },
  methods: {
    selectCharacter(character) {
      //用户类型选择，乘客或车主，如果是车主，需要通过车主验证
      localStorage.setItem("character", character);
      if (character === "passenger") {
        this.animationSwitch("faster fadeInLeft");
        this.isPassenger = true;
        this.isShowDriverAuth = false;
      } else {
        this.animationSwitch("faster fadeInRight");
        this.isPassenger = false;
      }
      this.isDriver = !this.isPassenger;
      if (character === "driver") {
        //如果是司机

        if (this.driverAuth) {
          //通过车主验证
          this.isShowDriverAuth = false;
        } else {
          //未通过车主验证
          this.isShowDriverAuth = true;
        }
      }
      //过场动画显示
      this.isShowAddressForm = false;
      setTimeout(() => {
        this.isShowAddressForm = true;
      }, 100);
    },
    animationSwitch(event) {
      //动画选择
      this.enterClass = `animated  ${event}`;
    },
    checkAddress(e, type) {
      //输入地址
      localStorage.setItem("pointType", type);
      this.$router.push({
        name: "map"
      });
    },
    judgeCharacter() {
      //判断用户类型
      if (localStorage.getItem("character")) {
        if (localStorage.getItem("character") === "passenger") {
          this.isPassenger = true;
        } else if (localStorage.getItem("character") === "driver") {
          this.isPassenger = false;
        }
      }
      this.isDriver = !this.isPassenger;
      if (this.isDriver && !this.driverAuth) {
        this.isShowDriverAuth = true;
      }
    },
    toApplyDriver() {
      //认证成为车主
      this.$router.push({
        name: "applyDriver"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#addressPanel {
  width: 3.4rem;

  .character-select {
    color: #efefef;
    margin-bottom: 0.14rem;
    & > span:nth-child(1) {
      margin-right: 0.1rem;
    }
    .selected {
      color: #fff;
      font-weight: 500;
    }
  }
  .address-form {
    background-color: #fff;
    box-shadow: 0 0.02rem 0.08rem #928f8f;
    padding: 0.2rem;
    border-radius: 0.05rem;
    overflow: hidden;
    height: 1.2rem;
    .address-input {
      & > img {
        vertical-align: middle;
        height: 0.2rem;
      }
    }

    .tips {
      margin-top: 0.1rem;
      color: #928f8f;
      font-size: 0.12rem;
    }
  }
  .driver-auth-wrap .submit-Btn {
    width: 3rem;
    margin: 0.1rem 0;
    text-align: center;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
<style>
#addressPanel .el-input__inner {
  color: #000;
  border: 0;
  border-bottom: 1px solid #928f8f;
  border-radius: 0;
  padding: 0;
}
#addressPanel .el-input {
  width: 2.6rem;
  margin-left: 0.1rem;
}
</style>