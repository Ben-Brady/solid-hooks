import { createStore, unwrap, type SetStoreFunction, type Store } from "solid-js/store";
import { createDeferedCallback, eatErrors } from "./shared.js";

export function createSavedStore<T extends object = {}>(
    key: string,
    defaultValue: T,
): [store: Store<T>, setStore: SetStoreFunction<T>] {
    let storedValue: T | undefined;
    eatErrors(() => {
        const storedString = localStorage.getItem(key);
        if (storedString) {
            storedValue = JSON.parse(storedString);
        }
    });

    const initial = storedValue ?? defaultValue;
    const [store, setStore] = createStore<T>(initial, { name: key });

    const setter: SetStoreFunction<T> = (...args: any[]) => {
        //@ts-expect-error, no types to avoid recursive type
        setStore(...args);

        eatErrors(() => {
            localStorage.setItem(key, JSON.stringify(unwrap(store)));
        });
    };

    return [store, setter] as const;
}

export function createDeferedSavedStore<T extends object = {}>(
    key: string,
    defaultValue: T,
    ms: number = 200,
): [store: Store<T>, setStore: SetStoreFunction<T>] {
    let storedValue: T | undefined;
    eatErrors(() => {
        const storedString = localStorage.getItem(key);
        if (storedString) {
            storedValue = JSON.parse(storedString);
        }
    });

    const initial = storedValue ?? defaultValue;
    const [store, setStore] = createStore<T>(initial, { name: key });

    const defered = createDeferedCallback(ms);
    const setter: SetStoreFunction<T> = (...args: any[]) => {
        //@ts-expect-error, no types to avoid recursive type
        setStore(...args);

        defered(() => {
            eatErrors(() => {
                localStorage.setItem(key, JSON.stringify(unwrap(store)));
            });
        });
    };

    return [store, setter] as const;
}

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
export const createCustomStoredStore = (options: {
    storage?: Storage;
    ratelimit?: number;
    serialise?: (value: any) => string;
    deserialise?: (value: string) => any;
}): (<T extends object = {}>(
    key: string,
    defaultValue: T,
) => [store: Store<T>, setStore: SetStoreFunction<T>]) => {
    const storage = options.storage ?? localStorage;
    const serialise = options.serialise ?? JSON.stringify;
    const deserialise = options.deserialise ?? JSON.parse;

    return <T extends object = {}>(key: string, defaultValue: T) => {
        let storedValue: T | undefined;

        eatErrors(() => {
            const storedString = storage.getItem(key);
            if (storedString) {
                storedValue = deserialise(storedString);
            }
        });

        const initial = storedValue ?? defaultValue;
        const [store, setStore] = createStore<T>(initial, { name: key });

        const defered = createDeferedCallback(options.ratelimit);
        const setter: SetStoreFunction<T> = (...args: any[]) => {
            //@ts-expect-error, no types to avoid recursive type
            setStore(...args);

            defered(() => {
                eatErrors(() => {
                    storage.setItem(key, serialise(unwrap(store)));
                });
            });
        };
        return [store, setter] as const;
    };
};
