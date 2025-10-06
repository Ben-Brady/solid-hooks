import { isClient } from "./shared.js";

/**
 * run code on client, run immmediatly if rendering on the client
 *
 * This is designed to prevent unncessary jitter for components that rely on browser data
 */
// export const onClient = (callback: () => void) =>
//     typeof window !== "undefined" ? callback() : onMount(callback);
export const onClient = (callback: () => void) => isClient && callback();
