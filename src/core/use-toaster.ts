import {watch} from 'vue';
import {dispatch, useStore} from './store';
import {toast} from './toast';
import {ActionType} from './types'
import type {DefaultToastOptions, Toast, ToastPosition} from './types';

const updateHeight = (toastId: string, height: number) => {
    dispatch({
        type: ActionType.UPDATE_TOAST,
        toast: {id: toastId, height},
    });
};
const startPause = () => {
    dispatch({
        type: ActionType.START_PAUSE,
        time: Date.now(),
    });
};

const toastTimeouts = new Map<Toast['id'], ReturnType<typeof setTimeout>>();

export const REMOVE_DELAY = 1000;

const addToRemoveQueue = (toastId: string, removeDelay = REMOVE_DELAY) => {
    if (toastTimeouts.has(toastId)) {
        return;
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: ActionType.REMOVE_TOAST,
            toastId: toastId,
        });
    }, removeDelay);

    toastTimeouts.set(toastId, timeout);
};


export function useToaster(toastOptions?: DefaultToastOptions) {
    const {toasts, pausedAt} = useStore(toastOptions);
    let timeouts: (ReturnType<typeof setTimeout> | undefined)[] = [];

    watch([toasts, pausedAt], () => {
        timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
        timeouts = [];

        if (pausedAt.value) {
            return;
        }

        const now = Date.now();
        timeouts = toasts.value.map((t) => {
            if (t.duration === Infinity) {
                return;
            }

            const durationLeft =
                (t.duration || 0) + t.pauseDuration - (now - t.createdAt);

            if (durationLeft < 0) {
                if (t.visible) {
                    toast.dismiss(t.id);
                }
                return;
            }
            return setTimeout(() => toast.dismiss(t.id), durationLeft);
        });
    });

    const endPause = () => {
        if (pausedAt.value) {
            dispatch({type: ActionType.END_PAUSE, time: Date.now()});
        }
    };

    const calculateOffset = (
        toast: Toast,
        opts?: {
            reverseOrder?: boolean;
            gutter?: number;
            defaultPosition?: ToastPosition;
        }
    ) => {
        const {reverseOrder = false, gutter = 8, defaultPosition} = opts || {};

        const relevantToasts = toasts.value.filter(
            (t) =>
                (t.position || defaultPosition) ===
                (toast.position || defaultPosition) && t.height
        );
        const toastIndex = relevantToasts.findIndex((t) => t.id === toast.id);
        const toastsBefore = relevantToasts.filter(
            (toast, i) => i < toastIndex && toast.visible
        ).length;

        const offset = relevantToasts
            .filter((t) => t.visible)
            .slice(...(reverseOrder ? [toastsBefore + 1] : [0, toastsBefore]))
            .reduce((acc, t) => acc + (t.height || 0) + gutter, 0);

        return offset;
    };

    watch(toasts, () => {
        toasts.value.forEach((toast) => {
            if (toast.dismissed) {
                addToRemoveQueue(toast.id, toast.removeDelay);
            } else {
                // If toast becomes visible again, remove it from the queue
                const timeout = toastTimeouts.get(toast.id);
                if (timeout) {
                    clearTimeout(timeout);
                    toastTimeouts.delete(toast.id);
                }
            }
        });
    });

    return {
        toasts,
        handlers: {
            updateHeight,
            startPause,
            endPause,
            calculateOffset,
        },
    };
}