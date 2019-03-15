import $ from 'zepto'
import "./index.less";
import City from './city';
import Vue from 'vue'
import axios from '../../utils/axios'
let dom = document.getElementById("main")
let _city = new City({
    width: dom.offsetWidth,
    height: dom.offsetHeight - 5,
    id: "city",
    stats:true
})