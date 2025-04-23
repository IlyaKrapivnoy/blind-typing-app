<template>
  <div class="footer">
    <p>{{ currentYear }} by ilya krapivnoy</p>
    <div class="buttons">
      <AnimatedButton
        :icon="['fab', 'linkedin-in']"
        link="https://www.linkedin.com/in/ilya-krapivnoy/"
      />
      <AnimatedButton
        :icon="['fab', 'github']"
        link="https://github.com/IlyaKrapivnoy"
      />
      <AnimatedButton
        :icon="['fas', 'circle-user']"
        link="https://professional-card-one.vercel.app/"
      />
    </div>
  </div>
</template>

<script setup>
import AnimatedButton from "../buttons/AnimatedButton.vue";

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

.buttons {
  display: flex;
  gap: 30px;
}
</style>
