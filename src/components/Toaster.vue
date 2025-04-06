<script setup lang="ts">
import {computed} from 'vue';
import type {CSSProperties} from '@vue/runtime-dom'
import type {
  ToasterProps,
  ToastPosition,
} from '../core/types';
import {
  resolveValue,
} from '../core/types';
import {useToaster} from '../core/use-toaster';
import {prefersReducedMotion} from '../core/utils';
import ToastBar from './ToastBar.vue';
import ToastWrapper from './ToastWrapper.vue';

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'top-center' as ToastPosition
});

const DEFAULT_OFFSET = 16;
const activeClass = 'z-index-9999 pointer-events-auto';

const {toasts, handlers} = useToaster(props.toastOptions);

const containerStyle = computed((): CSSProperties => ({
  position: 'fixed',
  zIndex: 9999,
  top: DEFAULT_OFFSET + 'px',
  left: DEFAULT_OFFSET + 'px',
  right: DEFAULT_OFFSET + 'px',
  bottom: DEFAULT_OFFSET + 'px',
  pointerEvents: 'none',
  ...props.style
}));

function getPositionStyle(position: ToastPosition, offset: number): CSSProperties {
  const top = position.includes('top');
  const verticalStyle: CSSProperties = top ? {top: 0} : {bottom: 0};
  const horizontalStyle: CSSProperties = position.includes('center')
      ? {
        justifyContent: 'center',
      }
      : position.includes('right')
          ? {
            justifyContent: 'flex-end',
          }
          : {};
  return {
    left: 0,
    right: 0,
    display: 'flex',
    position: 'absolute',
    transition: prefersReducedMotion()
        ? undefined
        : `all 230ms cubic-bezier(.21,1.02,.73,1)`,
    transform: `translateY(${offset * (top ? 1 : -1)}px)`,
    ...verticalStyle,
    ...horizontalStyle,
  };
}

</script>

<template>
  <div
      id="_rht_toaster"
      :style="containerStyle"
      @mouseenter="handlers.startPause"
      @mouseleave="handlers.endPause"
  >
    <ToastWrapper
        v-for="t in toasts"
        :key="t.id"
        :id="t.id"
        :class="[t.visible ? activeClass : '']"
        :style="getPositionStyle(t.position || props.position, handlers.calculateOffset(t, {
        reverseOrder: props.reverseOrder,
        gutter: props.gutter,
        defaultPosition: props.position
      }))"
        :onHeightUpdate="handlers.updateHeight"
    >
      <template v-if="t.type === 'custom'">
        <component :is="resolveValue(t.message, t)"/>
      </template>
      <template v-else-if="$slots.default">
        <slot :toast="t"></slot>
      </template>
      <template v-else>
        <ToastBar
            :toast="t"
            :position="t.position || props.position"
        />
      </template>
    </ToastWrapper>
  </div>
</template>

<style>
.z-index-9999 {
  z-index: 9999;
}

.z-index-9999 > * {
  pointer-events: auto;
}
</style>
