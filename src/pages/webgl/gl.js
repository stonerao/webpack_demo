/**
 * @date 2019-03-28
 * THREE
 * stonerao 
 */
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
function GL() {
    let _prototype = GL.prototype;
    let camera, scene, renderer;
    let dom = document.getElementById("canvas")
    let [width, height] = [window.innerWidth, window.innerHeight]
    let controls;
    let stats;
    let rotation;
    _prototype.init = () => {
        dom.width = width;
        dom.height = height;
        //webgl 2
        let context = dom.getContext('webgl2');
        renderer = new THREE.WebGLRenderer({
            canvas: dom,
            context: context
        });
        //设置背景颜色 以及 大小
        renderer.setClearColor(0x04060E, 1.0);
        renderer.setSize(width, height);
        //场景
        scene = new THREE.Scene()
        //透视相机
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        //镜头位置
        camera.position.set(200, 500, 200)
        //添加
        scene.add(camera)
    }
    _prototype.animationFrame = () => {
        stats.update()
        renderer.render(scene, camera);
        requestAnimationFrame(_prototype.animationFrame);
    }
    _prototype.resize = () => {
        //自适应
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    _prototype.createGrid = () => {
        //辅助线
       /*  let gridHelper = new THREE.GridHelper(10000, 200);
        scene.add(gridHelper);
 */
      /*   let ambient = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(ambient); */
        var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(light);
    }
    _prototype.initControls = () => {
        /* 创建鼠标事件 */
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        controls.dampingFactor = 1;
        //是否可以缩放
        controls.enableZoom = true;
        //是否自动旋转controls.autoRotate = true; 设置相机距离原点的最远距离
        controls.minDistance = 30;
        //设置相机距离原点的最远距离
        controls.maxDistance = 5000;
        //是否开启右键拖拽
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1;
    }
    _prototype.stats = () => {
        stats = new Stats();
        stats.setMode(0);
        let stateNode = document.createElement('div');
        stateNode.innerHTML = '';
        stateNode.appendChild(stats.domElement)
        document.querySelector("body").appendChild(stats.domElement)
    }
    const random = (num = 5000) => {
        let number = Math.random() * num;
        return Math.random() < 0.5 ? 0 - number : number
    }
    _prototype.initTestBox = () => {
        //测试10W以上盒子性能 
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        function addCube() {
            var geometry = new THREE.BoxGeometry(1, 1, 1);
            var cube = new THREE.Mesh(geometry);
            return cube
        }
        var geometry = new THREE.Geometry();
        console.time()
        let index = 0
        while (index < 100000) {
            var cube = addCube(); //创建了一个随机位置的几何体模型
            cube.position.x = random()
            cube.position.y = random()
            cube.position.z = random()
            cube.updateMatrix(); //手动更新模型的矩阵
            geometry.merge(cube.geometry, cube.matrix); //将几何体合并
            index++
        }

        scene.add(new THREE.Mesh(geometry, material));


    }
    _prototype.testCircle = () => {
        var earthGeometry = new THREE.SphereGeometry(199, 36, 36);
        new THREE.TextureLoader().load("/assets/map/earth4.jpg", function (img) {
            var earthMaterial = new THREE.MeshPhongMaterial({
                map: img,
                shininess: 40,
                bumpScale: 1,
                // map: earth_texture,
                /*  bumpMap: earth_bump,
                 specularMap: earth_specular, */
            });
            var earth = new THREE.Mesh(earthGeometry, earthMaterial);
            earth.material.transparent = true;
            earth.material.color.set(0xffffff)
            scene.add(earth)
            let src = {
                scale: 1
            }
            _animated(src, { scale: 0.5 }, 2000, function () {
                earth.scale.x = src.scale
                earth.scale.y = src.scale
                earth.scale.z = src.scale
            })

        });
    }
    function GetDistance(lat1, lng1, lat2, lng2) {
        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s;
    }
    function juli(lat1, lng1, lat2, lng2) {       // 从form的表单中分别提取两个点的横、纵坐标
        var x1 = eval(lat1);   // 第一个点的横坐标
        var y1 = eval(lng1);   // 第一个点的纵坐标
        var x2 = eval(lat2);   // 第二个点的横坐标
        var y2 = eval(lng2);   // 第二个点的纵坐标
        var xdiff = x2 - x1;            // 计算两个点的横坐标之差
        var ydiff = y2 - y1;            // 计算两个点的纵坐标之差
        return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);   // 计算两点之间的距离，并将结果返回表单元素
    }
    _prototype.addCube = (position) => {
        var geometry = new THREE.BoxGeometry(2, 90, 2);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(position[0], 45, position[1])
        scene.add(cube);
        return cube
    }
    _prototype.createWay = () => {
        //其实目标和重点目标  生成路
        // Create a sine-like wave
        // let arr = []
        /*  for(let i=0;i<40;i++){
             arr.push([random(i),i*5])
         }  */
         
        let arr = [
            [-100, 0],
            [-50, 50],
            [0, 0],
            [50, -50],
            [100, 0],
            [205, 20],
            [205, 20],
            [23, 220],
            [3, 420],
            [-23, 320],
            [205, 220],
            [-205, 20],
        ]
        var curve = new THREE.SplineCurve(arr.map(x => new THREE.Vector2(...x)));
        let src = arr[0]
        let dst = [199, 2]
        let src_node = this.addCube(src)
        // let dst_node = this.addCube(dst)
        var points = curve.getPoints(arr.length * 10);

        var geometry = new THREE.BufferGeometry().setFromPoints(points);

        var material = new THREE.LineBasicMaterial({ color: 0xff0000 });

        // Create the final object to add to the scene
        var splineObject = new THREE.Line(geometry, material);
        splineObject.rotation.x = Math.PI / 2
        scene.add(splineObject)
        let len = GetDistance(...src, ...dst)
       
        //找到src 离路最近的点
        let src_len = []
        points.forEach((x, index) => {
            src_len.push({
                len: juli(...src, x.x, x.y),
                index: index
            })
        })
        //找到距离当前最小的点
        let min_src = src_len.sort((a, b) => a.len - b.len)[0]
         
        //生于的数组
        let last_arr = points.filter((x, i) => i > min_src.index)
        if (last_arr.length == 0) {
            last_arr = JSON.parse(JSON.stringify(points)).reverse()
        }
        function animate(arr) {
            if (arr.length == 0) {
                return
            }
            let _p = arr.shift()
            src_node.position.set(_p.x, 45, _p.y)
            setTimeout(() => {
                animate(arr)
            },30)
        }
        setTimeout(() => {
            animate(last_arr)
        }, 2000)
    }
    _prototype.city = ()=>{
       /*  var mtlLoader = new THREE.MTLLoader();
        mtlLoader.load('/assets/gl/cs.mtl', function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load('/assets/gl/cs.obj', function (mesh) {
                mesh.traverse(function (node) {
                    if (node instanceof THREE.Mesh) { 
                        node.receiveShadow = true; 
                    }
                });
                mesh.position.set(900, 20, 0)
                mesh.params_type = "all_city"
                scene.add(mesh)
            });
        }); */
    }
    _prototype.load = () => {   
        this.init();
        this.createGrid()
        this.stats()
        this.initControls()
        this.city()
        this.initTestBox()
        // 
        // this.testCircle()
        // this.createWay()
        //
        this.animationFrame();
    }
    this.load()
    window.addEventListener("resize", this.resize)
}
export default GL;