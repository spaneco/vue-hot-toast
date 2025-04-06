<script setup lang="ts">
import type {Toast, IconTheme} from '../core/types';
import LoaderIcon from "./LoaderIcon.vue";
import ErrorIcon from "./ErrorIcon.vue";
import CheckmarkIcon from "./CheckmarkIcon.vue";

const props = defineProps<{
  toast: Toast
  iconTheme?: IconTheme
}>()

</script>

<template>
  <div class="indicator-wrapper">
    <LoaderIcon v-bind="props.iconTheme"/>
    <div class="status-wrapper" v-if="toast.type !== 'loading'">
      <div class="animated-icon-wrapper">
        <ErrorIcon
            v-if="toast.type === 'error'"
            v-bind="props.iconTheme"
        />
        <CheckmarkIcon
            v-else
            v-bind="props.iconTheme"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-wrapper {
  position: absolute;
}

.indicator-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
}

@keyframes enter {
  from {
    transform: scale(0.6);
    opacity: 0.4;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animated-icon-wrapper {
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: enter 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>