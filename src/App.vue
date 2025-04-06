<script setup>
import TypingArea from './components/TypingArea.vue'
import CursorMask from './components/CursorMask.vue'
</script>

<template>
  <CursorMask  :mask="{ cursor: true, radius: 70 }">
    <TypingArea />
  </CursorMask>
</template>

<style scoped>
</style>
