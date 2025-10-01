import { batch, createSignal, onCleanup, type Accessor } from "solid-js";
import { onClient } from "./onClient.js";

export const useViewportSize = (): [Accessor<number | undefined>, Accessor<number | undefined>] => {
    let [width, setWidth] = createSignal<number | undefined>();
    let [height, setHeight] = createSignal<number | undefined>();

    useSizeChange(() =>
        batch(() => (setHeight(document.body.clientHeight), setWidth(document.body.clientWidth))),
    );

    return [width, height];
};

export const useViewportWidth = (): Accessor<number | undefined> => {
    let [width, setWidth] = createSignal<number | undefined>();
    useSizeChange(() => setWidth(document.body.clientWidth));
    return width;
};

export const useViewportHeight = (): Accessor<number | undefined> => {
    let [height, setHeight] = createSignal<number | undefined>();
    useSizeChange(() => setHeight(document.body.clientHeight));
    return height;
};

const useSizeChange = (callback: () => void) => {
    let observer = new ResizeObserver(callback);
    onClient(() => {
        callback();
        observer.observe(document.body);
    });
    onCleanup(() => observer.disconnect());
};
