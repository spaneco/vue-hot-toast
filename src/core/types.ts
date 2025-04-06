import type { CSSProperties, Component, VNode } from '@vue/runtime-dom'

export interface State {
    toasts: Toast[];
    pausedAt: number | undefined;
}

export enum ActionType {
    ADD_TOAST,
    UPDATE_TOAST,
    UPSERT_TOAST,
    DISMISS_TOAST,
    REMOVE_TOAST,
    START_PAUSE,
    END_PAUSE,
}

export type Action =
    | {
    type: ActionType.ADD_TOAST;
    toast: Toast;
}
    | {
    type: ActionType.UPSERT_TOAST;
    toast: Toast;
}
    | {
    type: ActionType.UPDATE_TOAST;
    toast: Partial<Toast>;
}
    | {
    type: ActionType.DISMISS_TOAST;
    toastId?: string;
}
    | {
    type: ActionType.REMOVE_TOAST;
    toastId?: string;
}
    | {
    type: ActionType.START_PAUSE;
    time: number;
}
    | {
    type: ActionType.END_PAUSE;
    time: number;
};

export type Message = ValueOrFunction<Renderable, Toast>;

export type ToastHandler = (message: Message, options?: ToastOptions) => string;

export type ToastType = 'success' | 'error' | 'loading' | 'blank' | 'custom';
export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
export type Renderable = VNode | Component | string | null;
export interface IconTheme {
    primary: string;
    secondary: string;
}
export type ValueFunction<TValue, TArg> = (arg: TArg) => TValue;
export type ValueOrFunction<TValue, TArg> =
    | TValue
    | ValueFunction<TValue, TArg>;

export const isFunction = <TValue, TArg>(
    valOrFunction: ValueOrFunction<TValue, TArg>
): valOrFunction is ValueFunction<TValue, TArg> =>
    typeof valOrFunction === 'function';

export const resolveValue = <TValue, TArg>(
    valOrFunction: ValueOrFunction<TValue, TArg>,
    arg: TArg
): TValue => (isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction);

export interface Toast {
    type: ToastType;
    id: string;
    message: ValueOrFunction<Renderable, Toast>;
    icon?: Renderable;
    duration?: number;
    pauseDuration: number;
    position?: ToastPosition;
    removeDelay?: number;
    ariaProps: {
        role: 'status' | 'alert';
        'aria-live': 'assertive' | 'off' | 'polite';
    };
    style?: CSSProperties;
    className?: string;
    iconTheme?: IconTheme;
    createdAt: number;
    visible: boolean;
    dismissed: boolean;
    height?: number;
}

export type ToastOptions = Partial<
    Pick<
        Toast,
        | 'id'
        | 'icon'
        | 'duration'
        | 'ariaProps'
        | 'className'
        | 'style'
        | 'position'
        | 'iconTheme'
        | 'removeDelay'
    >
>;

export type DefaultToastOptions = ToastOptions & {
    [key in ToastType]?: ToastOptions;
};

export interface ToasterProps {
    position?: ToastPosition;
    toastOptions?: DefaultToastOptions;
    reverseOrder?: boolean;
    gutter?: number;
    style?: CSSProperties;
    className?: string;
}

export interface ToastWrapperProps {
    id: string;
    className?: string;
    style?: CSSProperties;
    onHeightUpdate: (id: string, height: number) => void;
}

export interface CheckmarkTheme {
    primary?: string;
    secondary?: string;
}

export interface ErrorTheme {
    primary?: string;
    secondary?: string;
}

export interface LoaderTheme {
    primary?: string;
    secondary?: string;
}

export type IconThemes = Partial<{
    success: CheckmarkTheme;
    error: ErrorTheme;
    loading: LoaderTheme;
}>;

export interface ToastBarProps {
    toast: Toast;
    position?: ToastPosition;
    style?: Record<string, any>;
}