import { batch, createSignal, type Accessor } from "solid-js";
import { useAbortSignal } from "./useAbortSignal.js";
import { onClient } from "./onClient.js";

export const useViewportSize = (): [Accessor<number | undefined>, Accessor<number | undefined>] => {
    let [width, setWidth] = createSignal<number | undefined>();
    let [height, setHeight] = createSignal<number | undefined>();
    let signal = useAbortSignal();

    let update = () =>
        batch(() => {
            setHeight(document.body.clientHeight);
            setWidth(document.body.clientWidth);
        });

    onClient(() => {
        update();
        document.body.addEventListener("resize", update, { signal });
    });

    return [width, height];
};

export const useViewportWidth = (): Accessor<number | undefined> => {
    let [width, setWidth] = createSignal<number | undefined>();
    let signal = useAbortSignal();

    let update = () => setWidth(document.body.clientWidth);

    onClient(() => {
        update();
        document.body.addEventListener("resize", update, { signal });
    });

    return width;
};

export const useViewportHeight = (): Accessor<number | undefined> => {
    let [height, setHeight] = createSignal<number | undefined>();
    let signal = useAbortSignal();

    let update = () => setHeight(document.body.clientHeight);

    onClient(() => {
        update();
        document.body.addEventListener("resize", update, { signal });
    });

    return height;
};
