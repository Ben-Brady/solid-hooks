import { onMount } from "solid-js";

const isClient = typeof window !== "undefined";
export const onClient = (callback: () => void) => {
    if (isClient) {
        callback();
    } else {
        onMount(callback);
    }
};
