import { batch, createSignal, type Accessor } from "solid-js";
import { useAbortSignal } from "./useAbortSignal.js";
import { onClient } from "./onClient.js";

export const useViewportSize = (): [Accessor<number | undefined>, Accessor<number | undefined>] => {
    const [width, setWidth] = createSignal<number | undefined>();
    const [height, setHeight] = createSignal<number | undefined>();
    const signal = useAbortSignal();

    const update = () =>
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
    const [width, setWidth] = createSignal<number | undefined>();
    const signal = useAbortSignal();

    const update = () => setWidth(document.body.clientWidth);

    onClient(() => {
        update();
        document.body.addEventListener("resize", update, { signal });
    });

    return width;
};

export const useViewportHeight = (): Accessor<number | undefined> => {
    const [height, setHeight] = createSignal<number | undefined>();
    const signal = useAbortSignal();

    const update = () => setHeight(document.body.clientHeight);

    onClient(() => {
        update();
        document.body.addEventListener("resize", update, { signal });
    });

    return height;
};
