import { createEffect, createSignal } from "solid-js";

export const useIsClient = () => {
    let [isClient, setIsClient] = createSignal(false);
    createEffect(() => setIsClient(true));
    return isClient;
};
