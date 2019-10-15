<template>
  <div id="releaseRouter">
    <div class="release-router-header">
      <i class="el-icon-arrow-left"></i>
      <p>发布行程</p>
    </div>
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
          <el-input v-model="departTime" placeholder="出发时间"></el-input>
        </span>
        <span>
          <i class="el-icon-user"></i>
          <el-input v-model="departNumber" placeholder="出发人数"></el-input>
        </span>
      </div>
    </div>
    <mt-datetime-picker
      ref="picker"
      v-model="pickerVisible"
      @confirm="handleConfirm"
      year-format="{value}年"
      month-format="{value}月"
      :date-format="dateFormat"
      hour-format="{value}点"
      minute-format="{value}分"
    ></mt-datetime-picker>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startPointer: "",
      endPointer: "",
      departTime: null,
      departNumber: null,
      pickerVisible: "",

    };
  },
  created() {
    this.initData();
    console.log( `${this.$dayjs().$y}-${this.$dayjs().$M + 1}-${
          this.$dayjs().$D
        } ${this.$dayjs().$H + 1}:00:00`);
    
  },
  computed: {
    dateFormat() {
      let month = this.$dayjs().month() + 1;
      return `${month}月{value} 日`;
    }
  },
  methods: {
    initData() {
      //初始化数据
      this.startPointer = JSON.parse(
        localStorage.getItem("selectedStartAddressInfo")
      ).formattedAddress;
      this.endPointer = JSON.parse(
        localStorage.getItem("selectedEndAddressInfo")
      ).formattedAddress;
    },
    inputAddress(e, type) {
      localStorage.setItem("pointType", type);
      this.$router.push({
        name: "map"
      });
    },
    showDepartTimeSelecter() {
      //显示出发时间选择面板
      this.$refs.picker.open();
    },
    handleConfirm(time) {
        console.log('time',time);
        
      //点击时间选择确定的回调方法
    }
  }
};
</script>
<style lang="scss" scoped>
$release-router-header-height: 0.4rem;
$split-line: 0.01rem solid #e4e4e4;
#releaseRouter {
  background-color: #e8e8e8;
  height: 100vh;
  .release-router-header {
    height: $release-router-header-height;
    line-height: $release-router-header-height;
    background-color: #fff;

    & > p {
      height: $release-router-header-height;
      line-height: $release-router-header-height;
      text-align: center;
    }
    & > i {
      height: $release-router-header-height;
      line-height: $release-router-header-height;

      position: absolute;
      left: 0.1rem;
    }
  }
  .router-info-wrap {
    width: 3.2rem;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    box-shadow: 0 0 0.04rem #bfb4b4;
    padding: 0.1rem;
    background-color: #fff;
    top: 0.2rem;
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
      & > span {
        width: 1.6rem;
        display: inline-block;
        & > i {
          width: 0.2rem;
        }
        & > .el-input {
          width: 1.4rem;
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
#releaseRouter .mint-datetime-picker .picker-items > div:nth-child(1),
#releaseRouter .mint-datetime-picker .picker-items > div:nth-child(2) {
  display: none;
}
</style>