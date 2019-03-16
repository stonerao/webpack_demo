import geo from '../../json/test.json'
import * as d3 from 'd3'
import Base from '../../utils/base'
import cityPotion from './model/city.json'

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
            resolutio: new THREE.Vector2(window.innerWidth, window.innerHeight),
            is_auto: true,//是否自动旋转

        })
        this.created()
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

        var startImgs = {
            "2-1-1": "/pages/city/images/2-1-1.png",
            "2-1-2": "/pages/city/images/2-1-2.png",
            "2-1-3": "/pages/city/images/2-1-3.png",
            "2-2-1": "/pages/city/images/2-2-1.png",
            "2-2-2": "/pages/city/images/2-2-2.png",
            "2-2-3": "/pages/city/images/2-2-3.png",
            "2-2-4": "/pages/city/images/2-2-4.png",
            "2-2-5": "/pages/city/images/2-2-5.png",
            "2-3-1": "/pages/city/images/2-3-1.png",
            "2-3-2": "/pages/city/images/2-3-2.png",
            "2-3-3": "/pages/city/images/2-3-3.png",
            "2-3-5": "/pages/city/images/2-3-4.png",
            "2-3-4": "/pages/city/images/2-3-5.png",
            "2-4-1": "/pages/city/images/2-4-1.png",
            "2-4-2": "/pages/city/images/2-4-2.png",
            "2-4-3": "/pages/city/images/2-4-3.png",
        }
        var loadImg = {
            step1: '/pages/city/images/step1.png',
            step2: '/pages/city/images/step2.png',
            step3: '/pages/city/images/step3.png',
            step4: '/pages/city/images/step4.png',
        }
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
                state.camera.position.set(-549.4169406773624, 2566.4153921051607, 2859.7444122667116)
                state.camera.lookAt({
                    x: -0.7930697902928766,
                    y: 0.05569297857116938,
                    z: 0.05646479705450649
                })
                state.scene.add(state.camera)
                state.load()

            },
            initControls() {
                /* 创建鼠标事件 */
                let controls;
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
                controls.enableRotate = true;
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.4;
                setInterval(() => {
                    controls.update()
                })

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
            cameraAnimated(start) {
                return
                cameraPosition = _this.cloneJSON(start)
                let end = state.camera.position
                start.y += 500
                start.z += 400
                start.x += 300

                let p1 = state.transformPostion(cameraPosition)
                state._animated(end, start, 2000, () => {
                    let p = state.transformPostion(end)
                    state.camera.position.set(...p)
                    state.camera.lookAt(cameraPosition.x, cameraPosition.y, cameraPosition.z);


                }, () => {


                })
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
                    let obj = intersects[0].object;

                    /*  
                     position.y+=250
                     position.x+=150
                     state.camera.position.set(...state.transformPostion(position))
                     state.camera.lookAt(...state.transformPostion(intersects[0].point)) */
                    // obj.material = material
                    /*  let p = _this.cloneJSON(intersects[0].point) 
                     state.cameraAnimated({
                         x: p.x,
                         y: p.y,
                         z: p.z
                     }) */
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
            helper() {
                //    let gridHelper = new THREE.GridHelper(10000, 200);
                //     state.scene.add(gridHelper); 

                var light = new THREE.AmbientLight(0xffffff); // soft white light
                state.scene.add(light);
                var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
                state.scene.add(directionalLight);

                /*  var spotLight = new THREE.SpotLight({
                     color:0xffffff,
                      
                 });
                 spotLight.position.set(2000, 3000, -900);
                 spotLight.shadow.camera.near = 500;
                 spotLight.shadow.camera.far = 4000;
                 spotLight.shadow.camera.fov = 30;
                 state.scene.add(spotLight);
 
                 var spotLightHelper = new THREE.SpotLightHelper(spotLight);
                 state.scene.add(spotLightHelper); */



            },
            load() {
                state.initState()
                state.AnimationFrame()
                state.dom.addEventListener("mouseup", state.mouseup)
                state.helper()
                state.createCity()
                let json = _this.cloneJSON(cityPotion)
                for (let i = 0; i < json.length; i++) {
                    if (json[i].position) {
                        state.addText(json[i].unit_name, json[i].position)
                    }
                }
                let index = 0;
                let len = json.length
                let _arr = []

                /*  setInterval(() => {
                     let num = parseInt(Math.random() * (len - 1))
                     let num1 = parseInt(Math.random() * (len - 1))
                     let arr = [state.transformPostion(json[num1].position), state.transformPostion(json[num].position)]
                     state.addLine(...arr)
                 }, 2000); */
                function addBox(position) {
                    var geometry = new THREE.BoxBufferGeometry(15, 15, 15);
                    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                    var cube = new THREE.Mesh(geometry, material);
                    state.scene.add(cube);
                    cube.position.set(...state.transformPostion(position))
                }

                let p = {
                    x: 567.5476546295483,
                    y: 310.7971529695683,
                    z: 292.14446481983396
                }
                setTimeout(() => {
                    state.cameraAnimated({
                        x: p.x,
                        y: p.y,
                        z: p.z
                    })
                }, 5000)
                /*  setInterval(() => {
                     state.addLine(linkJson[parseInt(Math.random() * linkJson.length - 1)], linkJson[parseInt(Math.random() * linkJson.length - 1)])
                 }, 2000) */
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
                var sprScale = 50;
                spriteText.scale.set(sprScale * text.length, sprScale, 1);
                spriteText.position.set(position.x, position.y + 50, position.z);
                spriteText.paramsType = "title"
                state.scene.add(spriteText);

            },
            createCity() {
                var material = new THREE.MeshPhongMaterial({ color: 0x316d79 });
                var material1 = new THREE.MeshPhongMaterial({ color: 0xcc7832 });
                var mtlLoader = new THREE.MTLLoader();
                mtlLoader.load('./pages/city/model/city.mtl', function (materials) {
                    materials.preload();
                    var objLoader = new THREE.OBJLoader();
                    objLoader.setMaterials(materials);
                    objLoader.load('./pages/city/model/city.obj', function (mesh) {

                        mesh.traverse(function (node) {
                            if (node instanceof THREE.Mesh) {
                                node.castShadow = true;
                                node.receiveShadow = true;

                                if (node.name === "city") {
                                    node.material = material
                                } else {
                                    node.material = material1
                                }
                                /*  
                                 if (node.name == 'q1') {
                                 } */
                            }
                        });
                        mesh.position.set(900, 20, 0)
                        state.scene.add(mesh)
                    });
                });
            },
            path() {

            },
            addLine(src, dst, reference) {
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
                //线条颜色
                let colorIndex = reference.split("-")[1];
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
                console.log(colorIndex)
                //线条
                let cinum = 300;
                var geometry = new THREE.Geometry();
                for (let i = 0; i < cinum; i++) {
                    geometry.vertices.push(new THREE.Vector3(...src));
                }
                var line = new MeshLine();
                line.setGeometry(geometry);
                var mesh = new THREE.Mesh(line.geometry, mesh_line);
                mesh.frustumCulled = false;
                state.scene.add(mesh);
                //线条动画
                state._animated(_src, _dst, 1500, () => {
                    line.advance(new THREE.Vector3(_src.x, _src.y, _src.z))
                }, () => {
                    state._animated(_src, _dst, 1500, () => {
                        line.advance(new THREE.Vector3(_src.x, _src.y, _src.z))
                    }, () => {
                        state.dispose(mesh)
                    })
                })


            },
            initBrand(brand){
                var canvas = document.createElement('canvas');
                canvas.width = brand.length * 512;
                canvas.height = 512;
                var context = canvas.getContext("2d");
                // context.fillStyle = "#FFFFFF";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(brandImg, 0, 0, brand.length * 512, 512);
                brand.forEach((b, i) => {
                    add(b, i)
                })
                function add(obj, i) {
                    context.drawImage(startImgs[obj.img], i * 512 + 60, 0, 800, 800);
                    context.font = 'bold 200px Arial';
                    context.fillStyle = '#fff';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.lineWidth = 20;
                    context.fillText(obj.sort + 1, i * 512 + 300, 900);
                }
                return canvas
            },
            initBrandGo(brand, position) { 
                var routerName = new THREE.Texture(state.initBrand(brand));
                routerName.needsUpdate = true;
                var sprMat = new THREE.SpriteMaterial({ map: routerName });
                var spriteText = new THREE.Sprite(sprMat);
                var sprScale = 40;
                spriteText.scale.set(sprScale * brand.length, sprScale, 1);
                spriteText.position.set(position.x, 0, position.z);
                spriteText.paramsType = "brand"
                spriteText.params = {
                    ip: brand[0].ip
                }
                scene.add(spriteText);
                var target = {
                    y: 0
                }
                createjs.Tween.get(target).to({ y: position.y + 20 }, 1000, createjs.Ease.elasticOut)
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
            }

        }
    }
    cloneJSON(data) {
        return JSON.parse(JSON.stringify(data))
    }
    attack_step(item) {
        //获取网段
        let src_p, dst_p;
        if (item.src == "0.0.0.0") {
            src_p = [0, 3000, 0]
        } else {
            //根据网段找到数据
            let src = this.ip_get_network(item.src)
            let src_node = this.getNode(src)
            src_p = this.state.transformPostion(src_node.position)
        }
        if (item.dst == "0.0.0.0") {
            dst_p = [0, 3000, 0]
        } else {
            let dst = this.ip_get_network(item.dst)
            let dst_node = this.getNode(dst)
            dst_p = this.state.transformPostion(dst_node.position)
        }
        console.log(item)
        return
        if (dst_p.toString() == src_p.toString()){

        }else{
            this.state.addLine(
                src_p,
                dst_p,
                item.reference
            )
        }
         
    }
    ip_get_network(str) {
        return str.split("/")[0].split(".")[2]
    }
    getNode(net) {
        let index = 0;
        while (index < cityPotion.length) {
            let unit = cityPotion[index]
            if (unit.subnet.indexOf(net) !== -1) {
                return unit
            }
            index++;
        }

    }



}
export default City;