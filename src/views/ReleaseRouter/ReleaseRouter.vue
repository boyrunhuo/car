<template>
  <div id="releaseRouter">
    <TopBar :title="'发布行程'" @goBack="backToHome"></TopBar>
    <div class="router-info-wrap">
      <div class="start-pointer" @click="inputAddress($event,'startPointer')">
        <div>
          <span class="pointer"></span>
        </div>
        <el-input v-model="startPointer"></el-input>
      </div>
      <div class="end-pointer" @click="inputAddress($event,'endPointer')">
        <div>
          <span class="pointer"></span>
        </div>
        <el-input v-model="endPointer"></el-input>
      </div>
      <div class="another-info">
        <span @click="showDepartTimeSelecter">
          <i class="el-icon-time"></i>
          <el-input disabled="disabled" v-model="departTimeLabel" placeholder="出发时间"></el-input>
        </span>
        <span @click="showDepartMemberSelecter">
          <i class="el-icon-user"></i>
          <el-input disabled="disabled" v-model="departMember" placeholder="出发人数"></el-input>
        </span>
        <!-- <p>{{detourMiles}}</p> -->
      </div>
    </div>
    <van-popup v-model="isTimePickerVisual" position="bottom">
      <p class="member-title">
        <b>请选择出发时间</b>
        <i class="el-icon-close" @click="handleTimePickerCancel"></i>
      </p>
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="handleTimePickerCancel"
        @change="handleTimePickerChange"
        title="请选择出发时间"
        :filter="timeFilter"
        :formatter="timeFormatter"
        :class="[{isShowYear:!isShowYear,isShowMonth:!isShowMonth}]"
      />
      <el-button type="primary" class="submit-btn" @click="handleTimePickerConfirm">确定</el-button>
    </van-popup>
    <van-popup v-model="isMemberPickerVisual" position="bottom">
      <p class="member-title">
        <b>请选择出行人数</b>
        <i class="el-icon-close" @click="handleMemberPickerCancel"></i>
      </p>
      <div class="member-wrap">
        <div @click="selectMember(1)" :class="{isSelectedMember:isSelectedMemberIndex === 1}">
          <span>1</span>
          <span>人</span>
        </div>
        <div @click="selectMember(2)" :class="{isSelectedMember:isSelectedMemberIndex === 2}">
          <span>2</span>
          <span>人</span>
        </div>
        <div @click="selectMember(3)" :class="{isSelectedMember:isSelectedMemberIndex === 3}">
          <span>3</span>
          <span>人</span>
        </div>
        <div @click="selectMember(4)" :class="{isSelectedMember:isSelectedMemberIndex === 4}">
          <span>4</span>
          <span>人</span>
        </div>
      </div>
      <el-button type="primary" class="submit-btn" @click="handleMemberPickerConfirm">确定</el-button>
    </van-popup>
    <!-- <van-popup v-model="isDetourMilesVisual" v-if="character === 'driver'" position="bottom">
      <p class="detourMiles-title">
        <b>允许绕路公里数</b>
        <i class="el-icon-close" @click="handleMilesPickerCancel"></i>
      </p>

      <el-button type="primary" class="submit-btn" @click="handleTimePickerConfirm">确定</el-button>
    </van-popup> -->
    <div class="release-router-footer">
      <div class="release-router-footer-msg">
        <p class="release-router-footer-money" v-if="distance !== null">{{distance}}km</p>
        <p class="release-router-footer-money" v-if="moneyCost !== null">
          价格
          <span>{{moneyCost}}</span>元
          <i class="el-icon-arrow-right" @click="checkMoneyRule"></i>
        </p>
      </div>
      <el-button
        :type="submitBtnType"
        class="submit-btn"
        :disabled="submitBtnDisabled"
        @click="submitOrder"
      >{{submitBtnText}}</el-button>
    </div>
  </div>
</template>
<script>
//按需引入Vant UI组件
import Vue from "vue";
import { DatetimePicker, Popup, Toast, Dialog, Picker } from "vant";
import utils from "@/utils";
import TopBar from "@/components/TopBar";

Vue.use(DatetimePicker)
  .use(Popup)
  .use(Toast)
  .use(Dialog)
  .use(Picker);

export default {
  data() {
    return {
      selectedStartAddressInfo: {},
      selectedEndAddressInfo: {},
      character: "",
      startPointer: "",
      endPointer: "",
      departTime: null, //出发时间
      departTimeLabel: null, //出发时间显示
      departMember: null, //出发人数,
      detourMiles: 3, //允许绕路公里数
      isTimePickerVisual: false,
      isMemberPickerVisual: false,
      isDetourMilesVisual: false,
      currentDate: new Date(),
      currentTimeList: [],
      minDate: new Date(new Date().getTime() + 3600 * 1000 * 0.5),
      maxDate: new Date(new Date().getTime() + 3600 * 1000 * 24 * 30),
      isSelectedMemberIndex: 1,
      submitBtnDisabled: true,
      submitBtnType: "info",
      submitBtnText: "预约顺风车",
      distance: null, //起终点距离
      moneyCost: null //订单价格
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initData();
    });
  },
  computed: {
    isShowYear() {
      //是否显示年限
      if (this.$dayjs(this.maxDate).year() > this.$dayjs(this.minDate).year()) {
        //如果跨年了，显示年
        return true;
      } else {
        return false;
      }
    },
    isShowMonth() {
      //是否显示月份
      if (
        this.$dayjs(this.maxDate).month() > this.$dayjs(this.minDate).month()
      ) {
        //如果跨月了，显示月
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    submitBtnDisabled(val) {
      this.submitBtnType = !val ? "primary" : "info";
      if (!val) {
        //如果可以发起订单了，给出预估价格
        this.getMoney();
      }
    },
    departTimeLabel(val) {
      if (val && this.departMember) {
        this.submitBtnDisabled = false;
      } else {
        this.submitBtnDisabled = true;
      }
    },
    departMember(val) {
      if (val && this.departTimeLabel) {
        this.submitBtnDisabled = false;
      } else {
        this.submitBtnDisabled = true;
      }
    }
  },
  components: {
    TopBar
  },
  methods: {
    backToHome() {
      this.$router.push({
        name: "home"
      });
    },
    initData() {
      //初始化数据
      this.character = this.$storage.get("character");
      this.submitBtnText =
        this.character === "passenger" ? "预约顺风车" : "发起行程等待乘客";
      //初始化起点
      this.selectedStartAddressInfo = this.$storage.get(
        "selectedStartAddressInfo"
      );
      this.startPointer = utils.addSuffix(
        this.selectedStartAddressInfo.formattedAddress,
        16
      );
      //初始化终点
      this.selectedEndAddressInfo = this.$storage.get("selectedEndAddressInfo");
      this.endPointer = utils.addSuffix(
        this.selectedEndAddressInfo.formattedAddress,
        16
      );
      //显示出发时间选择面板
      this.isTimePickerVisual = true;
    },
    inputAddress(e, type) {
      this.$storage.set("pointType", type);
      this.$router.push({
        name: "map"
      });
    },
    showDepartTimeSelecter() {
      //显示出发时间选择面板
      this.currentTimeList = [];
      this.isTimePickerVisual = true;
    },
    showDepartMemberSelecter() {
      //显示出行人数选择面板
      this.isMemberPickerVisual = true;
    },
    handleTimePickerConfirm() {
      //点击时间选择器"确认"按钮
      let timeObj = {
        year: this.currentTimeList[0].replace("年", ""),
        month: this.currentTimeList[1].replace("月", ""),
        day: this.currentTimeList[2].replace("日", ""),
        hour: this.currentTimeList[3].replace("点", ""),
        minute: this.currentTimeList[4].replace("分", "")
      };
      const { year, month, day, hour, minute } = timeObj;
      //出发时间
      this.departTime = `${year}-${month}-${day} ${hour}:${minute}`;
      //显示出发时间
      this.departTimeLabel = `${month}月${day}日 ${hour}:${minute}`;

      this.isTimePickerVisual = false;
      //显示出行人数选择面板
      if (!this.departMember) {
        this.isMemberPickerVisual = true;
      }
    },
    handleTimePickerCancel() {
      //点击时间选择器"取消"按钮
      this.isTimePickerVisual = false;
    },
    handleTimePickerChange(picker) {
      //时间选择器改变
      this.currentTimeList = picker.getValues();
    },
    handleMemberPickerCancel() {
      //人数选择面板取消按钮
      this.isMemberPickerVisual = false;
    },
    handleMilesPickerCancel() {
      //允许绕路公里数选择面板
      this.isDetourMilesVisual = false;
    },
    selectMember(member) {
      //点选人数
      this.isSelectedMemberIndex = member;
    },
    handleMemberPickerConfirm() {
      //选定人数
      this.departMember = this.isSelectedMemberIndex + "人";
      this.isMemberPickerVisual = false;
      //显示出行时间选择面板
      if (!this.departTime) {
        this.isTimePickerVisual = true;
      }
    },
    timeFilter(type, options) {
      //时间过滤器
      if (type === "minute") {
        return options.filter(option => option % 5 === 0);
      }

      return options;
    },
    timeFormatter(type, value) {
      //格式化时间type：year，month，day，hour，minute
      let year, month, day, hour, minute;
      switch (type) {
        case "year":
          year = `${value}年`;
          this.currentTimeList[0] = year;
          return year;
        case "month":
          month = `${value}月`;
          this.currentTimeList[1] = month;
          return month;
        case "day":
          day = `${value}日`;
          this.currentTimeList[2] = day;
          return day;
        case "hour":
          hour = `${value}点`;
          this.currentTimeList[3] = hour;
          return hour;
        case "minute":
          minute = Number(value - (value % 5)) + Number(value % 5 == 0 ? 0 : 5);
          if (minute < 10) {
            minute = 0 + String(minute);
          }
          minute = `${minute}分`;
          this.currentTimeList[4] = minute;
          return minute;
        default:
          break;
      }
    },
    submitOrder() {
      //提交订单，预约顺风车
      let goOffTime = this.$dayjs(this.departTime);
      let params = {
        goOffTime: this.$dayjs(this.departTime).valueOf(),
        origin: this.selectedStartAddressInfo.lnglat.join(),
        destination: this.selectedEndAddressInfo.lnglat.join(),
        originName: this.selectedStartAddressInfo.formattedAddress,
        destinationName: this.selectedEndAddressInfo.formattedAddress,
        passengerNum: this.departMember.replace("人", ""),
        remark: "无"
      };
      if (this.character === "passenger") {
        //乘客发起订单

        this.$http
          .post(`/order/create_passenger_order`, params)
          .then(res => {
            this.$storage.set("orderDetail", res.data);

            this.$router.push({
              name: "matchOrderList"
            });
          })
          .catch(err => {
            Toast(err.data.message || "创建订单失败!");
          });
      } else if (this.character === "driver") {
        //车主发起订单,增加一个绕路公里数
        params.detourMiles = this.detourMiles;
        this.$http
          .post(`/order/create_driver_order`, params)
          .then(res => {
            this.$storage.set("orderDetail", res.data);

            this.$router.push({
              name: "matchOrderList"
            });
          })
          .catch(err => {
            Toast(err.data.message || "创建订单失败!");
          });
      }
    },
    getMoney() {
      //获取预估价格
      let params = {
        origin: this.selectedStartAddressInfo.lnglat.join(),
        destination: this.selectedEndAddressInfo.lnglat.join(),
        passengerNum: this.departMember.replace("人", "")
      };
      let formData = new FormData();
      for (let item in params) {
        formData.append(item, params[item]);
      }
      this.$http
        .post(`/order/get_money_cost`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        })
        .then(res => {
          let { moneyCost, distance } = res.data;
          this.moneyCost = moneyCost;
          this.distance = distance;
        })
        .catch(err => {});
    },
    checkMoneyRule() {
      //获取价格规则
      this.$http
        .get(`/order/get_bill_rules`)
        .then(res => {
          Dialog.alert({
            message: res.data.rules
          }).then(() => {});
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
$split-line: 0.01rem solid #e4e4e4;
#releaseRouter {
  background-color: #e8e8e8;
  height: 100vh;

  .router-info-wrap {
    width: 3.2rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 0.04rem #bfb4b4;
    padding: 0.1rem;
    background-color: #fff;
    top: 0.5rem;
    border-radius: 0.05rem;
    .start-pointer,
    .end-pointer {
      border-bottom: $split-line;

      & > div:nth-child(1) {
        width: 0.2rem;
        text-align: center;
        display: inline-block;
      }

      .el-input {
        width: 3rem;
      }
      .pointer {
        width: 0.1rem;
        height: 0.1rem;
        border-radius: 50%;
        display: inline-block;
      }
    }
    .start-pointer {
      .pointer {
        background-color: #409eff;
      }
    }
    .end-pointer {
      .pointer {
        background-color: #67c23a;
      }
    }

    .another-info {
      & > span:nth-child(1) {
        width: 2rem;
        display: inline-block;
        & > i {
          width: 0.2rem;
        }
        & > .el-input {
          width: 1.8rem;
        }
      }
      & > span:nth-child(2) {
        width: 1.2rem;
        display: inline-block;
        & > i {
          width: 0.2rem;
        }
        & > .el-input {
          width: 1rem;
        }
      }
    }
  }
  .submit-btn {
    width: 3.4rem;
    margin: 0.1rem 0;
    text-align: center;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .member-title {
    padding: 0.1rem;
    & > i {
      float: right;
    }
  }
  .member-wrap {
    display: flex;
    justify-content: space-between;
    padding: 0.1rem;
    & > div {
      border: 0.01rem solid #efefef;
      width: 0.7rem;
      height: 0.7rem;
      border-radius: 0.05rem;
      text-align: center;
      & > span {
        height: 0.7rem;
        line-height: 0.7rem;
        color: #636060;
      }
      & > span:nth-child(1) {
        font-size: 0.24rem;
        font-weight: 600;
      }
    }
    & > .isSelectedMember {
      border: 0.01rem solid #03a9f4;
      background-color: #ebf5ff;

      & > span {
        color: #03a9f4;
      }
    }
  }
  .release-router-footer {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    background-color: #fff;
    .release-router-footer-msg {
      .release-router-footer-money {
        text-align: center;
        font-size: 0.14rem;
        color: #928c8c;
        & > span {
          font-size: 0.2rem;
          color: #000;
        }
      }
    }
  }
}
</style>
<style>
#releaseRouter .router-info-wrap .el-input__inner {
  border: 0;
}
#releaseRouter .el-input.is-disabled .el-input__inner {
  background: #fff;
  color: #606266;
}
#releaseRouter
  .isShowYear
  .van-picker__columns
  .van-picker-column:nth-child(1) {
  display: none;
}
#releaseRouter
  .isShowMonth
  .van-picker__columns
  .van-picker-column:nth-child(2) {
  display: none;
}

#releaseRouter .van-picker__toolbar {
  display: none;
}
</style>