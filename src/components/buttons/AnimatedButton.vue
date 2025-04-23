<template>
  <button class="btn" @click="openLink" :aria-label="ariaLabel">
    <font-awesome-icon v-if="icon" :icon="icon" class="icon" />
  </button>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const props = defineProps({
  icon: {
    type: [String, Array],
    required: false,
  },
  link: {
    type: String,
    required: false,
    default: 'https://github.com/IlyaKrapivnoy'
  },
  ariaLabel: {
    type: String,
    required: false,
    default: 'Visit Link'
  }
});
function openLink() {
  if (props.link) {
    window.open(props.link, "_blank", "noopener,noreferrer");
  }
}
</script>

<style scoped>
.btn {
  display: grid;
  place-items: center;
  background: #e3edf7;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0);
  cursor: pointer;
  transition: transform 0.5s;
}

.btn:hover {
  border: 1px solid rgba(0, 0, 0, 0.1);
  transform: translateY(0.5em);
}

.btn svg,
.icon {
  transition: transform 0.5s;
  font-size: 34px;
  color: #386a3a;
}

.btn:hover svg,
.btn:hover .icon {
  transform: scale(0.9) rotate(360deg);
  fill: #333333;
  color: #333333;
}
</style>
