<script setup lang="ts">
import {computed} from 'vue';
import type {LoaderTheme} from '../core/types';
const props = defineProps<LoaderTheme>();

const loaderStyle = computed(() => ({
  borderColor: props.secondary || '#e0e0e0',
  borderRightColor: props.primary || '#616161'
}));
</script>

<template>
  <div class="loader-icon" :style="loaderStyle"></div>
</template>

<style>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loader-icon {
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  animation: rotate 1s linear infinite;
}
</style>
