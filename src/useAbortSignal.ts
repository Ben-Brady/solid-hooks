import { onCleanup } from "solid-js";

/**
 * Provides an AbortSignal that is aborted on cleanup
 */
export const useAbortSignal = (): AbortSignal => {
    const controller = new AbortController();
    onCleanup(() => controller.abort());
    return controller.signal;
};
