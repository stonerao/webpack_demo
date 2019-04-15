import Base from './base'
let _this;
export default class earth extends Base {
    data() {
        return {
            camera: null,
            scene: null,
            renderer: null,
            controls: null,
            stats: null,
            width: null,
            height: null,
            dom: null
        }
    }
    constructor(params) {
        super()
        this.setData()
        let { dom, data } = params;
        this.dom = dom;
        this.width = this.dom.width = window.innerWidth;
        this.height = this.dom.height = window.innerHeight;
        _this = this;
        this.load()
        this.setState({
            data: data
        })

        window.addEventListener("resize", this.resize)
    }
    resize() {
        //自适应 
        _this.camera.aspect = window.innerWidth / window.innerHeight;
        _this.camera.updateProjectionMatrix();
        _this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    init() {
        let context = this.dom.getContext('webgl2');
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.dom,
            context: context
        });
        //设置背景颜色 以及 大小
        this.renderer.setClearColor(0x04060E, 1.0);
        this.renderer.setSize(this.width, this.height);
        //场景
        this.scene = new THREE.Scene()
        //透视相机
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 10000);
        //镜头位置
        this.camera.position.set(200, 1200, 1200)
        //添加
        this.scene.add(this.camera)
    }
    initControls() {
        /* 创建鼠标事件 */
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        //动态阻尼系数 就是鼠标拖拽旋转灵敏度
        this.controls.dampingFactor = 1;
        //是否可以缩放
        this.controls.enableZoom = true;
        //是否自动旋转controls.autoRotate = true; 设置相机距离原点的最远距离
        this.controls.minDistance = 30;
        //设置相机距离原点的最远距离
        this.controls.maxDistance = 5000;
        //是否开启右键拖拽
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1;
    }
    initStats() {
        this.stats = new Stats();
        this.stats.setMode(0);
        let stateNode = document.createElement('div');
        stateNode.innerHTML = '';
        stateNode.appendChild(this.stats.domElement)
        document.querySelector("body").appendChild(this.stats.domElement)
    }
    initText() {
        var x = 0, y = 0;

        var heartShape = new THREE.Shape();

        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x , y , x + 4, y+123, x, y);
        heartShape.bezierCurveTo(x , y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x , y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        var geometry = new THREE.ShapeBufferGeometry(heartShape, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, });
        var mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }
    load() {
        this.init()
        this.initControls()
        this.initStats()
        /* 辅助线 */
        this.scene.add(new THREE.GridHelper(10000, 200));
        this.initText()
        this.animationFrame()
    }
    animationFrame() {
        _this.stats.update()
        _this.renderer.render(_this.scene, _this.camera);
        requestAnimationFrame(_this.animationFrame);
    }
}