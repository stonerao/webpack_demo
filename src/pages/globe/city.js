import geo from '../../json/test.json'
import china from './china.json'
import * as d3 from 'd3'
import Base from '../../utils/base'
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
            projection: d3.geoMercator().fitSize([width, height], geo),
            ...this.methods(),
            resolutio: new THREE.Vector2(window.innerWidth, window.innerHeight)

        })
        this.created()
    }
    created() {
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
        return {
            initial() {
                state.dom = document.getElementById(state.id)
                state.renderer = new THREE.WebGLRenderer({
                    canvas: state.dom
                });
                state.renderer.setClearColor(0x000f1c, 1.0);
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
                mouse.x = (x / state.dom.innerWidth) * 2 - 1;
                mouse.y = -(y / state.dom.innerHeight) * 2 + 1;
                state.raycaster.setFromCamera(mouse, state.camera);
                let intersects = state.raycaster.intersectObjects([state.scene], true);
                if (intersects.length > 0) {
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
                state.dom.addEventListener("mouseup", state.mouseup)
                state.helper()

                state.renderEarth()
            },
            renderEarth(_json) {
                var globeTextureLoader = new THREE.TextureLoader();
                globeTextureLoader.load('../../assets/map/earth.jpg', function (texture) {
                    var globeGgeometry = new THREE.SphereGeometry(200, 100, 100);
                    var globeMaterial = new THREE.MeshStandardMaterial({ map: texture });
                    var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
                    state.scene.add(globeMesh);
                    state.earthInital()
                    /*   state.scene.rotation.x = THREE.Math.degToRad(35);
                      state.scene.rotation.y = THREE.Math.degToRad(170); */
                });
            },
            earthInital() {
                var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
                hemisphereLight.position.x = 0;
                hemisphereLight.position.y = 0;
                hemisphereLight.position.z = -200;
                state.scene.add(hemisphereLight);

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
                renderHouse(156.859062, 51.135398, 4)
                renderHouse(91.088726, 29.778343, 4)
                setTimeout(() => {
                    state.addline(
                        [91.088726, 29.778343, 4], [156.859062, 51.135398, 4]
                    )
                }, 2000)
                state.drawChinaMap()

            },
            getPosition(lng, lat, alt) {
                // 获取position 
                var phi = (90 - lat) * (Math.PI / 180),
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
                //绘制中国地图 
                let features = china.features; 
                for (let x = 0; x < features.length; x++) {
                    let coordinates = features[x].geometry.coordinates;
                    let arr = []
                    for(let y=0;y<coordinates.length;y++){
                        // console.log(coordinates[y])
                        for(let z=0;z<coordinates[y].length;z++){
                            let p = coordinates[y][z]
                            for(let e=0;e<p.length;e++){
                                //
                                arr.push(p[e])
                            }
                        }
                    }
                    console.log(arr)
                    let POSITION_NUM = arr.length;
                    
                }
                

            }
        }
    }



}
export default City;