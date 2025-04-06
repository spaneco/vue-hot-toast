<script setup lang="ts">
import {computed} from 'vue';
import type {CheckmarkTheme} from '../core/types';

const props = defineProps<CheckmarkTheme>();

const style = computed(() => ({
  '--checkmark-primary': props.primary || '#61d345',
  '--checkmark-secondary': props.secondary || '#fff'
}));
</script>

<template>
  <div class="checkmark-icon" :style="style"></div>
</template>

<style>
@keyframes circleAnimation {
  from {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(45deg);
    opacity: 1;
  }
}

@keyframes checkmarkAnimation {
  0% {
    height: 0;
    width: 0;
    opacity: 0;
  }
  40% {
    height: 0;
    width: 6px;
    opacity: 1;
  }
  100% {
    opacity: 1;
    height: 10px;
  }
}

.checkmark-icon {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: var(--checkmark-primary);
  position: relative;
  transform: rotate(45deg);
  opacity: 0;
  animation: circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation-delay: 100ms;

  &::after {
    content: '';
    box-sizing: border-box;
    animation: checkmarkAnimation 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: var(--checkmark-secondary);
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
}
</style>
