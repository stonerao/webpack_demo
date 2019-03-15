import geo from '../../json/test.json'
import china from './china'
import * as d3 from 'd3'
import Base from '../../utils/base'
import IMG from '../../assets/map/earth.jpg'
/* china.features.forEach((z,i)=>{
    z.properties = {
        name: z.properties.name,
        childNum: i
    }
    let arr = []
    z.geometry.coordinates.forEach(z1=>{
        z1.forEach(z2=>{
            arr.push(z2)
        })
    })
    z.geometry.coordinates = arr
}) */
/**
 * @date 2019-03-28
 * 鹏程金融系统演示
 */
let state = {};
class City extends Base {
    constructor(params) {
        super()
        this.state = params;
        const { width, height } = params;
        if (width === undefined || height === undefined) {
            return console.error("width or height is undefined")
        }
        this.setState({
            scene: null,
            renderer: null,
            camera: null,
            controls: null,
            stats: params.stats,
            raycaster: new THREE.Raycaster(),
            ...this.methods(),
            resolutio: new THREE.Vector2(window.innerWidth, window.innerHeight)

        })
        this.created()
    }
    created() {
        state.initMap()
        state.initial()
        state.initControls()
    }
    methods() {
        let _this = this;
        state = _this.state;
        var materialLinne = new MeshLineMaterial({
            color: new THREE.Color("#91FFAA"),
            opacity: 1,
            resolution: state.resolution,
            sizeAttenuation: 1,
            lineWidth: 1,
            near: 9,
            far: 100000,
        });
        var mapTexture;
        var mapSize = {
            width: 9192,
            height: 4096
        };
        return {
            initial() {
                state.dom = document.getElementById(state.id)
                state.renderer = new THREE.WebGLRenderer({
                    canvas: state.dom
                });
                state.renderer.setClearColor(0x000f1c, 1.0);
                state.renderer.setPixelRatio(window.devicePixelRatio);
                state.renderer.setSize(state.width, state.height);
                state.scene = new THREE.Scene()
                state.camera = new THREE.PerspectiveCamera(45, state.width / state.height, 1, 10000);
                state.camera.position.set(0, 300, 150)
                state.scene.add(state.camera)
                state.load()

            },
            initControls() {
                /* 创建鼠标事件 */
                let controls = state.controls
                controls = new THREE.OrbitControls(state.camera, state.renderer.domElement);
                controls.enableDamping = true;
                //动态阻尼系数 就是鼠标拖拽旋转灵敏度
                controls.dampingFactor = 1;
                //是否可以缩放
                controls.enableZoom = true;
                //是否自动旋转 controls.autoRotate = true; 设置相机距离原点的最远距离
                controls.minDistance = 30;
                //设置相机距离原点的最远距离
                controls.maxDistance = 2000;
                //是否开启右键拖拽
                controls.enablePan = true;
            },
            AnimationFrame() {
                if (state.stats) {
                    state._stats.update()
                }
                state.renderer.render(state.scene, state.camera);
                requestAnimationFrame(state.AnimationFrame);
            },
            initState() {
                /* 监控状态 */
                state._stats = new Stats();
                state._stats.setMode(0);
                var stateNode = document.createElement('div');
                stateNode.innerHTML = '';
                stateNode.appendChild(state._stats.domElement)
                document.querySelector("body").appendChild(state._stats.domElement)
            },
            dispose(mesh) {
                /* 删除模型 */
                mesh.traverse(function (item) {
                    if (item instanceof THREE.Mesh) {
                        item.geometry.dispose(); //删除几何体
                        item.material.dispose(); //删除材质
                    }
                });
                state.scene.remove(mesh)
            },
            mouseup(event) {
                let mouse = new THREE.Vector2();
                let x, y;
                if (event.changedTouches) {
                    x = event.changedTouches[0].pageX;
                    y = event.changedTouches[0].pageY;

                } else {
                    x = event.clientX;
                    y = event.clientY;
                }
                mouse.x = (x / window.innerWidth) * 2 - 1;
                mouse.y = -(y / window.innerHeight) * 2 + 1;
                state.raycaster.setFromCamera(mouse, state.camera);
                let intersects = state.raycaster.intersectObjects([state.scene], true);
                if (intersects.length > 0) {
                    // 根据射线相交点的uv反算出在canvas上的坐标
                    var x1 = intersects[0].uv.x * mapSize.width;
                    var y1 = mapSize.height - intersects[0].uv.y * mapSize.height;

                    // 在mapCanvas上模拟鼠标事件，这里或许有更好的方法
                    var virtualEvent = document.createEvent('MouseEvents');
                    virtualEvent.initMouseEvent('mousemove', false, true, document.defaultView, 1, x1, y1, x1, y1, false, false, false, false, 0, null);
                    state.mapCanvas.dispatchEvent(virtualEvent);

                    let obj = intersects[0].object;
                    if (obj.type !== "Mesh") return;
                    switch (event.button) {
                        case 2:
                            //左键
                            break;
                        case 0:
                            //右键
                            break;
                    }
                }
            },
            helper() {
                /* let gridHelper = new THREE.GridHelper(1000, 100);
                state.scene.add(gridHelper); */
                let ambient = new THREE.AmbientLight(0xffffff); // soft white light
                state.scene.add(ambient);
            },
            load() {

                state.initState()
                state.AnimationFrame()

                window.addEventListener("mouseup", state.mouseup)
                state.helper()

                state.renderEarth()
            },
            renderEarth(_json) {
                var globeTextureLoader = new THREE.TextureLoader();
                var texture = new THREE.TextureLoader().load("../../assets/map/earth4.jpg");
                var earth_bump = new THREE.TextureLoader().load("../../assets/map/earth_bump.jpg");
                var earth_specular = new THREE.TextureLoader().load("../../assets/map/earth_spec.jpg");
                var earthGeometry = new THREE.SphereGeometry(200, 36, 36);
                var earthMaterial = new THREE.MeshPhongMaterial({
                    map: mapTexture,
                    // map: texture,
                    shininess: 40,
                    bumpScale: 1,
                    bumpMap: earth_bump,
                    specularMap: earth_specular
                    // color: 0xffffff,
                    // alpha: true
                });
                var earth = new THREE.Mesh(earthGeometry, earthMaterial);
                state.scene.add(earth)
                state.earthInital()
               
                /*   var globeTextureLoader = new THREE.TextureLoader();
                  globeTextureLoader.load('../../assets/map/earth.jpg', function (texture) {
                      var globeGgeometry = new THREE.SphereGeometry(190, 36, 36);
                      var globeMaterial = new THREE.MeshStandardMaterial({ map: texture });
                      var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
                      state.scene.add(globeMesh);
                     
                  }); */
            },
            earthInital() {
                /*   var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
                  hemisphereLight.position.x = 0;
                  hemisphereLight.position.y = 0;
                  hemisphereLight.position.z = -200;
                  state.scene.add(hemisphereLight); */

                //添加点点
                var starsGeometry = new THREE.Geometry();
                for (var i = 0; i < 2000; i++) {
                    var starVector = new THREE.Vector3(
                        THREE.Math.randFloatSpread(2000),
                        THREE.Math.randFloatSpread(2000),
                        THREE.Math.randFloatSpread(2000)
                    );
                    starsGeometry.vertices.push(starVector);
                }
                var starsMaterial = new THREE.PointsMaterial({ color: 0x888888 })
                var starsPoint = new THREE.Points(starsGeometry, starsMaterial);
                state.scene.add(starsPoint);

                const renderHouse = (x, y, z) => {
                    let position = state.getPosition(x, y, z)
                    var geometry = new THREE.BoxGeometry(2, 2, 2);
                    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                    var cube = new THREE.Mesh(geometry, material);
                    state.scene.add(cube);
                    cube.position.set(position.x, position.y, position.z)
                }
                renderHouse(125.908772, 40.227883, 4)
                renderHouse(109.59037, 19.020694, 4)
                setTimeout(() => {
                    state.addline(
                        [109.59037, 19.020694, 4], [125.908772, 40.227883, 4]
                    )
                }, 2000)
                state.drawChinaMap()

            },
            getPosition(lng, lat, alt) {
                // 获取position 
                var phi = (103 - lat) * (Math.PI / 180),
                    theta = (lng + 180) * (Math.PI / 180),
                    radius = alt + 200,
                    x = -(radius * Math.sin(phi) * Math.cos(theta)),
                    z = (radius * Math.sin(phi) * Math.sin(theta)),
                    y = (radius * Math.cos(phi));
                return { x: x, y: y, z: z };
            },
            addline(start, end) {
                //起点 
                let _start = state.getPosition(...start)
                //中点
                let _centerX = end[0] + (start[0] - end[0]) / 2
                let _centerY = end[1] + (start[1] - end[1]) / 2
                let _center = state.getPosition(_centerX, _centerY, 10)
                //终点
                let _end = state.getPosition(...end)
                var curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(_start.x, _start.y, _start.z),
                    new THREE.Vector3(_center.x, _center.y, _center.z),
                    new THREE.Vector3(_end.x, _end.y, _end.z)
                ]);
                let NUM = 200;
                let index = 0;
                var geometry = new THREE.Geometry();
                let vector = curve.getPoints(NUM);
                let createVector = new THREE.Vector3(...start)
                while (index < NUM) {
                    geometry.vertices.push(createVector);
                    index++;
                }
                var trail_line = new MeshLine()
                trail_line.setGeometry(geometry);
                var trail_mesh = new THREE.Mesh(trail_line.geometry, materialLinne);
                trail_mesh.frustumCulled = false;
                trail_mesh.paramsType = "line"
                state.scene.add(trail_mesh);
                let _n = 0;
                function die() {
                    if (_n > NUM) {
                        return
                    }
                    trail_line.advance(vector[_n])
                    setTimeout(() => {
                        die()
                        _n++;
                    }, 10)
                }
                die()
            },
            drawChinaMap() {

            },
            initMap() {
                let img = document.getElementById("img")
                state.mapCanvas = document.createElement('canvas');
                state.mapCanvas.width = mapSize.width;
                state.mapCanvas.height = mapSize.height;

                mapTexture = new THREE.Texture(state.mapCanvas);

                var chart = echarts.init(state.mapCanvas);

                let option = {
                    backgroundColor:{
                        image: img,
                        repeat: 'repeat' 
                    },
                    visualMap: {
                        show: false,
                        min: 0,
                        max: 1000000,
                        text: ['High', 'Low'],
                        realtime: false,
                        calculable: true,
                       
                    },
                    series: [
                        {
                            type: 'map',
                            mapType: 'world',
                            roam: true,
                            aspectScale: 1,
                            layoutCenter: ['50%', '50%'],
                            layoutSize: 9192,
                            itemStyle: {
                                emphasis: { label: { show: true } }
                            },
                            data: population    // from population.js
                        },

                    ]
                };

                chart.setOption(option);
                mapTexture.needsUpdate = true;

                // 选中或移出时才更新贴图
                // 内存向显存上传数据很慢，应该尽量减少贴图更新
                chart.on('mouseover', function () {
                    mapTexture.needsUpdate = true;
                });

                chart.on('mouseout', function () {
                    mapTexture.needsUpdate = true;
                });
                console.log(chart)
            }
        }
    }



}
export default City;