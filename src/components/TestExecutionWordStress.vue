<template>
  <div class="test">
    <div
        v-for="word in props.test"
        class="words-item"
        :class="{'words-item--mistake': mistakes[word]}"
    >
      <div class="words-buttons words-buttons__list">
        <button
            v-for="(char, index) in word"
            class="words-buttons__item"
            @click="toggleStress(index, word)"
            :class="[
                {'words-buttons__item--empty': /\s/.test(char)},
                {'words-buttons__item--stressed': words[word] && words[word].includes(index)},
                ]"
        >
          <span>{{ char }}</span>
        </button>
      </div>
      <div v-if="mistakes[word]" class="words-buttons words-buttons__list">
        <button
            v-for="(char, index) in word"
            class="words-buttons__item words-buttons__item-correct"
            @click="toggleStress(index, word)"
            :class="[
                {'words-buttons__item--empty': /\s/.test(char)},
                {'words-buttons__item--stressed': mistakes[word] && JSON.parse(mistakes[word]).includes(index)},
                ]"
        >
          <span>{{ char }}</span>
        </button>
      </div>
    </div>
    <button v-if="!isResultMode" class="button" @click="checkResult">Проверить результат</button>
    <div
        class="words-result"
        :class="rightAnswersCount < answersCount ? 'words-result--wrong' : 'words-result--right'"
        v-else>
      <span>{{rightAnswersCount}}</span>/<span>{{answersCount}}</span> верно
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, defineProps, ref} from 'vue'

const props = defineProps(['test']);

const words = ref<any>({})

const mistakes = ref<any>({})

const isResultMode = ref<boolean>(false)

const rightAnswersCount = computed(() => {
  console.log(mistakes.value)
  return Object.keys(words.value).length - Object.keys(mistakes.value).length
})

const answersCount = computed(() => {
  return Object.keys(props.test).length
})

function toggleStress(index: any, word: any) {
  if (!words.value[word]) {
    words.value[word] = []
  }
  const foundIndex = words.value[word].indexOf(index)
  if(foundIndex !== -1) {
    words.value[word].splice(foundIndex, 1)
  } else {
    words.value[word].push(index)
  }
}
async function checkResult() {
  const req = words.value
  const response = await fetch('https://studio-backend-zj2o.onrender.com/check-test', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({words: req})
  })
  const result = await response.json()
  if (result.mistakes) {
    mistakes.value = result.mistakes
  }
  isResultMode.value = true
}

</script>

<style scoped lang="sass">
.button
  align-self: center
.test
  width: max-content
  margin: 0 auto
  display: flex
  flex-direction: column
  gap: 8px
  padding: 20px
.words
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  padding: 20px
  &-result
    font-size: 24px
    font-weight: 600
    letter-spacing: 1px
    &--wrong
      color: #ff5454
    &--right
      color: #2ea156
  &-item
    display: flex
    flex-direction: column
    padding: 4px
    gap: 8px
    &--mistake
      border: 2px solid #ff5454
      border-radius: 12px
    &--mistake
      .words
        &-buttons
          &__item
            &--stressed
              background: #ff5454
            &-correct.words-buttons__item--stressed
              background: #2ea156
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
      font-size: 22px
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
  &-list
    padding: 24px 0
    display: flex
    flex-direction: column
    gap: 8px
    min-width: 600px
    &__item
      display: flex
      gap: 8px
</style>
