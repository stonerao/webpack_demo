// import geo from '../../json/test.json'
import china from './china' 
import Base from '../../utils/base' 
import ALL_POSITION from '../../json/position' 
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

let arrs = china.features.map(x=>{
    return {
        name:x.properties.name, 
        value:0,
        itemStyle:{
            normal: {
                opacity: 0.5
            }
        }
    }
})
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
            width: 8192,
            height: 4096
        };
        const HEXAGON_RADIUS =2, CITY_MARGIN = 1;
        let hexagon = new THREE.Object3D();
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
                state.camera.position.set(-67.12948362334046, 194.00511749684682, -265.24638887928046)
                state.camera.rotation.set(-2.510092603274835, -0.20150229132048292, -2.9962386420132323)
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
                    if (intersects[0].uv){
                        var x1 = intersects[0].uv.x * mapSize.width;
                        var y1 = mapSize.height - intersects[0].uv.y * mapSize.height;

                        // 在mapCanvas上模拟鼠标事件，这里或许有更好的方法
                        var virtualEvent = document.createEvent('MouseEvents');
                        virtualEvent.initMouseEvent('mousemove', false, true, document.defaultView, 1, x1, y1, x1, y1, false, false, false, false, 0, null);

                        state.mapCanvas.dispatchEvent(virtualEvent);
                    }

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
                state.curEarth()
            },
            renderEarth(_json) {
                var globeTextureLoader = new THREE.TextureLoader();
                var earth_texture = new THREE.TextureLoader().load("../../assets/map/earth.jpeg");
                var earth_bump = new THREE.TextureLoader().load("../../assets/map/bump.jpeg");
                var earth_specular = new THREE.TextureLoader().load("../../assets/map/spec.jpeg");
                var earthGeometry = new THREE.SphereGeometry(199, 36, 36);
                var earthMaterial = new THREE.MeshPhongMaterial({
                    map: mapTexture,
                    shininess: 40,
                    bumpScale: 1,
                    // map: earth_texture,
                    bumpMap: earth_bump,
                    specularMap: earth_specular , 
                });
                var earth = new THREE.Mesh(earthGeometry, earthMaterial);
                state.scene.add(earth)
                state.earthInital()
 

                
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
               /*  renderHouse(125.908772, 40.227883, 4)
                renderHouse(109.59037, 19.020694, 4)
                setTimeout(() => {
                    state.addline(
                        [109.59037, 19.020694, 4], [125.908772, 40.227883, 4]
                    )
                }, 2000)
                state.drawChinaMap() */

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

            },
            initMap() {
                let img = document.getElementById("img")
                state.mapCanvas = document.createElement('canvas');
                state.mapCanvas.width = mapSize.width;
                state.mapCanvas.height = mapSize.height;

                mapTexture = new THREE.Texture(state.mapCanvas);

                var chart = echarts.init(state.mapCanvas);
                population.forEach(x => {
                    x.value = ""
                    x.itemStyle = {
                        normal: {
                            opacity: 0.2
                        }
                    }
                })
                state.population = [...population, ...arrs]
                let option = {
                    backgroundColor: {
                        image: img,
                        repeat: 'no-repeat'
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
                            layoutCenter: ['50%', '42%'],
                            layoutSize: mapSize.width,
                            /* itemStyle: {
                                   emphasis: { label: { show: true } },
                               },  */
                            data: state.population   // from population.js
                        },

                    ]
                };

                chart.setOption(option);
                mapTexture.needsUpdate = true;
                setTimeout(()=>{
                    option.series[0].data.forEach(x=>{
                        if(x.name=="四川省"){
                            var virtualEvent = document.createEvent('MouseEvents');
                            virtualEvent.initMouseEvent('mousemove', false, true, document.defaultView, 1, 3368.2329375153577, 566.6006816370782, 3368.2329375153577, 566.6006816370782, false, false, false, false, 0, null);

                            state.mapCanvas.dispatchEvent(virtualEvent); 
                            return
                        }
                    })
                },5000)
                // 选中或移出时才更新贴图
                // 内存向显存上传数据很慢，应该尽量减少贴图更新
                chart.on('mouseover', function () {
                    mapTexture.needsUpdate = true;
                });

                chart.on('mouseout', function () {
                    mapTexture.needsUpdate = true;
                }); 
            },
            curEarth() {
                state.loaderImg = {
                    conne_1: new THREE.TextureLoader().load('../../assets/map/lightray.jpg'),
                    conne_2: new THREE.TextureLoader().load('../../assets/map/lightray_yellow.jpg')
                }
                



                let index = 0; 
                while(index<ALL_POSITION.length)
                {
                    state.createShapeConne(ALL_POSITION[index].val)
                    index++
                }
                
            },
            createShapeConne(position){
                //创建光锥地表 
                state.initConne(state.getPosition(position[0], position[1], 0))
                state.initHexagon(state.getPosition(position[0], position[1], 0), 1)
            },
            initHexagon(position,index){
                //地表
               const hexagonColor = [0xffffff, 0xffff00]
                const color = hexagonColor[index]
                let hexagonLine = new THREE.CircleGeometry(HEXAGON_RADIUS, 6)
                let hexagonPlane = new THREE.CircleGeometry(HEXAGON_RADIUS - CITY_MARGIN, 6)
                let vertices = hexagonLine.vertices
                vertices.shift() // 第一个节点是中心点
                let circleLineGeom = new THREE.Geometry()
                circleLineGeom.vertices = vertices
                let materialLine = new THREE.MeshBasicMaterial({
                    color: color,
                    side: THREE.DoubleSide
                })
                let materialPlane = new THREE.MeshBasicMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                    opacity: 0.5
                })
                let circleLine = new THREE.LineLoop(circleLineGeom, materialLine)
                let circlePlane = new THREE.Mesh(hexagonPlane, materialPlane)
                circleLine.position.copy(position)
                circlePlane.position.copy(position)
                circlePlane.lookAt(new THREE.Vector3(0, 0, 0))
                circleLine.lookAt(new THREE.Vector3(0, 0, 0))

                hexagon.add(circleLine)
                hexagon.add(circlePlane)
                state.scene.add(hexagon)
            },
            initConne(position) { 
                //光锥
                let texture = state.loaderImg.conne_2,
                    material = new THREE.MeshBasicMaterial({
                        map: texture,
                        transparent: true,
                        depthTest: false,
                        side: THREE.DoubleSide,
                        blending: THREE.AdditiveBlending
                    }),
                    height = Math.random()*40,
                    geometry = new THREE.PlaneGeometry(HEXAGON_RADIUS, height),
                    matrix1 = new THREE.Matrix4,
                    plane1 = new THREE.Mesh(geometry, material)
                matrix1.makeRotationX(Math.PI / 2)
                matrix1.setPosition(new THREE.Vector3(0, 0, height / -2))
                geometry.applyMatrix(matrix1)
            /*     let plane2 = plane1.clone()
                plane2.rotation.z = Math.PI / 2 /2
                plane1.add(plane2) */

                let plane3 = plane1.clone()
                plane3.rotation.z = Math.PI / 2 
                plane1.add(plane3)

                /* let plane4 = plane1.clone()
                plane4.rotation.z = Math.PI / 2 + Math.PI / 2 / 2
                plane1.add(plane4) */

                plane1.position.copy(position)
                plane1.lookAt(0, 0, 0)
                state.scene.add(plane1) 
                setInterval(()=>{
                    plane1.rotation.z +=0.05
                },200)  

            }
        }
    }



}
export default City;