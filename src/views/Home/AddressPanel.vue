<template>
  <div id="addressPanel">
    <div class="character-select">
      <span @click="selectCharacter('passenger')" :class="{selected:isPassenger}">乘客</span>
      <span @click="selectCharacter('driver')" :class="{selected:isDriver}">司机</span>
    </div>

    <div class="address-form">
      <transition  :enter-active-class="enterClass">
        <div v-show="isShowAddressForm">
          <div class="address-input">
            <img src="../../assets/portal_start_icon.png" />
            <el-input
              v-model="startPointerInfo.formattedAddress"
              placeholder="你从哪出发"
              @focus="checkAddress($event,'startPointer')"
            ></el-input>
          </div>
          <div class="address-input">
            <img src="../../assets/portal_end_icon.png" />
            <el-input
              v-model="endPointerInfo.formattedAddress"
              placeholder="你想要去哪"
              @focus="checkAddress($event,'endPointer')"
            ></el-input>
          </div>
          <p class="tips">常用目的地 : 添加后可快速输入终点</p>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
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
      enterClass: ""
    };
  },
  methods: {
    selectCharacter(character) {
      if (character === "passenger") {
        this.animationSwitch("faster fadeInLeft");
        this.isPassenger = true;
      } else {
        this.animationSwitch("faster fadeInRight");
        this.isPassenger = false;
      }
      this.isDriver = !this.isPassenger;
      this.isShowAddressForm = false;
      setTimeout(() => {
        this.isShowAddressForm = true;
      }, 100);
    },
    animationSwitch(event) {
      this.enterClass = `animated  ${event}`;
    },
    checkAddress(e, type) {
      //输入地址
      localStorage.setItem('pointType',type)
      this.$router.push({
        name: "map",
      });
    },
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