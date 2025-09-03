import { createEffect, createSignal } from "solid-js";

export const useIsClient = () => {
    const [isClient, setIsClient] = createSignal(false);
    createEffect(() => setIsClient(true));
    return isClient;
};
