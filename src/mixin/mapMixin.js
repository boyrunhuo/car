import AMap from "AMap";
import Vue from "vue";
import { Toast } from "vant";
Vue.use(Toast);

export default {
    data() {
        return {
            // 地图实例
            GDMap: null,
            //拖拽定位实例
            positionPicker: null,
        }
    },
    methods: {
        regeoCode(lnglat) {
            //地理逆解码
            return new Promise((resolve, reject) => {
                AMap.plugin("AMap.Geocoder", () => {
                    let geocoder = new AMap.Geocoder();
                    geocoder.getAddress(lnglat, (status, result) => {
                        if (status === "complete" && result.regeocode) {
                            resolve(result)
                        } else {
                            reject({
                                status: status,
                                result: result
                            })
                         
                            Toast("查询位置失败,请重新选择位置");
                        }
                    });
                });
            })

        },
        mapInit(mapID) {
            //初始化地图
            return new Promise((resolve, reject) => {
                this.GDMap = new AMap.Map(mapID, {
                    zoom: 18,
                    center: [116.397428, 39.90923],
                    scrollWheel: false
                });
                //定位
                AMap.plugin("AMap.Geolocation", () => {
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true, //是否使用高精度定位，默认:true
                        timeout: 10000, //超过10秒后停止定位，默认：5s
                        buttonPosition: "RB", //定位按钮的停靠位置
                        buttonOffset: new AMap.Pixel(10, 100), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
                        // markerOptions: {
                        //     content:
                        //         '<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
                        // }
                    });
                    //添加精确定位插件
                    this.GDMap.addControl(geolocation);
                    geolocation.getCurrentPosition((status, result) => {
                        if (status == "complete") {
                            resolve(result)
                        } else {
                            reject({
                                status: status,
                                result: result
                            })
                        }
                    });
                });
            })
        },
        dragMap(mapID,successCallback,failCallback) {
            //拖拽定位
            AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {
           
                this.mapInit(mapID).then(() => {
                    this.positionPicker = new PositionPicker({
                        mode: 'dragMap',
                        map: this.GDMap
                    });
                    this.positionPicker.on('success', (positionResult) => {
                        successCallback(positionResult)
    
                    });
                    this.positionPicker.on('fail', (positionResult) => {
                        failCallback(positionResult)
                    });
    
                    this.positionPicker.start();
                    //panBy(x:Number,y:Number):以像素为单位，沿x方向和y方向移动地图，x向右为正，y向下为正
                    this.GDMap.panBy(0, 1);
                }).catch(() => {

                })
               
            });

        }
    }
}