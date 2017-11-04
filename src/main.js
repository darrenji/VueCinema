import Vue from 'vue';
import './style.scss';
import genres from './util/genres';



import VueResource from 'vue-resource';
Vue.use(VueResource);


import moment from 'moment-timezone';
moment.tz.setDefault("UTC");
//为Vue的原型对象添加新的属性$moment
Object.defineProperty(Vue.prototype, '$moment', {get(){ return this.$root.moment }});

//注册一个bus
import {checkFilter, setDay} from './util/bus';
const bus = new Vue();
Object.defineProperty(Vue.prototype, '$bus', {get(){return this.$root.bus}});

//引入注册路由
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import routes from './util/routes';
const router = new VueRouter({
    routes
});

new Vue({
    el: '#app',
    data: {
        genre: [],
        time: [],
        movies: [],
        moment,
        day: moment(),
        bus
    },
    created(){
        this.$http.get('/api').then(response => {
            this.movies = response.data;
        });
        this.$bus.$on('check-filter', checkFilter.bind(this));
        this.$bus.$on('set-day', setDay.bind(this));
    },
    router
});

import {addClass, removeClass} from './util/helpers';

Vue.directive('tooltip', {
   bind(el, bindings){
       let span = document.createElement('SPAN');
       let text = document.createTextNode('Seats available:200');
       span.appendChild(text);
       addClass(span, 'tooltip');
       el.appendChild(span);
       
       let div = el.getElementsByTagName('DIV')[0];
       div.addEventListener('mouseover', function(){
          console.log('mouseover'); 
       });
   } 
});