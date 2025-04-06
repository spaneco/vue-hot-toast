import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import {ActionType} from './types'
import type { State, DefaultToastOptions, Action, ToastType } from './types';

const TOAST_LIMIT = 20;

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case ActionType.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case ActionType.UPSERT_TOAST:
            const { toast } = action;
            return reducer(state, {
                type: state.toasts.find((t) => t.id === toast.id)
                    ? ActionType.UPDATE_TOAST
                    : ActionType.ADD_TOAST,
                toast,
            });

        case ActionType.DISMISS_TOAST:
            const { toastId } = action;

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === toastId || toastId === undefined
                        ? {
                            ...t,
                            dismissed: true,
                            visible: false,
                        }
                        : t
                ),
            };
        case ActionType.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.toastId),
            };

        case ActionType.START_PAUSE:
            return {
                ...state,
                pausedAt: action.time,
            };

        case ActionType.END_PAUSE:
            const diff = action.time - (state.pausedAt || 0);

            return {
                ...state,
                pausedAt: undefined,
                toasts: state.toasts.map((t) => ({
                    ...t,
                    pauseDuration: t.pauseDuration + diff,
                })),
            };
    }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [], pausedAt: undefined };

export const dispatch = (action: Action) => {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener) => {
        listener(memoryState);
    });
};

export const defaultTimeouts: {
    [key in ToastType]: number;
} = {
    blank: 4000,
    error: 4000,
    success: 2000,
    loading: Infinity,
    custom: 4000,
};

export const useStore = (toastOptions: DefaultToastOptions = {}) => {
    const state = reactive<State>({ toasts: [], pausedAt: undefined });
    const initial = ref(memoryState);

    const updateState = (newState: State) => {
        state.toasts = [...newState.toasts];
        state.pausedAt = newState.pausedAt;
    };

    onMounted(() => {
        if (initial.value !== memoryState) {
            updateState(memoryState);
        }
        listeners.push(updateState);
    });

    onUnmounted(() => {
        const index = listeners.indexOf(updateState);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    });

    const mergedToasts = computed(() => state.toasts.map((t) => ({
        ...toastOptions,
        ...toastOptions[t.type],
        ...t,
        removeDelay:
            t.removeDelay ||
            toastOptions[t.type]?.removeDelay ||
            toastOptions?.removeDelay,
        duration:
            t.duration ||
            toastOptions[t.type]?.duration ||
            toastOptions?.duration ||
            defaultTimeouts[t.type],
        style: {
            ...toastOptions.style,
            ...toastOptions[t.type]?.style,
            ...t.style,
        },
    })));

    return {
        toasts: mergedToasts,
        pausedAt: computed(() => state.pausedAt),
    };
};