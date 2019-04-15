export default class Base {
    constructor(params) {
        this.state = {}
    }
    setState(Params) {
        if (!this.isObject(Params)) {
            return
        }
        let ParamsKeys = Object.keys(Params)
        for (let i = 0; i < ParamsKeys.length; i++) {
            this.state[ParamsKeys[i]] = Params[ParamsKeys[i]]
        }
    }
    cloneJSON(json) {
        if (!this.isObject(json)) {
            return false
        }
        return JSON.parse(JSON.stringify(json))
    }
    warn(msg) {
        console.warn(msg)
    }
    isObject(val) {
        if (typeof val !== 'object') {
            this.warn('not is object');
            return false
        } else {
            return true
        }
    }
    isArray(val) {
        if (val instanceof Array) {
            return true
        } else {
            this.warn('not is Array');
            return false
        }
    }
    isUndefined(val) {
        return typeof val === 'undefined'
    }
    getPosition(lng, lat, alt) {
        // 获取position 
        var phi = (90 - lat) * (Math.PI / 180),
            theta = (lng + 180) * (Math.PI / 180),
            radius = alt + 200,
            x = -(radius * Math.sin(phi) * Math.cos(theta)),
            z = (radius * Math.sin(phi) * Math.sin(theta)),
            y = (radius * Math.cos(phi));
        return { x: x, y: y, z: z };
    }
    setData(){
        let data = this.data();
        for (let key in data) {
            this[key] = data[key]
        }
    }
}