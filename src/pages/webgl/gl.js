/**
 * @date 2019-03-28
 * THREE
 * stonerao 
 */
function GL() {
    let _prototype = GL.prototype;
    let camera, scene, renderer;
    let dom = document.getElementById("canvas")
    let [width, height] = [window.innerWidth, window.innerHeight]
    let controls;
    let stats;
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
            let number = Math.random() * 1000;
            return Math.random() < 0.5 ? 0 - number : number
        }
        /*  FPS 10-15
         let index = 0
          // geometry 比material 慢  
          var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
          var geometry = new THREE.BoxGeometry(1, 1, 1);
          while (index < 100000) { 
              var cube = new THREE.Mesh(geometry, material);
              scene.add(cube);
              cube.position.set(random(), random(), random())
              index++;
        } */
        var contain = new THREE.Object3D();
        let index = 0; 
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        while(index<100000){
            var cube = new THREE.Mesh(geometry, material);
            // scene.add(cube);
            contain.add(cube);
            cube.position.set(random(), random(), random())
            index++;
        }
        scene.add(contain)
 
    }

    _prototype.load = () => {
        this.init();
        this.createGrid()
        this.stats()
        this.initControls() 
        this.initTestBox() 

        //
        this.animationFrame();
    }
    this.load()
    window.addEventListener("resize", this.resize)
}
export default GL;