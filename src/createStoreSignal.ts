import { createSignal, type Accessor } from "solid-js";

type AnyNonFunction = Exclude<any, (..._: any) => any>;
type Setter<T extends AnyNonFunction> = (value: T | ((v: T) => T)) => void;

/**
 * createSignal with JSON serialising the value to localStorage
 *
 * ```ts
 * const [volume, setVolume] = createStoredSignal("player-volume", 0)
 * ```
 */
export const createStoredSignal = <T>(key: string, defaultValue: T): [Accessor<T>, Setter<T>] => {
    let storedValue: T | undefined;

    try {
        const storedString = localStorage.getItem(key);
        if (storedString) {
            storedValue = JSON.parse(storedString);
        }
    } catch {
        /* empty */
    }
    const [value, _setValue] = createSignal<T>(storedValue ?? defaultValue, { name: key });

    const setValue: Setter<T> = (newValue) => {
        //@ts-ignore
        const nextValue = typeof newValue === "function" ? newValue(value()) : newValue;
        _setValue(nextValue);
        try {
            localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {}
    };

    return [value, setValue] as const;
};

/**
 * let's you customise createStoredSignal to support using different types of storage and different serialisation methods
 *
 * ```ts
 * const createBigintStoredSignal = createCustomSignalStore({
 *     storage: sessionStorage,
 *     serialise: v => v.toString(),
 *     deserialise: v => BigInt(v)
 * })
 *
 * const [counter, setCounter] = createBigintStoredSignal("counter", 0n)
 * ```
 */
export const createCustomSignalStore = (options: {
    storage?: Storage;
    serialise?: (value: any) => string;
    deserialise?: (value: string) => any;
}): (<T>(key: string, defaultValue: T) => [Accessor<T>, Setter<T>]) => {
    const storage = options.storage ?? localStorage;
    const serialise = options.serialise ?? JSON.stringify;
    const deserialise = options.deserialise ?? JSON.parse;

    return <T extends any>(key: string, defaultValue: T) => {
        let storedValue: T | undefined;

        try {
            const storedString = storage.getItem(key);
            if (storedString) {
                storedValue = deserialise(storedString);
            }
        } catch {
            /* empty */
        }
        const [value, _setValue] = createSignal<T>(storedValue ?? defaultValue, { name: key });

        const setValue: Setter<T> = (newValue) => {
            //@ts-ignore
            const nextValue = typeof newValue === "function" ? newValue(value()) : newValue;
            _setValue(nextValue);
            storage.setItem(key, serialise(nextValue));
        };

        return [value, setValue] as const;
    };
};
