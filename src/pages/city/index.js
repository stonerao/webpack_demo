import "./index.less";
import City from './city';
import Vue from 'vue/dist/vue.js'
import axios from '../../utils/axios'
import PerfectScrollbar from 'perfect-scrollbar'
import "perfect-scrollbar/css/perfect-scrollbar.css";
let dom = document.getElementById("main")
let query = GetRequest();
let VM = new Vue({
    el: "#app",
    data() {
        return {
            title: "网络安全威胁回放",
            unitId: 90000001,
            select_threat: 20,//选择的条数
            is_select_threat: false,//是否选择
            select_items: [20, 50, 100, 200],//提供选择列表
            show_state: 0,//显示状态码
            threat_items: [],
            threat_scroll: null,
            infos_scroll: null,
            content_scroll: null,
            select_index: 0,
            show_items: {
                date: "",
                type: "",
                step: [],
                list: [],
                ae: [],
                id: '',
                attachment: ""
            },
            interval: null,
            is_play: false,//暂停播放
            show_play: true,//是否显示暂停播放
            is_expand: false,//滚动播放是否展开
            _city: null,
            title_class: "",
            list_class_quit: "",
            ws: null,
            test_data: {}
        }
    },
    created() {
        this.unitId = query.unit || "all";
        this._city = new City({
            width: dom.offsetWidth,
            height: dom.offsetHeight - 3,
            id: "city",
            stats: true,
            Vue: this
        })
        setTimeout(()=>{
            this.load()
        },2000)
        document.getElementById("app").style.display = ""
        document.querySelector("body").removeChild(document.getElementById("loading"))
    },
    methods: {
        socket(func) {
            this.ws = new WebSocket(`ws://172.18.0.23/${query.city}/api/websocket/microSituation`);
            this.ws.onopen = () => { 
                this.ws.send(JSON.stringify({ "unitId": this.unitId.toString() }))
                console.log(typeof func)
                typeof func =='function'?func():'';
            };
            this.ws.onmessage = e => {
                if (e.data === "Connect micro situation successful") return;
                let data = JSON.parse(e.data);
                if (!data.kg.list) {
                    return
                } 

                this.threat_items.unshift({
                    attachment: data.attachment||[],
                    date: data.date,
                    type: data.kg.name,
                    list: data.kg.list,
                    step: [],
                    ae: data.kg.ae,
                    id: data.kg.id,
                    _id: data._id
                })
                if (this.select_index < this.threat_items.length - 1) {
                    this.select_index++;
                }
                if (this.threat_items.length > this.select_threat) {
                    this.threat_items.pop()
                } 
                if (this.threat_items.length==1){
                    this.createGroup()
                }
            }
            this.ws.onerror = e => { };
            this.ws.onclose = () => {
                //通道关闭了
                if (this.ws.readyState == 3) {
                    setTimeout(()=>{ 
                        this.socket();
                    },5000)
                }
            };
            
        },
        load() {
            //页面加载时
            this.getThreatList(() => {
                this.threat_scroll = initScroll("#scorll");
                this.infos_scroll = initScroll("#infos", "x");
                this.content_scroll = initScroll("#list-content", "x"); 
                this.createGroup()
              /*  this.socket(()=>{
                })  */
            })
        },
        createGroup() {
            //开始运行  
            if (this.select_index >= this.threat_items.length) {
                this.select_index = 0;
            }
            if (this.threat_items.length == 0) return;  
            this.title_class = ""
            let item = this.show_items = this.threat_items[this.select_index];
            setTimeout(() => {
                this.title_class = "animated fadeInUp opacity1"
            }, 50)
            //设置默认参数
        
            this.is_expand = false
            item.step = [];
            this._city.state.deleteStep()
            let index = 0;
            //清除定时器 
            if (this.interval) {
                clearInterval(this.interval)
            }
            if(this.ws){ 
                if (query.graph == "1506" && item._id) { 
                    this.ws.send(JSON.stringify({
                        mongoId:  item._id.toString() 
                    }))
                }
            }
            let dom = document.querySelector("#infos");
            const startStep = () => {
                //如果满足 取消定时器
                if (index >= item.list.length) {
                    clearInterval(this.interval)
                    setTimeout(() => {
                        if (!this.is_play){
                            this.select_index++; 
                            this.createGroup()
                        }
                    }, 3000)
                    return
                }
                item.step.push(item.list[index])
                //给THREE 传递需要展示信息
                this._city.attack_step(item.list, index)
                setTimeout(() => {
                    //滑动
                    this.infos_scroll.update()
                    // dom.scrollLeft = index * 250 
                    let source = {
                        left: dom.scrollLeft
                    }
                    let target = {
                        left: dom.scrollLeft + 250
                    }
                    _animated(source, target, 1000, () => {
                        dom.scrollLeft = source.left
                    })
                    index++
                })
            }
            setTimeout(() => {
                startStep()
                this.interval = setInterval(startStep, 1500);
            })

        },
        playEvenet(state) {
            //播放暂停 
            if (!state) {
                //播放
                this.createGroup()
                this._city.state.autoControls()
            } else {
                //暂停
                clearInterval(this.interval)
                this._city.auto_state = false;
                clearInterval(this._city.state.is_auto)
            }
            this.is_play = state
        },
        getThreatList(func) {
            // axios(`/${query.city}/api/microSituation/getUnitThreatList`, {
            axios(`/hy/get_threat/?unit_id=all&amount=10`, {
                /*  params: {
                    unitId: this.unitId,
                    amount: this.select_threat
                }   */
            }).then(res => {
                let index = 0;
                this.threat_items = []
                while (index < res.length) {
                    let item = res[index]
                    this.threat_items.push({
                        attachment: item.attachment,
                        date: item.date,
                        type: item.kg.name,
                        list: item.kg.list,
                        step: [],
                        _id: item._id
                    })
                    index++;
                }
                console.log(this.threat_items)
               /*  if (res.ret_code !== 0) {
                    return false
                }
                if (res.threats.length === 0) {
                    console.warn("数据为空")
                }
                this.test_data = res.threats[10]

                this.threat_items = [];
                let index = 0;
                while (index < res.threats.length) {
                    let item = res.threats[index]
                    this.threat_items.push({
                        attachment: item.attachment,
                        date: item.date,
                        type: item.kg.name,
                        list: item.kg.list,
                        step: [],  
                        _id:item._id
                    })
                    index++;
                }
 */
                typeof func == "function" ? func() : '';
            })
        },
        downFile() {
            //下载文件 
            this.show_items.attachment.forEach((elem) => {
                let url = elem.split("/")
                url = url[url.length - 1]
                funDownload(url)
            })
        },
        selectEvent(num) {
            this.select_threat = num;
            this.is_select_threat = !this.is_select_threat;
            this.getThreatList(() => {
                let _dom = document.querySelector("#scorll")
                _dom.scrollTop = 0;
                this.threat_scroll.update()
                //恢复默认
                this.select_index = 0;

                this.createGroup()

            })
        },
        selectStart() {
            this.is_select_threat = true
        },
        updateState(state) {
            //更新显示状态 
            switch (state) {
                case 0:
                    this.list_class_quit = "animated fadeOutDown"
                    setTimeout(() => {
                        this.show_state = state;
                    }, 800)
                    this.playEvenet(false);
                    break;
                case 1:
                    //暂停
                    this.list_class_quit = "animated fadeInUp"
                    this.show_state = state;
                    this.playEvenet(true);
                    break;
            }

        }
    }
})
function _animated(source, target, time, func, endFunc) {
    /**
     * @source 起始数据
     * @target 结束数据
     * @time 持续时间
     * @fun 持续中的事件
     * @endFunc 完成触发的事件
     */
    createjs.Tween.get(source).to(target, time, createjs.Ease.quadInOut)
        .call(handleChange)
    var Time = setInterval(() => {
        typeof func == 'function' ? func() : null;
    })

    function handleChange(event) {
        //完成 
        clearInterval(Time);
        typeof endFunc == 'function' ? endFunc() : null;
    }
}
function funDownload(content, filename) {
    let url = query.city + "/api/threadManagement/download?fileName=" + content;
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = url;
    eleLink.style.display = 'none';
    // // 字符内容转变成blob地址
    eleLink.href = url;
    eleLink.target = "_blank";
    // // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // // 然后移除
    document.body.removeChild(eleLink)
};
function initScroll(id, state) {
    let params = {
        wheelSpeed: 1,
        wheelPropagation: true,
        minScrollbarLength: 20,
        useBothWheelAxes: true
    }
    if (state == 'x') {
        params.suppressScrollY = true
        params.swipeEasing = true
    }
    const ps = new PerfectScrollbar(id, params);
    return ps
}
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串  
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}