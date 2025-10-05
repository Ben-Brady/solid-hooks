import { batch, createSignal, onCleanup, type Accessor } from "solid-js";
import { onClient } from "./onClient.js";

export const useElementSize = (
    element: Element,
): [Accessor<number | undefined>, Accessor<number | undefined>] => {
    let [width, setWidth] = createSignal<number | undefined>();
    let [height, setHeight] = createSignal<number | undefined>();

    const update = () =>
        batch(() => (setHeight(element.clientHeight), setWidth(element.clientWidth)));

    onClient(() => {
        let observer = new ResizeObserver(update);
        update();
        observer.observe(document.body);
        onCleanup(() => observer.disconnect());
    });

    return [width, height];
};

export const useViewportSize = (): [Accessor<number | undefined>, Accessor<number | undefined>] => {
    return useElementSize(globalThis?.document?.body);
};
