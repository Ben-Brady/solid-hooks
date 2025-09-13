import { onMount } from "solid-js";

export const onClient = (callback: () => void) => {
    const isClient = typeof window !== "undefined";
    if (isClient) {
        callback();
    } else {
        onMount(callback);
    }
};
