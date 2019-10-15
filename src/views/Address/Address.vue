<template>
  <div id="address">
    <div class="address-header">
      <i class="el-icon-back"></i>
      <div class="search-input-wrap">
        <i class="el-icon-search"></i>
        <input id="tipinput" v-model="addressName" :placeholder="inputPlaceholder" />
      </div>
    </div>
  </div>
</template>

<script>
import AMap from "AMap";
export default {
  data() {
    return {
      addressName: "",
      autoInput: {},
      inputPlaceholder: "",
      city: "广州"
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.$route.params.type) {
        if (vm.$route.params.type === "startPointer") {
          vm.inputPlaceholder = "请输入关键字";
          vm.addressName = vm.$route.params.addressInfo.formattedAddress;
        } else if (vm.$route.params.type === "endPointer") {
          vm.inputPlaceholder = "请输入目的地";
        }
      }
    });
  },
  mounted() {
    this.autoInputTip();
  },
  methods: {
    autoInputTip() {
      //添加自动提示
      AMap.plugin("AMap.Autocomplete", () => {
        this.autoInput = new AMap.Autocomplete({
          input: "tipinput"
        });
        this.autoInput.setCity(this.city);
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#address {
  .address-header {
    background-color: #409eff;
    height: 0.5rem;
    .search-input-wrap {
      border: 0.01rem solid black;
      border-radius: 0.05rem;
      display: inline-block;
      height: 0.3rem;
      line-height: 0.3rem;
      #tipinput {
        outline: none;
        border: 0;
        background-color: #409eff;
        height: 0.3rem;
        line-height: 0.3rem;
        vertical-align: middle;
      }
    }
  }
}
</style>
