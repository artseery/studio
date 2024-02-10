<template>
  <div class="header">
    <button class="button" @click="$router.push(button.url)">
      {{ button.name }}
    </button>
  </div>
  <router-view/>
</template>

<script setup lang="ts">
import {computed, watch} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();

watch(() => route.name, async newId => {
  console.log(newId)
})

const button = computed(() => {
  if (route.name === 'test') {
    return {
      name: 'К админке',
      url: '/admin'
    }
  } else {
    return {
      name: 'К тесту',
      url: '/test'
    }
  }
})
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
}

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
