<template>
    <div id="movie-list">
         <movie-item v-for="movie in filteredMovies" v-bind:movie="movie.movie"></movie-item>
     </div>
</template>


<script>
    import genres from '../util/genres';
    import MovieItem from './MovieItem.vue';
    export default {
            props: ['genre', 'time', 'movies'],
            methods: {
              moviePassesGenreFilter(movie){
                  if(!this.genre.length){
                      return true;
                  } else {
                      //遍历每个movie的genre是否在genre数组中
                      return this.genre.find(genre => movie.genre === genre);
                  }
                  
              }  
            },
            computed: {
                filteredMovies(){
                    return this.movies.filter(this.moviePassesGenreFilter);
                }
            },
            components: {
                MovieItem
            }
    }
</script>