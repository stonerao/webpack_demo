import Base from '../../utils/base'
import cityPotion from '../../assets/model/city.json'
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
            resolutio: new THREE.Vector2(window.innerWidth, window.innerHeight),
            // is_auto: null,//是否自动旋转  
            auto_state: false,
            building_step: [],
            all_building: [],//存储所有建筑
            all_building_id: [],//存储所有建筑的ID
        })
        this.created()
        this._cit_json = this.cloneJSON(cityPotion)
    }
    created() {
        state.initial()
        state.initControls()
    }
    methods() {
        let _this = this;
        let cameraPosition;
        state = _this.state;

        let linkMesh = {
            color: new THREE.Color("#91FFAA"),
            opacity: 1,
            resolution: state.resolution,
            sizeAttenuation: 1,
            lineWidth: 10,
            near: 10,
            far: 100000,
        }

        var linne_mesh_1 = new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#91FFAA"),
        });
        var linne_mesh_2 = new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#fea053"),
        });
        var linne_mesh_3 = new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#ff3d6c"),
        });
        var linne_mesh_4 = new MeshLineMaterial({
            ...linkMesh,
            color: new THREE.Color("#e17cff"),
        });

        var obj_material = new THREE.MeshPhongMaterial({ color: 0x13203C });
        var obj_material1 = new THREE.MeshPhongMaterial({ color: 0x4979D2 });
        var obj_material2 = new THREE.MeshPhongMaterial({ color: 0xff8800 });
        //加载默认图
        var startImgs = {
            "2-1-1": "./assets/images/2-1-1.png",
            "2-1-2": "./assets/images/2-1-2.png",
            "2-1-3": "./assets/images/2-1-3.png",
            "2-2-1": "./assets/images/2-2-1.png",
            "2-2-2": "./assets/images/2-2-2.png",
            "2-2-3": "./assets/images/2-2-3.png",
            "2-2-4": "./assets/images/2-2-4.png",
            "2-2-5": "./assets/images/2-2-5.png",
            "2-3-1": "./assets/images/2-3-1.png",
            "2-3-2": "./assets/images/2-3-2.png",
            "2-3-3": "./assets/images/2-3-3.png",
            "2-3-5": "./assets/images/2-3-4.png",
            "2-3-4": "./assets/images/2-3-5.png",
            "2-4-1": "./assets/images/2-4-1.png",
            "2-4-2": "./assets/images/2-4-2.png",
            "2-4-3": "./assets/images/2-4-3.png",
        }
        var loadImg = {
            step1: './assets/images/step1.png',
            step2: './assets/images/step2.png',
            step3: './assets/images/step3.png',
            step4: './assets/images/step4.png',
        }
        var FOOT_IMG = './assets/images/FOOT.png';
        for (var key in startImgs) {
            var img = new Image()
            img.src = startImgs[key]
            startImgs[key] = img
        }
        for (var key in loadImg) {
            var img = new Image()
            img.src = loadImg[key]
            loadImg[key] = img
        }
        var background_arrack = new Image()
        background_arrack.src = './assets/images/zpbj.png'
        var brand_img = background_arrack;

        var background_Foot = new Image()
        background_Foot.src = FOOT_IMG

        var SELECT_IMG_NEW = new Image()
        SELECT_IMG_NEW.src = "./assets/images/select_city1.png"
        let SELECT_IMG = SELECT_IMG_NEW
        state.SATELILITE_POSITION = [0, 1500, 0]//卫星位置


        return {

            initial() {
                state.dom = document.getElementById(state.id)
                // var context = state.dom.getContext('webgl2');
                state.renderer = new THREE.WebGLRenderer({
                    canvas: state.dom,
                    // context: context
                });
                state.renderer.setClearColor(0x04060E, 1.0);
                state.renderer.setSize(state.width, state.height);
                // state.renderer.shadowMapEnabled = true;//开启阴影，加上阴影渲染
                state.scene = new THREE.Scene()
                state.camera = new THREE.PerspectiveCamera(45, state.width / state.height, 1, 10000);
                state.camera.position.set(-3299.026742635894, 2459.720568192673, -588.0600602791458)
                state.camera.lookAt({
                    x: -1.8054674119992264,
                    y: -0.91675455554012,
                    z: -1.863393207087795
                })
                state.scene.add(state.camera)
                state.load()


            },
            initControls() {
                /* 创建鼠标事件 */
                state.controls = new THREE.OrbitControls(state.camera, state.renderer.domElement);
                state.controls.enableDamping = true;
                //动态阻尼系数 就是鼠标拖拽旋转灵敏度
                state.controls.dampingFactor = 1;
                //是否可以缩放
                state.controls.enableZoom = true;
                //是否自动旋转 state.controls.autoRotate = true; 设置相机距离原点的最远距离
                state.controls.minDistance = 30;
                //设置相机距离原点的最远距离
                state.controls.maxDistance = 5000;
                //是否开启右键拖拽
                state.controls.enablePan = true;
                state.controls.enableRotate = true;
                state.controls.autoRotate = true;
                state.controls.autoRotateSpeed = 1;
                this.autoControls()
                setTimeout(() => {
                    state.controls.saveState()
                }, 1000)

            },
            autoControls() {
                /*  if (state.is_auto) {
                     clearInterval(state.is_auto)
                 } */
                state.auto_state = true
                /* state.is_auto = setInterval(() => {
                   
                }) */
            },
            quitAutoControls(){ 
                state.auto_state = false

            },
            AnimationFrame() {
                if (state.stats) {
                    state._stats.update()
                }
                if (state.auto_state) {
                    state.controls.update()
                }
                state.renderer.render(state.scene, state.camera);
                requestAnimationFrame(state.AnimationFrame);
            },
            initState() {
                if (!state.stats) {
                    return
                }
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
            cameraAnimated(start) {
                // clearInterval(state.is_auto)
                cameraPosition = _this.cloneJSON(start)
                let end = state.camera.position
                start.y += 400
                start.z += 200
                let p1 = state.transformPostion(cameraPosition)
                /* let p1 = state.transformPostion(cameraPosition)
                state._animated(end, start, 1000, () => { 
                    state.camera.position.set(end.x, end.y, end.z)
                    state.camera.lookAt(...p1);  
                      
                }, () => {


                }) */
                createjs.Tween.get(end).to(start, 2000, createjs.Ease.quadInOut)
                    .call(handleChange)
                var cameraTime = setInterval(() => {
                    state.camera.position.set(end.x, end.y, end.z)
                    state.camera.lookAt(...p1);

                })
                function handleChange(event) {
                    //完成
                    clearInterval(cameraTime)

                }
            },
            buildingAnimation(position, radius) {
                position[1] = 1
                //选择建筑的动效
                //建筑升起的特效
                var routerName = new THREE.Texture(SELECT_IMG); 
                routerName.needsUpdate = true;
                // var geometry = new THREE.CircleBufferGeometry(radius + 50, 32);
                var geometry = new THREE.PlaneGeometry(radius * 2, radius * 2,1);
                
                let height = position[1].toString() * 2 +400
                let number = 7;
                position[0] = position[0] + 900;
                let plane_arr = [];
                let initPlane = () =>{
                    var material = new THREE.MeshBasicMaterial({
                        // color: 0xffff00,
                        side: THREE.DoubleSide,
                        map: routerName
                    });
                    var circle = new THREE.Mesh(geometry, material);
                    circle.position.set(...position)
                    circle.rotation.x = Math.PI / 2 
                    circle.material.transparent = true; 
                    state.scene.add(circle); 
                    return circle
                }
                let basePlane = initPlane()
                basePlane.scale.x = 1.1
                basePlane.scale.y = 1.1
                basePlane.scale.z = 1.1
                function initNode(arr) {
                    if (number == 0) {
                        animation(basePlane)
                        return
                    }     
                    let plane = initPlane()
                    animation(plane)
                    setTimeout(() => { 
                        number--;
                        initNode()
                    }, 600)
                }
                initNode(plane_arr)
                function animation(node) {
                    let num = 0; 
                    let scale_num = 0;
                    let scale_time = setInterval(()=>{
                        let _n = 1-scale_num*0.02
                        if(scale_num>5){
                            clearInterval(scale_time) 
                            _TIME()
                        }
                        node.scale.x = _n
                        node.scale.y = _n
                        node.scale.z = _n
                        scale_num++
                    },20)
                    const _TIME = () =>{
                        let time = setInterval(() => {
                            let _NUM = 1 - num / height
                            let _SCALE = _NUM * 0.1 + 0.9
                            // node.rotation.z += 0.05;
                            node.position.y = num;
                            /* node.scale.x = _SCALE
                            node.scale.y = _SCALE
                            node.scale.z = _SCALE */
                            node.material.opacity = _NUM;
                            num += 5
                            if (num >= height) {
                                clearInterval(time)
                                setTimeout(() => {
                                    state.dispose(node)
                                }, 100)
                            }
                        }, 20) 
                    }
                    
                }
            },
            mouseup(event) {
                var material = new THREE.MeshPhongMaterial({ color: 0x5599aa });
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
                    let elems = intersects.filter(x => x.object.type != "Sprite")
                    let elem = elems[0]
                    let obj = elem.object;
                    // if (obj.type !== "Mesh") return;

                    switch (event.button) {
                        case 0:
                            //左键 
                            if (obj.params_type == 'city') {
                                let p = _this.cloneJSON(elem.point)
                                document.getElementById("app").style.display = 'none'
                                state.Vue.playEvenet(true)
                               
                                /*  state.cameraAnimated({
                                     x: p.x,
                                     y: p.y,
                                     z: p.z
                                 }) */

                            } else {
                                if (!state.auto_state) {
                                    state.autoControls()
                                    state.Vue.playEvenet(false)
                                    // state.controls.reset()
                                }
                                document.getElementById("app").style.display = 'block'
                                // 
                            }
                            break;
                        case 2:
                            //右键
                            break;
                    }
                }
            },
            transformPostion(position) {
                if (position instanceof Array) {
                    return {
                        x: position[0],
                        y: position[1],
                        z: position[2]
                    }
                } else if (typeof position === 'object') {
                    return [position.x, position.y, position.z]
                }
            },
            addFoot() {
                let canvas = document.createElement('canvas');
                let RECT_SIZE = 1024 * 6; //大小 
                canvas.width = RECT_SIZE;
                canvas.height = RECT_SIZE;
                let context = canvas.getContext("2d");

                context.fillStyle = context.createPattern(background_Foot, 'repeat');
                context.fillRect(0, 0, RECT_SIZE, RECT_SIZE);
                let routerName = new THREE.Texture(canvas);
                routerName.needsUpdate = true;
                //地板
                var geometry = new THREE.PlaneGeometry(7500, 7500);
                var material = new THREE.MeshLambertMaterial({
                    map: routerName,
                    color: 0xaaaaaa,
                    side: THREE.DoubleSide
                });
                var plane = new THREE.Mesh(geometry, material);
                state.scene.add(plane);
                plane.rotation.x = Math.PI / 2
                plane.position.y = -1
                // plane.receiveShadow = true;
            },
            helper() {
                /*  let gridHelper = new THREE.GridHelper(10000, 200);
                   state.scene.add(gridHelper);  */

                var light = new THREE.AmbientLight(0xffffff); // soft white light
                state.scene.add(light);
                var directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
                state.scene.add(directionalLight);

                setTimeout(() => {
                    this.addFoot()
                }, 300)

                var spotLight = new THREE.SpotLight({
                    color: 0xffffff,

                });
                spotLight.position.set(2500, 3500, -900);
                spotLight.shadow.camera.near = 500;
                spotLight.shadow.camera.far = 4000;
                spotLight.shadow.camera.fov = 30;
                // spotLight.castShadow = true;    // 让光源产生阴影
                state.scene.add(spotLight);

            },
            onWindowResize() {
                state.camera.aspect = window.innerWidth / window.innerHeight;
                state.camera.updateProjectionMatrix();
                state.renderer.setSize(window.innerWidth, window.innerHeight);

            },
            load() {
                state.initState()
                state.AnimationFrame()
                state.dom.addEventListener("mouseup", state.mouseup)
                state.helper()
                //添加城市
                state.createCity()
                //添加卫星
                this.addSatellite()
                let json = _this.cloneJSON(cityPotion)
                for (let i = 0; i < json.length; i++) {
                    if (json[i].position) {
                        state.addText(json[i].unit_name, json[i].position)
                    }
                }
                window.addEventListener("resize", state.onWindowResize)
                
            },
            textAsCanvas(canvasText) {
                var canvas = document.createElement('canvas');
                canvas.width = canvasText.length * 256;
                canvas.height = 256;
                var context = canvas.getContext('2d');

                context.font = 'bold 180px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillStyle = '#ffffff';
                context.lineWidth = 20;
                context.fillText(canvasText, canvas.width / 2, canvas.height / 2);
                // context.strokeText(canvasText, canvas.width/2, canvas.height/2); 
                return canvas;
            },
            addText(text, position, ys) {
                //添加 house name
                var routerName = new THREE.Texture(state.textAsCanvas(text));
                routerName.needsUpdate = true;
                var sprMat = new THREE.SpriteMaterial({ map: routerName, color: 0xffffff });
                var spriteText = new THREE.Sprite(sprMat);
                var sprScale = 75;
                spriteText.scale.set(sprScale * text.length, sprScale, 1);
                spriteText.position.set(position.x, position.y + 50, position.z);
                spriteText.params_type = "title"
                state.scene.add(spriteText);

            },
            addSatellite() {
                var material = new THREE.MeshPhongMaterial({ color: 0x999999 });
                var mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('/assets/model/satellite.mtl', function (materials) {
                    materials.preload();
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load('/assets/model/satellite.obj', function (mesh) {
                        mesh.traverse(function (node) {
                            if (node instanceof THREE.Mesh) {
                                node.castShadow = true;
                                node.receiveShadow = true;
                                node.material = material
                            }
                        });
                        mesh.position.set(state.SATELILITE_POSITION[0], state.SATELILITE_POSITION[1], state.SATELILITE_POSITION[2])
                        state.scene.add(mesh)
                        setInterval(() => {
                            mesh.rotation.y += 0.01
                        }, 20)
                    });
                });

            },
            createCity() {

                var mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('/assets/model/city.mtl', function (materials) {
                    materials.preload();
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load('/assets/model/city.obj', function (mesh) {
                        mesh.traverse(function (node) {
                            if (node instanceof THREE.Mesh) {
                                // // node.castShadow = true;
                                node.receiveShadow = true;
                                if (node.name === "city") {
                                    node.material = obj_material

                                } else {
                                    node.material = obj_material1
                                    node.params_type = "city"
                                    state.all_building.push(node)
                                }
                                /*  
                                 if (node.name == 'q1') {
                                 } */
                            }
                        });
                        mesh.position.set(900, 20, 0)
                        mesh.params_type = "all_city"
                        state.scene.add(mesh)
                    });
                });
            },
            path() {

            },
            addLine(src, dst, reference, index, {
                src_node,
                dst_node
            }) {
                if (!src || !dst) {
                    return
                }
                let _src = {
                    x: src[0],
                    y: src[1],
                    z: src[2]
                }
                let _dst = {
                    x: dst[0],
                    y: dst[1],
                    z: dst[2]
                }
                let _center = [
                    (src[0] + dst[0]) / 2,
                    (src[1] + dst[1]) / 2,
                    (src[2] + dst[2]) / 2
                ]

                //线条颜色
                let colorIndex = reference.split("-")[1];
                // colorIndex = Math.random() < 0.2 ? '4' : colorIndex
                let mesh_line
                switch (colorIndex) {
                    case "1":
                        mesh_line = linne_mesh_1
                        break
                    case "2":
                        mesh_line = linne_mesh_2
                        break
                    case "3":
                        mesh_line = linne_mesh_3
                        break
                    default:
                        mesh_line = linne_mesh_4

                }
                //线条
                //在新的一次 
                if (index === 1) {
                    state.building_step = []
                }
                //在数组中添加档当次 的连线
                let building_the = [
                    src_node ? src_node.unit_id : 0,
                    src_node ? dst_node.unit_id : 0
                ]
                state.building_step.push(building_the)
                let _HEIGHT_NUM = state.building_step.filter(s => {
                    return s.join(",") == building_the.join(",")
                }).length


                let cinum = 200;
                let HEIGHT_LINE = _HEIGHT_NUM % 2 ? 40 : -40;//每次增加高度
                let _LINE = _HEIGHT_NUM == 1 ? 0 : HEIGHT_LINE * _HEIGHT_NUM
                var curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(_src.x, _src.y, _src.z),
                    new THREE.Vector3(_center[0] + _LINE, _center[1], _center[2]),
                    new THREE.Vector3(_dst.x, _dst.y, _dst.z),
                ]);
                let vector = curve.getPoints(cinum);
                var geometry = new THREE.Geometry();
                for (let i = 0; i < cinum; i++) {
                    geometry.vertices.push(new THREE.Vector3(...src));
                }
                var line = new MeshLine();
                line.setGeometry(geometry);
                var mesh = new THREE.Mesh(line.geometry, mesh_line);
                mesh.frustumCulled = false;
                mesh.params_type = "step"
                state.scene.add(mesh);
                let _IMG = this.addLineShowStep(reference, _src)
                let n = 0;
                let tim = setInterval(() => {
                    n++;
                    if (n >= cinum) {
                        //终点
                        if (dst_node) {
                            //到达终点高亮
                            state.shiny(dst_node)
                        }
                        state.addStep([_center[0] + _LINE, _center[1], _center[2]], index, reference)
                        state.dispose(_IMG)
                        clearInterval(tim)
                    } else {
                        line.advance(vector[n])
                        _IMG.position.set(vector[n].x, vector[n].y, vector[n].z)
                    }

                }, 1000 / cinum)
                //线条动画
                /* state._animated(_src, _dst, 1500, () => {
                    line.advance(new THREE.Vector3(_src.x, _src.y, _src.z))
                    _IMG.position.set(_src.x, _src.y, _src.z)
                }, () => {
                    state.addStep(_center, index, reference)
                    state.dispose(_IMG) 
                }) */
            },
            addStep(position, index, reference) {
                //连线展示开始图标
                let canvas = document.createElement('canvas');
                let RECT_SIZE = 256; //大小
                let RECT_PADDING = 0;
                let Step = parseInt(reference.split("-")[1])
                let _IMG = loadImg['step' + Step]
                canvas.width = RECT_SIZE;
                canvas.height = RECT_SIZE;
                let context = canvas.getContext("2d");
                context.drawImage(_IMG, 0, 0, RECT_SIZE - RECT_PADDING, RECT_SIZE - RECT_PADDING);
                context.font = 'bold 120px Arial';
                context.fillStyle = '#fff';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.lineWidth = 200;
                context.fillText(index, RECT_SIZE / 2, RECT_SIZE / 2);
                let routerName = new THREE.Texture(canvas);
                routerName.needsUpdate = true;
                let sprMat = new THREE.SpriteMaterial({ map: routerName });
                let spriteText = new THREE.Sprite(sprMat);
                let sprScale = 80;
                spriteText.scale.set(sprScale, sprScale, 1);
                spriteText.position.set(position[0], position[1] + 70, position[2]);
                spriteText.params_type = "step"
                state.scene.add(spriteText);
                return spriteText
            },
            addLineShowStep(img_code, position) {
                //连线展示开始图标
                let canvas = document.createElement('canvas');
                let RECT_SIZE = 256; //大小
                canvas.width = RECT_SIZE;
                canvas.height = RECT_SIZE;
                let context = canvas.getContext("2d");
                context.drawImage(startImgs[img_code], 0, 0, RECT_SIZE, RECT_SIZE);

                let routerName = new THREE.Texture(canvas);
                routerName.needsUpdate = true;
                let sprMat = new THREE.SpriteMaterial({ map: routerName });
                let spriteText = new THREE.Sprite(sprMat);
                let sprScale = 100;
                spriteText.scale.set(sprScale, sprScale, 1);
                spriteText.position.set(position[0], position[1], position[2]);
                spriteText.params_type = "step"
                state.scene.add(spriteText);
                return spriteText
            },
            initBrand(brand) {
                let canvas = document.createElement('canvas');
                let RECT_SIZE = 256; //大小
                let RECT_PADDING = 40; //大小
                let IMG_SIZE = RECT_SIZE - RECT_PADDING * 2
                canvas.width = brand.length * RECT_SIZE;
                canvas.height = RECT_SIZE;
                let context = canvas.getContext("2d");
                // context.fillStyle = "#FFFFFF";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(brand_img, 0, 0, brand.length * RECT_SIZE, RECT_SIZE);
                brand.forEach((b, i) => {
                    add(b, i)
                })
                function add(obj, i) {
                    context.drawImage(startImgs[obj.img], i * RECT_SIZE + RECT_PADDING, 0, IMG_SIZE, IMG_SIZE);
                    context.font = 'bold 70px Arial';
                    context.fillStyle = '#fff';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.lineWidth = 20;
                    context.fillText(obj.sort, i * 256 + 120, 215);
                }
                return canvas
            },
            deleteStep() {
                let nodes = state.scene.children;
                let index = 0;
                //还原
                while (index < nodes.length) {
                    if (nodes[index].params_type == "all_city") {
                        let children = nodes[index].children
                        for (let i = 0; i < children.length; i++) {
                            // children[i]. 
                            if (children[i].params_type == 'city') {
                                children[i].material = obj_material1
                            }
                        }
                    }
                    index++
                }
                //删除

                nodes.filter(x => x.params_type == 'step').forEach(x => {
                    state.dispose(x)
                })
            },
            getAttackBrand(unit_id) {
                //是否已有内部攻击展示
                let index = 0;
                let nodes = state.scene.children;
                while (index < nodes.length) {
                    if (nodes[index].unit_id == unit_id) {
                        return nodes[index]
                    }
                    index++
                }
                return false
            },
            initBrandGo(brand, position) {
                // this.deleteStep() 
                //查找是否已有当前建筑的内部攻击提示
                let node = state.getAttackBrand(brand[0].unit_id)
                if (node !== false) {
                    brand.unshift(...node.params)
                    state.dispose(node)
                }
                var routerName = new THREE.Texture(state.initBrand(brand));
                routerName.needsUpdate = true;
                var sprMat = new THREE.SpriteMaterial({ map: routerName });
                var spriteText = new THREE.Sprite(sprMat);
                var sprScale = 100;
                spriteText.scale.set(sprScale * brand.length, sprScale, 1);
                spriteText.position.set(position[0], 0, position[2]);
                spriteText.params_type = "step"
                spriteText.unit_id = brand[brand.length - 1].unit_id
                spriteText.params = brand;
                state.scene.add(spriteText);
                var target = {
                    y: 0
                }
                createjs.Tween.get(target).to({ y: position[1] + 120 }, 1000, createjs.Ease.elasticOut)
                    .call(handleChange)
                var time = setInterval(() => {
                    spriteText.position.y = target.y
                })

                function handleChange(event) {
                    //完成
                    clearInterval(time)
                }
            },
            _animated(source, target, time, func, endFunc) {
                /**
                 * @source 起始数据
                 * @target 结束数据
                 * @time 持续时间
                 * @fun 持续中的事件
                 * @endFunc 完成触发的事件
                 */
                createjs.Tween.get(source).to(target, time)
                    .call(handleChange)
                var Time = setInterval(() => {
                    typeof func == 'function' ? func() : null;
                })

                function handleChange(event) {
                    //完成 
                    clearInterval(Time);
                    typeof endFunc == 'function' ? endFunc() : null;
                }
            },
            nameGetNode(name) {
                //根据名字找到当前 建筑
                let nodes = state.scene.children;
                let index = 0;
                let buildings = state.all_building;
                while (index < buildings.length) {
                    let names = buildings[index].name.split("-")
                    if (names[0] == name) {
                        return buildings[index]
                    }
                    index++
                }
                return false
            },
            shiny(node) {
                //高亮建筑 
                var material = new THREE.MeshPhongMaterial({ color: 0xff42000 });
                let _node = state.nameGetNode(node.unit_name)
                if (_node) {
                    _node.material = obj_material2
                    let node = _node.geometry;
                    let sphere = node.boundingSphere
                    let position = state.transformPostion(sphere.center)
                    state.buildingAnimation(position, sphere.radius)
                }
                
            }

        }
    }
    cloneJSON(data) {
        return JSON.parse(JSON.stringify(data))
    }
    attack_step(parent, index) {
        let item = parent[index];
        //获取网段 
        let src_p, dst_p;
        let src_node, dst_node;

        if (item.src == "0.0.0.0") {
            src_p = this.state.SATELILITE_POSITION
        } else {
            //根据网段找到数据
            let src = this.ip_get_network(item.src)
            src_node = this.getNode(src)
            src_p = this.state.transformPostion(src_node.position)
        }
        if (item.dst == "0.0.0.0") {
            dst_p = this.state.SATELILITE_POSITION
        } else {
            let dst = this.ip_get_network(item.dst)
            dst_node = this.getNode(dst)
            dst_p = this.state.transformPostion(dst_node.position)
        }
        // src_p = Math.random() < 0.5 ? src_p : this.state.SATELILITE_POSITION 

        if (dst_p.toString() == src_p.toString()) {
            //添加属性
            item.attack_type = 1;//当前是统一建筑
            item.sort = index + 1;//当前步骤
            item.dst_p = dst_p;//当前步骤 
            item.unit_id = dst_node.unit_id;//当前步骤  
            this.state.initBrandGo([{
                sort: item.sort,
                img: item.reference,
                dst_p: item.dst_p,
                unit_id: item.unit_id
            }], dst_p)
        } else {
            this.state.addLine(
                src_p,
                dst_p,
                item.reference,
                index + 1,
                {
                    src_node: src_node,
                    dst_node: dst_node
                }
            )
        }
    }
    muster_attack(items) {
        //查找内部攻击的建筑
        let index = 0
        let arr = [];
        while (index < items.length) {
            //只要attack_type==1
            if (items[index].attack_type === 1) {
                arr.push(items[index])
            }
            index++;
        }
        return arr
    }
    ip_get_network(str) {
        return str.split("/")[0].split(".")[2]
    }
    claerHistory() {

    }
    getNode(net) {
        let index = 0;
        while (index < this._cit_json.length) {
            let unit = this._cit_json[index]
            if (unit.subnet.indexOf(net) !== -1) {
                return unit
            }
            index++;
        }

    }



}
export default City;