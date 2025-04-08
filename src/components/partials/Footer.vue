<template>
  <div class="footer">
    <p>
      {{ currentYear }} © by ilya krapivnoy
    </p>
    <GitHubButton />
  </div>
</template>

<script setup>
import GitHubButton from "./GitHubButton.vue";

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 20px 0;
}

.footer p {
  color: #8e8e8e;
}
</style>
