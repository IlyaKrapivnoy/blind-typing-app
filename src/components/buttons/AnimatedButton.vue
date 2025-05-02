<template>
  <div class="tooltip-wrapper">
    <button
      class="btn"
      @click="openLink"
      :aria-label="ariaLabel"
      @mouseenter="show = true"
      @mouseleave="show = false"
    >
      <font-awesome-icon v-if="icon" :icon="icon" class="icon" />
    </button>
    <transition name="fade">
      <div v-if="show && tooltip" class="tooltip">{{ tooltip }}</div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const show = ref(false);
const props = defineProps({
  icon: {
    type: [String, Array],
    required: false,
  },
  link: {
    type: String,
    required: false,
    default: "https://github.com/IlyaKrapivnoy",
  },
  ariaLabel: {
    type: String,
    required: false,
    default: "Visit Link",
  },
  tooltip: {
    type: String,
    required: false,
    default: "",
  },
});
function openLink() {
  if (props.link) {
    window.open(props.link, "_blank", "noopener,noreferrer");
  }
}
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.btn {
  display: grid;
  place-items: center;
  background: #e3edf7;
  padding: 4px;
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
  font-size: 26px;
  color: #386a3a;
}

.btn:hover svg,
.btn:hover .icon {
  transform: scale(0.9) rotate(360deg);
  fill: #333333;
  color: #333333;
}

.tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: #222;
  color: #fff;
  padding: 4px 10px;
  border-radius: 5px;
  white-space: nowrap;
  font-size: 13px;
  opacity: 0.95;
  pointer-events: none;
  z-index: 10;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
