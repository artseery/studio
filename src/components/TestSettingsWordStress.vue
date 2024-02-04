<template>
  <div>
    <div class="test-settings" v-if="currentState === 'settings'">
      <label>Количество слов</label>
      <input max="100" type="number" v-model="settings.count"/>
      <label>Первая буква слова</label>
      <input maxlength="1" v-model="settings.letter"/>
      <button class="button" @click="start">Начать</button>
    </div>
    <test-execution-word-stress v-if="currentState === 'test'" :test="test"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TestExecutionWordStress from './TestExecutionWordStress.vue';

const currentState = ref<string>('settings');
const test = ref<object[]>();
const settings = ref<object>({
  count: '',
  letter: '',
});

async function start() {
  const response = await fetch(`http://localhost:3000/get-test?${new URLSearchParams({
    count: settings.value.count,
    letter: settings.value.letter,
  })}`)
  test.value = await response.json();
  currentState.value = 'test';
}
</script>

<style scoped lang="sass">
.test-settings
  display: flex
  flex-direction: column
  width: max-content
  margin: 0 auto
  padding: 20px

  label
    margin-left: 12px

  .button
    align-self: center
</style>
