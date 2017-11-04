> 组件关系是怎样的？

Overview.vue是根组件，下面有一个MovieList组件和MoiveFilter组件。Detail组件不是任何组件的子组件，所以默认属于根组件Overview.

MovieItem组件是MovieList的子组件。CheckFilter组件是MovieFilter的子组件。

> Overview组件如何确定为根组件的？

是在路由配置的时候配置的，配置完以后把VueRouter实例交给Vue实例的router属性。当然，使用VueRouter一定要先让Vue注册VueRouter，通过`Vue.use(VueRouter)`。

> Overview组件需要接受哪些数据？这些数据是从哪里来的？

在Overview组件中的props属性规定了需要接受的数据。这几个props属性分别是genre, time, movies, day。genre是数组类型，用来接收当前选中的分类。time是数组类型，用来接收当前选中的时间。day是moment类型，moment类型是一个第三方的库。

movies数据从哪里来？什么时候来的？通过Vue的created生命周期事件，使用`$http.get`发送请求获取到的数据注入到movies这个数组中。

genre和time数据什么时候来的？从哪里来的？当点击CheckFilter中的复选框的时候触发事件，通过`this.$bus.$emit('事件名称',事件参数)`把事件和参数广播出去，由于Overview组件在Created生命周期事件中通过`this.$bus.$on(事件名称,回调方法)`侦听`$emit`所发布的事件，所以，这时候，就触发了回调方法，也就是通过这个回调方法让genre和time有了值。这里面又带出了两个问题，一个是`this.$bus.$on(事件名称,回调方法)`中的回调方法做了什么？另一个是`$bus`是怎样来的？

> `$bus`是怎么来的？

```
const bus = new Vue();
Object.defineProperty(Vue.prototype, '$bus', {get(){return this.$root.bus}});
```
所谓的`$bus`实际上就是一个Vue实例，把它合并到Vue的prototype属性上，然后通过`$root`来获取，`$bus`就像是一个别名一样。

> `this.$bus.$on(事件名称,回调方法)`中的回调方法做了什么？

```
function checkFilter(category, title, checked){
    if(checked) {
        this[category].push(title);
    } else {
        let index = this[category].indexOf(title);
        if(index > -1) {
            this[category].splice(index, 1);
        }
    }
}

export {checkFilter}
```

就是把CheckFilter的选中项放到了genre和time这两个数组中了。

> Overview组件接受到的genre, time, movies, day又交给了谁呢？

Ovverview组件把自己通过genre, time, movies, day接受到的值交给了MovieList组件。

```
<movie-list v-bind:genre="genre" v-bind:time="time" v-bind:movies="movies" v-bind:day="day"></movie-list>
```

> MovieList组件又是怎样处理genre, time, movies, day的？

MovieList组件根据genre, time过滤movies获取一个经过过滤的movi集合，要对movies过滤，这个过程是在computed中完成的。也就是对`this.moves`使用`filter方法`，`filter`方法只要返回布尔类型就行。而且这里的过滤，需要通过链式过滤两次，一个是有关时间的过滤，一个是有关genre的过滤。

> MovieList组件中有关genre的过滤逻辑是什么？

genre是一个数组，从movie中获取的genre也是一个数组比如叫做movieGenres，我们就使用`forEach`方法遍历genre数组，如果遍历的genre不在movieGenres中，那就返回false.

> MovieList组件中有关time的过滤逻辑是什么？

判断过滤条件选择了几个，和今天this.day比较，以及判断time数组元素选择了哪个。

> MovieItem组件的数据从哪里来的？

是通过movie这个props中的属性获取到数据.

> 为什么DaySelect选择一个日期，MovieItem中的日期也跟着变化呢？

当在DaySelect组件中选择一个日期，有了一个点击事件，就通过`this.$bus.$emit('set-day',day);`把事件传播出去，然后根组件Overview中通过`this.$bus.$on('set-day', setDay.bind(this));`对根组件中data中的变量day进行设置，然后这个day的变量值通过`<movie-list v-bind:genre="genre" v-bind:time="time" v-bind:movies="movies" v-bind:day="day"></movie-list>`给到了MovieList组件，MovieList组件通过`v-for="session in filteredSession(movie.sessions)`把MovieItem中的slot坑显示出来，而filteredSession用到的过滤逻辑就和MovieList组件中的day变量有关。