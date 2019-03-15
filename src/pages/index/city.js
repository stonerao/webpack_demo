import geo from '../../json/test.json'
import * as d3 from 'd3'
import Base from '../../utils/base'
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
                let gridHelper = new THREE.GridHelper(1000, 100);
                state.scene.add(gridHelper);
                let ambient = new THREE.AmbientLight(0xffffff); // soft white light
                state.scene.add(ambient);
            },
            load() {
                state.initState()
                state.AnimationFrame()
                state.dom.addEventListener("mouseup", state.mouseup)
                state.helper()
                state.renderCity(geo)
            },
            renderCity(_json) {
                let _data = _this.cloneJSON(_json)
                let { features } = _data;
                let i = 0;

                /*   while (i < features.length) {
                      let elem = features[i]
                      this.createBuilding(elem.geometry.coordinates) 
                      i+=100;
                  } */
                var x = 0, y = 0;

                var heartShape = new THREE.Shape();

                heartShape.moveTo(0, 0);
                heartShape.bezierCurveTo(10, 10, 10, 10, 0);
                heartShape.bezierCurveTo(15, 15, 15);
                heartShape.bezierCurveTo(20, 20, 20);
                heartShape.bezierCurveTo(30, 30, 30);

                var geometry = new THREE.ShapeGeometry(heartShape);
                var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                var mesh = new THREE.Mesh(geometry, material);
                state.scene.add(mesh);

            },
            createBuilding(vert) {
                let arr = []
                let _arr = []
                vert.forEach(x => {
                    _arr.push(...x)
                })
                // for (let i = 0; i < _arr.length; i++) {
                // geometry.vertices.push(new THREE.Vector3(-1, 2, -1));
                for (let x = 0; x < _arr.length - 1; x++) {
                    if (x + 1 < _arr.length) {
                        let p = state.projection(_arr[x])
                        let p1 = state.projection(_arr[x + 1])
                        //一面
                        arr.push(p[0] - 600, 0, p[1] - 600)
                        arr.push(p[0] - 600, 100, p[1] - 600)
                        arr.push(p1[0] - 600, 0, p1[1] - 600)

                        arr.push(p[0] - 600, 100, p[1] - 600)
                        arr.push(p1[0] - 600, 100, p1[1] - 600)
                        arr.push(p1[0] - 600, 0, p1[1] - 600)
                        //顶部

                    }
                }

                // } 
                var geometry = new THREE.BufferGeometry();
                // 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
                // 因为在两个三角面片里，这两个顶点都需要被用到。
                var vertices = new Float32Array(arr);

                // itemSize = 3 因为每个顶点都是一个三元组。
                geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                var material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
                var mesh = new THREE.Mesh(geometry, material)
                state.scene.add(mesh);
                var x = 0, y = 0;




            }
        }
    }



}
export default City;