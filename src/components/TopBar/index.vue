<template>
  <div id="topBar">
    <i class="el-icon-arrow-left" @click="goBack"></i>
    <p>{{title}}</p>
  </div>
</template>
<script>

export default {
  props: {
    title: {
      required: true,
      type: String
    }
  },
  data() {
    return {};
  },
  methods: {
    goBack() {
      this.$emit("goBack")
    }
  }
};
</script>
<style lang="scss" scoped>
$header-height: 0.4rem;
#topBar {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #ffffff;
  height: $header-height;
  line-height: $header-height;
  z-index: 1;
  box-shadow: 0 0 0.05rem #d8d0d0;
  & > i {
    height: $header-height;
    line-height: $header-height;
    position: absolute;
    left: 0.1rem;
  }
  & > p {
    text-align: center;
    height: $header-height;
    line-height: $header-height;
  }
}
</style>