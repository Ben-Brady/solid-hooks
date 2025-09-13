export const eatErrors = (callback: () => void) => {
    try {
        callback();
    } catch (e) {
        console.error(e);
    }
};

export const createDeferedCallback = (ms: number | undefined) => {
    let timeout: number | undefined;
    let action: () => void = voidFunc;

    return (callback: () => void) => {
        if (!ms) return callback();
        if (!timeout) {
            timeout = setTimeout(() => {
                action();
                timeout = undefined;
            }, ms);
        }
        action = callback;
    };
};

export const isClient = typeof window < "u";
export const voidFunc: (...args: any[]) => void = () => {};
