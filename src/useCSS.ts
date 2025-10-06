import { createEffect, onCleanup, onMount, type Accessor } from "solid-js";

/**
 * Create a stylesheet who's value is backed by a signal
 *
 * @param css The accessor to use for the CSS
 */
export const useCSS = (css: Accessor<string>) => {
    let style: HTMLStyleElement;

    onMount(() => {
        style = document.createElement("style");
        style.innerHTML = css();
        document.head.appendChild(style);
    });

    onCleanup(() => style && style.remove());
    createEffect(() => style && (style.innerHTML = css()));
};
