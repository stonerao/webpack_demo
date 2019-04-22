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
function WEBGL() {
    let prototype = WEBGL.prototype;
    let camera, scene, renderer;
    let dom = document.getElementById("canvas")
    let [width, height] = [window.innerWidth, window.innerHeight]
    let controls;
    let stats;
    let rotation;
    prototype.init = () => {
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
    prototype.animationFrame = () => {
        stats.update()
        renderer.render(scene, camera);
        requestAnimationFrame(prototype.animationFrame);
    }
    prototype.resize = () => {
        //自适应
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    prototype.createGrid = () => {
        //辅助线
        /*  let gridHelper = new THREE.GridHelper(10000, 200);
         scene.add(gridHelper);
  */
        /*   let ambient = new THREE.AmbientLight(0xffffff); // soft white light
          scene.add(ambient); */
        var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(light);
    }
    prototype.initControls = () => {
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
    prototype.stats = () => {
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
    prototype.initTestBox = () => {
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
    prototype.testCircle = () => {
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
    
    prototype.get2dLength = function(x1,y1,x2,y2){
        var xdiff = x2 - x1;            // 计算两个点的横坐标之差
        var ydiff = y2 - y1;            // 计算两个点的纵坐标之差
        return Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5);   // 计算两点之间的距离，并将结果返回表单元素
    }


    prototype.load = () => {
        this.init();
        this.createGrid()
        this.stats()
        this.initControls() 
        this.animationFrame();
    }
    this.load()
    window.addEventListener("resize", this.resize)
}
export default WEBGL;