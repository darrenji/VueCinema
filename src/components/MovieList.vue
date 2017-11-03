<template>
    <div id="movie-list">
         <div v-if="filteredMovies.length">
             <movie-item v-for="movie in filteredMovies" 
                 v-bind:movie="movie.movie" 
                 v-bind:day = "day"
                 v-bind:sessions="movie.sessions"></movie-item>
         </div>
         <div v-else-if="movies.length" class="no-results">
             No results.
         </div>
         <div v-else>
             Loading...
         </div>
     </div>
</template>


<script>
    import genres from '../util/genres';
    import MovieItem from './MovieItem.vue';
    import times from '../util/times';
    export default {
            props: ['genre', 'time', 'movies', 'day'],
            methods: {
              moviePassesGenreFilter(movie){
                  if(!this.genre.length){
                      return true;
                  } else {
                      //获取当前movie中的所有genre
                      let movieGenres = movie.movie.Genre.split(", ");
                      
                      let matched = true;                    
                      this.genre.forEach(genre => {
                          if(movieGenres.indexOf(genre) === -1){
                              matched = false;
                          }
                      });
                      return matched;
                  }
                  
              },
              sessionPassesTimeFilter(session){
                  if(!this.day.isSame(this.$moment(session.time), 'day')) {
                      return false;
                  } else if (this.time.length ===0 || this.time.length ===2) {
                      return true;
                  } else if (this.time[0] === times.AFTER_6PM){
                      return this.$moment(session.time).hour() >= 18;
                  } else {
                      return this.$moment(session.time).hour() < 18;
                  }
                  
              }
            },
            computed: {
                filteredMovies(){
                    return this.movies
                        .filter(this.moviePassesGenreFilter)
                        .filter(movie =>movie.sessions.find(this.sessionPassesTimeFilter));
                }
            },
            components: {
                MovieItem
            },
            created(){
//                console.log(this.$moment);
            }
    }
</script>