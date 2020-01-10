<template>
  <div id="applyDriver">
    <TopBar :title="'车主认证'" @goBack="goBack"></TopBar>
    <div class="apply-driver-wrap">
      <el-form
        ref="applyDriverRef"
        :model="applyDriverForm"
        :rules="applyDriverRule"
        label-width="1.2rem"
      >
        <el-form-item label="车牌号码：" prop="carplate">
          <el-input v-model="applyDriverForm.carplate" placeholder="区分大小写(例如:粤A12345)"></el-input>
        </el-form-item>
        <el-form-item label="车辆类型：" prop="modelOfCar">
          <el-radio-group v-model="applyDriverForm.modelOfCar">
            <el-radio :label="'轿车'">轿车</el-radio>
            <el-radio :label="'suv'">suv</el-radio>
            <el-radio :label="'其他'">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="车辆颜色：" prop="carColor">
          <el-input v-model="applyDriverForm.carColor" placeholder="例如:白"></el-input>
        </el-form-item>
        <el-form-item label="可载客数：" prop="carSeat">
          <el-input-number v-model="applyDriverForm.carSeat" :min="1" :max="7" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" id="submitBtn" @click="submitDriverApply">发起车主认证</el-button>
  </div>
</template>
<script>
import TopBar from "@/components/TopBar";
import { Toast } from "vant";
import Vue from "vue";
Vue.use(Toast);

export default {
  data() {
    return {
      applyDriverForm: {
        carplate: "",
        carSeat: 4,
        carColor: "",
        modelOfCar: "轿车"
      },
      applyDriverRule: {
        carplate: [
          {
            required: true,
            validator: this.carplateEmptyValidator,
            trigger: "blur"
          },
          { required: true, validator: this.carplateValidator, trigger: "blur" }
        ],
        carColor: [
          {
            required: true,
            validator: this.carColorEmptyValidator,
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    TopBar
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "home"
      });
    },
    carplateEmptyValidator(rule, value, callback) {
      if (value.trim() === "") {
        callback(new Error("车牌号不能为空"));
      } else {
        callback();
      }
    },
    carplateValidator(rule, value, callback) {
      var reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      let realValue = this.replaceBlank(value);
      if (!reg.test(realValue)) {
        callback(new Error("车牌号码格式不正确"));
      } else {
        callback();
      }
    },
    carColorEmptyValidator(rule, value, callback) {
      if (this.replaceBlank(value) === "") {
        callback(new Error("车辆颜色不能为空"));
      } else {
        callback();
      }
    },
    replaceBlank(value) {
      //去除空格
      if (typeof value === "string") {
        return value.replace(/\s+/g, "");
      } else {
        return value;
      }
    },
    submitDriverApply() {
      this.$refs["applyDriverRef"].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.applyDriverForm);
          Object.keys(params).map(item => {
            params[item] = this.replaceBlank(params[item]);
          });
          console.log(params);

            this.$http
              .post(`/user/register_driver`, params)
              .then(res => {
                this.resetForm("applyDriverRef");
                Toast(res.data.message || "发起车主认证成功");
                this.goBack();
              })
              .catch(err => {
                Toast(err.data.message || "发起车主认证失败");
              });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
#applyDriver {
  background-color: #e8e8e8;
  height: 100vh;
  .apply-driver-wrap {
    position: relative;
    padding-top: 0.2rem;
  }
  #submitBtn {
    width: calc(100vw - 0.2rem);
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
<style>
#applyDriver .el-form-item {
  background-color: #fff;
}
#applyDriver .el-input__inner {
  border-radius: 0;
  border: 0;
  padding: 0;
}
#applyDriver #topBar {
  position: static;
}
#applyDriver .el-input-number {
  width: 90%;
}
</style>