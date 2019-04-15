import "./index.less";
import * as d3 from 'd3';
import earth from './earth'
import data from './data.json'
let Dom = document.getElementById("canvas")
let _Earch = new earth({
    dom:Dom,
    data:data
}) 