<script setup>
import TypingArea from "./components/TypingArea.vue";
import CursorMask from "./components/CursorMask.vue";
import Header from "./components/partials/Header.vue";
import Footer from "./components/partials/Footer.vue";
</script>

<template>
  <CursorMask :mask="{ cursor: true, radius: 70 }">
    <div class="wrapper">
      <Header />
      <div class="content">
        <TypingArea />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
  </CursorMask>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.content {
  flex: 1 0 auto;
}
.footer {
  flex: 0 0 auto;
}
</style>
