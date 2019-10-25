<template>
  <div id="citySelecter">
    <div class="current-city-wrap">
      <p>当前定位城市</p>
      <div>
        <span>
          <b>{{city}}</b>
        </span>
      </div>
    </div>
    <div class="city-list-wrap">
      <ul v-for="item in cityList" :key="item.province">
        <p>{{item.province}}</p>
        <li
          v-for="element in item.city"
          :key="element.citycode"
          @click="selectCity(element)"
        >{{element.name}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      city: "",
      provinceList: ["广东"],
      cityList: []
    };
  },
  created() {
    this.initCity();
    this.initCityList();
  },
  methods: {
    initCity() {
      //初始化城市
      let currentCity = localStorage.getItem("currentCity");
      this.city = currentCity ? currentCity : "";
    },
    initCityList() {
      //初始化城市列表
      AMap.plugin("AMap.DistrictSearch", () => {
        let districtSearch = new AMap.DistrictSearch({
          level: "city",
          subdistrict: 1,
          showbiz: false
        });

        this.provinceList.map(province => {
          districtSearch.search(province, (status, result) => {
            if (status === "complete") {
              this.cityList.push({
                province: province,
                city: result.districtList[0].districtList
              });
            }
          });
        });
      });
    },
    searchCity(city) {
      console.log("searchCity", city);
      AMap.plugin("AMap.DistrictSearch", () => {
        let districtSearch = new AMap.DistrictSearch({
          level: "city",
          subdistrict: 1,
          showbiz: false
        });

        // 搜索所有省/直辖市信息
        districtSearch.search(city, (status, result) => {
          console.log(status, result);
        });
      });
    },
    selectCity(city) {
      //选择城市的回调
      this.$emit("handleSelectCity", city);
    }
  }
};
</script>
<style lang="scss" scoped>
#citySelecter {
  height: 100vh;
  background-color: #efefef;

  .current-city-wrap {
    background-color: #fff;
    padding: 0.1rem;
  }
  .city-list-wrap {
    & > ul {
      background-color: #fff;
      margin-top: 0.2rem;
      padding: 0.1rem;
      & > p {
        padding: 0.1rem;
        font-size: 0.24rem;
        background-color: #efefef;
      }
      & > li {
        border-bottom: 0.01rem solid #efefef;
        padding: 0.1rem;
        font-size: 0.16rem;
      }
    }
  }
}
</style>