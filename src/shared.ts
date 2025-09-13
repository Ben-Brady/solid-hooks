export const eatErrors = (callback: () => void) => {
    try {
        callback();
    } catch (e) {
        console.error(e);
    }
};

export const createDeferedCallback = (ms: number | undefined) => {
    let timeout: number | undefined;
    let action: (() => void) | undefined;

    return (callback: () => void) => {
        if (!ms) return callback();
        if (!timeout) {
            timeout = setTimeout(() => {
                action?.();
                timeout = undefined;
            }, ms);
        }
        action = callback;
    };
};
