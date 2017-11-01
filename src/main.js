import Vue from 'vue';
import './style.scss';

new Vue({
    el: '#app',
    components: {
        'movie-list':{
            template: `<div id="movie-list">
                            Movie List
                        </div>`
        },
        'movie-filter':{
            template: `<div id="movie-filter">
                            Movie Filter
                        </div>`
        }
    }
});