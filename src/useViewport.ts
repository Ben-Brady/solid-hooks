import { batch, createEffect, createSignal, type Accessor } from "solid-js";
import { useAbortSignal } from "./useAbortSignal";

export const useViewportSize = (): {
    width: Accessor<number | undefined>;
    height: Accessor<number | undefined>;
} => {
    const [width, setWidth] = createSignal<number | undefined>();
    const [height, setHeight] = createSignal<number | undefined>();
    const signal = useAbortSignal();

    const update = () =>
        batch(() => {
            setHeight(document.body.clientHeight);
            setWidth(document.body.clientWidth);
        });

    createEffect(update);
    document.body.addEventListener("resize", update, { signal });

    return { width, height };
};
