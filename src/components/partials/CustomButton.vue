<template>
  <button 
    :class="[
      'custom-button',
      `color-${color}`
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: 'white',
    validator: (value) => ['white', 'red', 'green'].includes(value)
  }
});

defineEmits(['click']);
</script>

<style scoped>
.custom-button {
  padding: 6px 30px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 0.5px solid #fff;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.custom-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.color-white {
  border-color: rgba(255, 255, 255, 0.6);
  color: rgba(255, 255, 255, 0.6);
}

.color-red {
  border-color: rgba(255, 82, 82, 0.6);
  color:rgba(255, 82, 82, 0.6);
}

.color-green {
  border-color: #4caf50;
  color: #4caf50;
}

.custom-button:active {
  outline: none;
}
</style>
