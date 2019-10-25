<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
/* @import "./assets/fonts/font.css"; */

@font-face {
  font-family: WenQuanWeiMiHei;
  /* 路径为绝对路径 */
  src: url("/assets/fonts/WenQuanWeiMiHei.ttf")  ;
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: BASE;
  src: local("Microsoft Yahei");
}
html,
body {
  height: 100%;
  font-size: 0.16rem;
  font-family:BASE
}
* {
  margin: 0;
  padding: 0;

}
</style>
