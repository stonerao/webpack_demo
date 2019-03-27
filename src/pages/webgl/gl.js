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
        let gridHelper = new THREE.GridHelper(10000, 200);
        scene.add(gridHelper);

        let ambient = new THREE.AmbientLight(0xffffff); // soft white light
        scene.add(ambient);
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
    _prototype.initTestBox = () => {
        //测试10W以上盒子性能
        const random = () => {
            let number = Math.random() * 5000;
            return Math.random() < 0.5 ? 0 - number : number
        }
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
            _animated(src, { scale: 0.5 },2000,function(){ 
                earth.scale.x = src.scale
                earth.scale.y = src.scale
                earth.scale.z = src.scale
            })
           
        });
    }
    _prototype.load = () => {
        this.init();
        this.createGrid()
        this.stats()
        this.initControls()
        // this.initTestBox()
        // 
        this.testCircle()
        //
        this.animationFrame();
    }
    this.load()
    window.addEventListener("resize", this.resize)
}
export default GL;