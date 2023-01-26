<template>
    <h1 class="title">hello vue</h1>
    <ul>
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
    </ul>
    <router-view />
</template>

<script>
    export default {
        name: 'App',
    }
</script>

<style>
    .title {
        color: pink;
        font-size: 20px;
    }
</style>
