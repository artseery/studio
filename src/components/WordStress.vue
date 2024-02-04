<template>
  <div class="word">
    <div class="admin-words-buttons admin-words-buttons__input">
      <button
          v-for="(char, index) in splitWord"
          class="admin-words-buttons__item"
          :class="[
              {'admin-words-buttons__item--empty': /\s/.test(char)},
              {'admin-words-buttons__item--stressed': stressedChars.includes(index)}
              ]"
          @click="toggleStressedChar(index)"
      >
        <span>{{ char }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue/dist/vue";

const newWord = ref<string>('');

const stressedChars = ref<string[]>([]);

const splitWord = computed(() => newWord.value.split(''))

function toggleStressedChar(index) {
  const foundIndex = stressedChars.value.indexOf(index)
  if(foundIndex !== -1) {
    stressedChars.value.splice(foundIndex, 1)
  } else {
    stressedChars.value.push(index)
  }
}
</script>

<style module lang="sass">

</style>
