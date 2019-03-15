import geo from '../../json/test.json'
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
                state.camera.position.set(-2640.9713213300447, 1856.726436659051, 1609.9949255258614)
                state.camera.lookAt({
                    x: -0.7756341505340653,
                    y: -0.7549578895713187,
                    z: -0.5916894402561657
                })
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
                controls.maxDistance = 5000;
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
                    console.log(intersects)
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
                //    let gridHelper = new THREE.GridHelper(10000, 200);
                //     state.scene.add(gridHelper); 
                /*    let ambient = new THREE.AmbientLight({
                       color: 0xffffff,
                       intensity: 2
                   });
                   state.scene.add(ambient); */
                /* var light = new THREE.HemisphereLight({
                    skyColor: 0xffffff, groundColor: 0x999999, intensity: 0.1
                });
                state.scene.add(light); 
               light.position.y=500
               light.position.x=-200
               var helper = new THREE.HemisphereLightHelper(light, 5);

               state.scene.add(helper); */
                /*   var light = new THREE.PointLight(0xffffff, 1, 0);
                  light.position.set(50, 0, 150);
                  state.scene.add(light); */

                /*  var spotLight = new THREE.SpotLight({
                     color: 0xffffff,
                     intensity: 2,
                     decay: 1
                 });
                 spotLight.position.set(100, 100, 100);
 
                 spotLight.castShadow = true;
 
                 spotLight.shadow.mapSize.width = 1024;
                 spotLight.shadow.mapSize.height = 1024;
 
                 spotLight.shadow.camera.near = 500;
                 spotLight.shadow.camera.far = 4000;
                 spotLight.shadow.camera.fov = 30;
 
                 state.scene.add(spotLight);
 
                 var spotLightHelper = new THREE.SpotLightHelper(spotLight);
                 state.scene.add(spotLightHelper); */
                var light = new THREE.AmbientLight(0xffffff); // soft white light
                state.scene.add(light);
                var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                state.scene.add(directionalLight);

            },
            load() {
                state.initState()
                state.AnimationFrame()
                state.dom.addEventListener("mouseup", state.mouseup)
                state.helper()

                state.createCity()
            },
            createCity() {
                var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                var mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('./pages/city/model/city-gry.mtl', function (materials) {
                    materials.preload();
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load('./pages/city/model/city-gry.obj', function (mesh) { 
                        mesh.traverse(function (node) {
                            if (node instanceof THREE.Mesh) { 
                                node.castShadow = true;
                                node.receiveShadow = true;
                                if (node.name =='q1'){
                                    node.material = material
                                }
                            }
                        });
                        mesh.position.set(0, 20, 0)
                        state.scene.add(mesh)
                    });
                });
            },
            path() {

            },


        }
    }



}
export default City;