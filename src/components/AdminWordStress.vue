<template>
  <div class="admin-words">
    <input class="admin-words__input" v-model="newWord" @input="clearStressedChars()"/>
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
    <button class="admin-words-save" @click="saveWord">Сохранить</button>

    <div v-if="Object.keys(savedWords).length" class="admin-words-list">
      <div class="admin-words-list__title">Сохраненные слова:</div>
      <div v-for="(stress, word) in savedWords" class="admin-words-list__item">
        <div class="admin-words-list__item-delete" @click="deleteWord(word)">
          <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"/></svg>
        </div>
        <div class="admin-words-buttons admin-words-buttons__list">
          <button
              v-for="(char, index) in word"
              class="admin-words-buttons__item"
              :class="[
              {'admin-words-buttons__item--empty': /\s/.test(char.toString())},
              {'admin-words-buttons__item--stressed': JSON.parse(stress).indexOf(index) !== -1}
              ]"
          >
            <span>{{ char }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

const newWord = ref<string>('');
const stressedChars = ref<number[]>([]);
const savedWords = ref<any>({});

const splitWord = computed(() => newWord.value.split(''))

onMounted(async () => {
  const response = await fetch('https://studio-backend-zj2o.onrender.com/words')
  savedWords.value = await response.json();
})

function toggleStressedChar(index: any) {
  const foundIndex = stressedChars.value.indexOf(index)
  if(foundIndex !== -1) {
    stressedChars.value.splice(foundIndex, 1)
  } else {
    stressedChars.value.push(index)
  }
}

function clearStressedChars() {
  stressedChars.value = [];
}

async function saveWord() {
  const response = await fetch('https://studio-backend-zj2o.onrender.com/save-word', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({word: newWord.value, stress: stressedChars.value})
  })
  const result = await response.json()
  savedWords.value = result.words

  newWord.value = ''
  stressedChars.value = []
}

async function deleteWord(word: any) {
  const response = await fetch('https://studio-backend-zj2o.onrender.com/delete-word', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({word: word})
  })
  const result = await response.json()
  savedWords.value = result.words

  console.log(result)
}
</script>

<style lang="sass">
.admin-words
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  padding: 20px
  &-buttons
    display: flex
    gap: 4px
    height: 40px
    &__item
      width: 40px
      height: 40px
      display: flex
      place-items: center
      justify-content: center
      background: #5e81f8
      color: #fff
      font-size: 18px
      font-weight: 500
      transition: all .3s ease
      border-radius: 8px
      &--empty
        opacity: 0
        pointer-events: none
      &--stressed
        background: #2ea156
    &__input &__item
      &:hover
        background: #4e75f8
      &--stressed
        &:hover
          background: #2e8f4b
    &__list &__item
      cursor: default
  &-save
    width: 200px
    height: 40px
    border-radius: 40px
    font-weight: 600
    font-size: 16px
    margin-top: 12px
    background: #5e81f8
    color: #fff
    border: none
    transition: all .3s ease
    &:hover
      background: #4e75f8
  &-list
    padding: 24px 0
    display: flex
    flex-direction: column
    gap: 8px
    min-width: 600px
    &__item
      display: flex
      gap: 8px
      &-delete
        width: 40px
        height: 40px
        border-radius: 8px
        display: flex
        justify-content: center
        align-items: center
        cursor: pointer
        &:hover
          svg
            fill: #ff5454
        svg
          width: 30px
          height: 30px
          transition: all .3s ease
    &__title
      font-size: 18px
      font-weight: 600
</style>
