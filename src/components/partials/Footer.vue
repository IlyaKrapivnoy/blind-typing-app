<template>
  <div class="wrapper">
    {{ currentYear }} © by ilya krapivnoy
    <GitHubButton />
  </div>
</template>

<script setup>
import GitHubButton from "./GitHubButton.vue";

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
