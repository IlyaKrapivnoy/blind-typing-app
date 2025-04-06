<script setup>
import TypingArea from './components/TypingArea.vue'
import CursorMask from './components/CursorMask.vue'
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <Analytics>
    <CursorMask  :mask="{ cursor: true, radius: 70 }">
      <TypingArea />
    </CursorMask>
  </Analytics>
</template>

<style scoped>
</style>
