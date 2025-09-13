import { onMount } from "solid-js";

/**
 * if is browser, just run the callback
 *
 * if on server, use `onMount` to only run on client
 *
 * This is designed to prevent unncessary jitter for components rendered on the client
 */
export const onClient = (callback: () => void) => {
    const isClient = typeof window !== "undefined";
    if (isClient) {
        callback();
    } else {
        onMount(callback);
    }
};
