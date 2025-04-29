<script setup>
import HelloWorld from './components/HelloWorld.vue';
import NaverMap from './components/NaverMap.vue';
import Lnb from './components/Lnb.vue';
import Main from './components/Main.vue';
</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <div class="sb-nav-fixed">
    <div id="layoutSidenav">  
      <div id="layoutSidenav_nav">
        <!-- Lnb :: 왼쪽 메뉴바 -->
        <Lnb />
      </div>
      <div id="layoutSidenav_content">
        <main>
          <Main />
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
