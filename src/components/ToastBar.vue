<script setup lang="ts">
import {computed} from 'vue';
import ToastIcon from './ToastIcon.vue';
import {prefersReducedMotion} from '../core/utils';
import type {
  ToastPosition,
  ToastBarProps
} from '../core/types';
import {
  resolveValue,
} from '../core/types';

const props = defineProps<ToastBarProps>();

const $slots = defineSlots();

const enterAnimation = (factor: number): string => `
  0% {transform: translate3d(0,${factor * -200}%,0) scale(.6); opacity:.5;}
  100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`;

const exitAnimation = (factor: number): string => `
  0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
  100% {transform: translate3d(0,${factor * -150}%,-1px) scale(.6); opacity:0;}
`;

const fadeInAnimation = `0%{opacity:0;} 100%{opacity:1;}`;
const fadeOutAnimation = `0%{opacity:1;} 100%{opacity:0;}`;

const getAnimationStyle = (position: ToastPosition, visible: boolean): Record<string, any> => {
  const top = position.includes('top');
  const factor = top ? 1 : -1;

  const [enter, exit] = prefersReducedMotion()
      ? [fadeInAnimation, fadeOutAnimation]
      : [enterAnimation(factor), exitAnimation(factor)];

  return {
    animation: visible
        ? `${enter} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`
        : `${exit} 0.4s forwards cubic-bezier(.06,.71,.55,1)`,
  };
};

const animationStyle = computed((): Record<string, any> => {
  if (!props.toast.height) {
    return {opacity: 0};
  }

  return getAnimationStyle(
      props.toast.position || props.position || 'top-center',
      props.toast.visible
  );
});
</script>

<template>
  <div
      class="toast-bar-base"
      :class="toast.className"
      :style="{ ...animationStyle, ...style, ...toast.style }"
  >
    <template v-if="typeof $slots.default === 'function'">
      <slot
          :icon="{ component: ToastIcon, props: { toast } }"
          :message="{ content: resolveValue(toast.message, toast), props: toast.ariaProps }"
      ></slot>
    </template>
    <template v-else>
      <ToastIcon :toast="toast" />
      <div class="message" v-bind="toast.ariaProps">
        {{ resolveValue(toast.message, toast) }}
      </div>
    </template>
  </div>
</template>

<style>
.toast-bar-base {
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
}

.message {
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
}

@keyframes enter-top {
  0% {
    transform: translate3d(0, -200%, 0) scale(.6);
    opacity: .5;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}

@keyframes enter-bottom {
  0% {
    transform: translate3d(0, 200%, 0) scale(.6);
    opacity: .5;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}

@keyframes exit-top {
  0% {
    transform: translate3d(0, 0, -1px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -150%, -1px) scale(.6);
    opacity: 0;
  }
}

@keyframes exit-bottom {
  0% {
    transform: translate3d(0, 0, -1px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 150%, -1px) scale(.6);
    opacity: 0;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
