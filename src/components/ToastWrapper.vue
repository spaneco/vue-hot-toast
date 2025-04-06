<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { ToastWrapperProps } from '../core/types';

const props = defineProps<ToastWrapperProps>();

const wrapperRef = ref<HTMLElement | null>(null);
let observer: MutationObserver | null = null;

onMounted(() => {
  if (wrapperRef.value) {
    const updateHeight = () => {
      const height = wrapperRef.value?.getBoundingClientRect().height || 0;
      props.onHeightUpdate(props.id, height);
    };

    updateHeight();

    observer = new MutationObserver(updateHeight);
    observer.observe(wrapperRef.value, {
      subtree: true,
      childList: true,
      characterData: true,
    });
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <div ref="wrapperRef" :class="className" :style="style">
    <slot></slot>
  </div>
</template>
