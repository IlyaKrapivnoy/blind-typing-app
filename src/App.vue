<script setup>
import TypingArea from "./components/TypingArea.vue";
import CursorMask from "./components/CursorMask.vue";
import Header from "./components/partials/Header.vue";
import Footer from "./components/partials/Footer.vue";
</script>

<template>
  <CursorMask :mask="{ cursor: true, radius: 70 }">
    <Header />
    <TypingArea />
    <Footer />
  </CursorMask>
</template>

<style scoped></style>
