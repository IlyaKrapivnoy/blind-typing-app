<template>
    <div 
      ref="backgroundRef"
      class="cursor-mask"
      :style="containerStyle"
    >
      <!-- Фоновый слой, который будет затемняться/осветляться -->
      <div 
        class="background-layer"
        :class="{ 'mask': mask }"
        :style="maskStyle"
      ></div>
      <!-- Контент всегда остается видимым поверх маски -->
      <div class="content-layer">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
  
  const props = defineProps({
    mask: {
      type: Object,
      default: () => ({
        cursor: true,
        x: 0,
        y: 0,
        radius: 75
      })
    },
    // Дополнительные стили (опционально)
    style: {
      type: Object,
      default: () => ({})
    },
    // Тип позиционирования (fixed, absolute и т.д.)
    position: {
      type: String,
      default: 'fixed'
    }
  });
  
  const backgroundRef = ref(null);
  const cursorPosition = reactive({ x: 0, y: 0 });
  const smoothPosition = reactive({ x: 0, y: 0 });
  let animationFrameId = null;
  
  // Обработка движения мыши для отслеживания позиции курсора
  const handleMouseMove = (event) => {
    if (backgroundRef.value) {
      const rect = backgroundRef.value.getBoundingClientRect();
      cursorPosition.x = event.clientX - rect.left;
      cursorPosition.y = event.clientY - rect.top;
    }
  };
  
  // Плавное движение курсора с эффектом замедления
  const updateSmoothPosition = () => {
    const dx = cursorPosition.x - smoothPosition.x;
    const dy = cursorPosition.y - smoothPosition.y;
    const easingFactor = 0.05;
  
    smoothPosition.x = Math.round(smoothPosition.x + dx * easingFactor);
    smoothPosition.y = Math.round(smoothPosition.y + dy * easingFactor);
    
    animationFrameId = requestAnimationFrame(updateSmoothPosition);
  };
  
  // Расчет стиля маски на основе позиции курсора или фиксированной позиции
  const maskStyle = computed(() => {
    if (!props.mask) return {};
  
    if (props.mask.cursor) {
      return {
        '--mask-position-x': `${smoothPosition.x}px`,
        '--mask-position-y': `${smoothPosition.y}px`,
        '--mask-radius': `${props.mask.radius || 50}vh`,
      };
    }
  
    if (props.mask.x != null && props.mask.y != null) {
      return {
        '--mask-position-x': `${props.mask.x}%`,
        '--mask-position-y': `${props.mask.y}%`,
        '--mask-radius': `${props.mask.radius || 50}vh`,
      };
    }
  
    return {};
  });
  
  // Стиль для контейнера
  const containerStyle = computed(() => {
    return {
      position: props.position,
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: 0,
      overflow: 'hidden',
      ...props.style
    };
  });
  
  // Настройка и очистка
  onMounted(() => {
    document.addEventListener('mousemove', handleMouseMove);
    
    if (props.mask.cursor) {
      animationFrameId = requestAnimationFrame(updateSmoothPosition);
    }
  });
  
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
  </script>
  
  <style>
  .cursor-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    position: relative;
  }
  
  .background-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-image: radial-gradient(rgba(63, 140, 62, 0.5) 0.5px, transparent 0.5px);
    background-size: 10px 10px;
  }
  
  .content-layer {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
  }
  
  .mask {
    /* Цвет подсветки курсора */
    background-color: rgba(63, 140, 62, 0.2);
    mask-size: 100% 100%;
    mask-image: radial-gradient(
      ellipse var(--mask-radius) var(--mask-radius) at var(--mask-position-x) var(--mask-position-y),
      black 0%,
      rgba(0, 0, 0, 0.9) 20%,
      rgba(0, 0, 0, 0.7) 40%,
      rgba(0, 0, 0, 0.5) 60%,
      rgba(0, 0, 0, 0.3) 80%,
      transparent 100%
    );
    -webkit-mask-size: 100% 100%;
    -webkit-mask-image: radial-gradient(
      ellipse var(--mask-radius) var(--mask-radius) at var(--mask-position-x) var(--mask-position-y),
      black 0%,
      rgba(0, 0, 0, 0.9) 20%,
      rgba(0, 0, 0, 0.7) 40%,
      rgba(0, 0, 0, 0.5) 60%,
      rgba(0, 0, 0, 0.3) 80%,
      transparent 100%
    );
  }
  </style>
  