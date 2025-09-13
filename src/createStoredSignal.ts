import { createSignal, type Accessor, type Setter } from "solid-js";
import { createDeferedCallback, eatErrors } from "./shared.js";
import { onClient } from "./onClient.js";

/**
 * createSignal with JSON serialising the value to localStorage
 *
 * ```ts
 * const [volume, setVolume] = createStoredSignal("player-volume", 0)
 * ```
 */
export const createStoredSignal = <T>(
    key: string,
    defaultValue: T,
): [state: Accessor<T>, setState: Setter<T>] => {
    let [value, setValue] = createSignal<T>(defaultValue, { name: key });
    onClient(() => {
        eatErrors(() => {
            let storedString = localStorage.getItem(key);
            if (storedString) setValue(JSON.parse(storedString));
        });
    });

    let setter: Setter<T> = (...args) => {
        //@ts-ignore
        let newValue = setValue(...args);
        eatErrors(() => localStorage.setItem(key, JSON.stringify(newValue)));
        return newValue;
    };

    return [value, setter] as const;
};

/**
 * createDeferedStoredSignal with JSON serialising the value to localStorage and ratelimiting for the saving
 *
 * same as createStoredSignal but with ratelimiting
 *
 * ```ts
 * const [volume, setVolume] = createStoredSignal("player-volume", 0)
 * ```
 */
export const createDeferedStoredSignal = <T>(
    key: string,
    defaultValue: T,
    ms: number = 200,
): [state: Accessor<T>, setState: Setter<T>] => {
    let [value, setValue] = createSignal<T>(defaultValue, { name: key });
    onClient(() => {
        eatErrors(() => {
            let storedString = localStorage.getItem(key);
            if (storedString) setValue(JSON.parse(storedString));
        });
    });

    let defered = createDeferedCallback(ms);
    let setter: Setter<T> = (...args) => {
        //@ts-ignore
        let newValue = setValue(...args);
        defered(() => eatErrors(() => localStorage.setItem(key, JSON.stringify(newValue))));
        return newValue;
    };

    return [value, setter] as const;
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
export const createCustomStoredSignal =
    (options: {
        storage?: Storage;
        ratelimit?: number;
        serialise?: (value: any) => string;
        deserialise?: (value: string) => any;
    }): (<T>(key: string, defaultValue: T) => [state: Accessor<T>, setState: Setter<T>]) =>
    <T extends any>(key: string, defaultValue: T) => {
        let serialise = options.serialise ?? JSON.stringify;
        let deserialise = options.deserialise ?? JSON.parse;
        let storage = options.storage ?? localStorage;

        let [value, setValue] = createSignal<T>(defaultValue, { name: key });
        onClient(() => {
            eatErrors(() => {
                let storedString = storage.getItem(key);
                if (storedString) setValue(deserialise(storedString));
            });
        });

        let defered = createDeferedCallback(options.ratelimit);
        let setter: Setter<T> = (...args) => {
            //@ts-ignore
            let newValue = setValue(...args);
            defered(() => eatErrors(() => storage.setItem(key, serialise(newValue))));
            return newValue;
        };

        return [value, setter] as const;
    };
