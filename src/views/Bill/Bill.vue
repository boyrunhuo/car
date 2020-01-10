<template>
  <div id="bill">
    <TopBar :title="'我的账单'" @goBack="goBack"></TopBar>
    <div class="bill-wrap">
      <van-dropdown-menu>
        <van-dropdown-item v-model="billDate" :options="dataOption" />
      </van-dropdown-menu>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="pull-wrap">
          <p class="bill-item">
            <span class="bill-item-title">总收入：</span>
            <span class="bill-item-value">{{billObj.income | billPricesFilter}}元</span>
          </p>
          <p class="bill-item">
            <span class="bill-item-title">总支出：</span>
            <span class="bill-item-value">{{billObj.expenses | billPricesFilter}}元</span>
          </p>
          <p class="bill-item">
            <span class="bill-item-title">账单状态：</span>
            <span
              class="bill-item-value"
              :style="{color:activeColor}"
            >{{billObj.settlement | billStatusFilter}}</span>
          </p>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import TopBar from "@/components/TopBar";
import { PullRefresh, DropdownMenu, DropdownItem } from "vant";
Vue.use(PullRefresh)
  .use(DropdownMenu)
  .use(DropdownItem);

export default {
  data() {
    return {
      isLoading: false,
      billDate: 0,
      dataOption: [
        { text: "当月账单", value: 0 },
        { text: "上月账单", value: 1 }
      ],
      billObj: {}
    };
  },
  components: {
    TopBar
  },
  created() {
    this.initData();
  },
  computed: {
    activeColor() {
      if (this.billObj.settlement) {
        return "green";
      } else {
        return "red";
      }
    }
  },
  watch: {
    billDate() {
      this.initData();
    }
  },
  filters: {
    billPricesFilter(val) {
      return val ? val : 0;
    },
    billStatusFilter(val) {
      return val ? "已结算" : "未结算";
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "personalCenter"
      });
    },
    initData() {
      if (this.billDate === 0) {
        this.getCurrentMonthBill();
      } else {
        this.getOriginMonthBill();
      }
    },
    getCurrentMonthBill() {
      this.billObj = {};

      //获取当月账单
      this.$http
        .get(`/account/get_account`)
        .then(res => {
          this.billObj = res.data;
        })
        .catch(err => {
          Toast("获取账单失败" || err.data.message);
        });
    },
    getOriginMonthBill() {
      this.billObj = {};
      let params = {
        dates: `${this.$dayjs().year()}-${this.$dayjs().month()}`
      };
      let formData = new FormData();
      for (let item in params) {
        formData.append(item, params[item]);
      }
      this.$http
        .post(`/account/get_origin_account`, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          }
        })
        .then(res => {
          this.billObj = res.data;
        })
        .catch(err => {
          Toast("获取账单失败" || err.data.message);
        });
    },
    onRefresh() {
      //下拉刷新
      setTimeout(() => {
        this.initData();
        this.isLoading = false;
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
#bill {
  background-color: #e8e8e8;
  height: 100vh;
  .bill-wrap {
    position: relative;
    top: 0.5rem;
    .pull-wrap {
      padding: 0.1rem;
      background-color: #fff;
      .bill-item {
        padding: 0.1rem;
        .bill-item-title {
        }
        .bill-item-value {
        }
      }
    }
  }
}
</style>
<style>
#bill .van-pull-refresh {
  background-color: #e8e8e8;
  height: calc(100vh - 1rem);
  overflow-y: scroll;
}
#bill .van-pull-refresh__track {
  height: calc(100vh - 1rem);
}
#bill .el-divider--horizontal {
  top: 0.24rem;
  margin: 0;
}
</style>