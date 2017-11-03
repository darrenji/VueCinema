<template>
    <div>detail</div>
</template>


<script>
    export default {
        props: ['movies'],
        created(){
            console.log(this.$route);
        }
    }
</script>