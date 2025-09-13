import { createStore, unwrap, type SetStoreFunction, type Store } from "solid-js/store";
import { createDeferedCallback, eatErrors, isClient } from "./shared.js";
import { onClient } from "./onClient.js";

export const createSavedStore = <T extends object = {}>(
    key: string,
    defaultValue: T,
): [store: Store<T>, setStore: SetStoreFunction<T>] => {
    let [store, setStore] = createStore<T>(defaultValue, { name: key });
    onClient(() => {
        eatErrors(() => {
            let storedString = localStorage.getItem(key);
            if (storedString) setStore(JSON.parse(storedString));
        });
    });

    let setter: SetStoreFunction<T> = (...args: any[]) => {
        //@ts-expect-error, no types to avoid recursive type
        setStore(...args);

        eatErrors(() => {
            if (isClient) localStorage.setItem(key, JSON.stringify(unwrap(store)));
        });
    };

    return [store, setter] as const;
};

export const createDeferedSavedStore = <T extends object = {}>(
    key: string,
    defaultValue: T,
    ms: number = 200,
): [store: Store<T>, setStore: SetStoreFunction<T>] => {
    let [store, setStore] = createStore<T>(defaultValue, { name: key });
    onClient(() => {
        eatErrors(() => {
            let storedString = localStorage.getItem(key);
            if (storedString) setStore(JSON.parse(storedString));
        });
    });

    let defered = createDeferedCallback(ms);
    let setter: SetStoreFunction<T> = (...args: any[]) => {
        //@ts-expect-error, no types to avoid recursive type
        setStore(...args);

        defered(() => {
            eatErrors(() => {
                if (isClient) localStorage.setItem(key, JSON.stringify(unwrap(store)));
            });
        });
    };

    return [store, setter] as const;
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
export const createCustomSavedStore =
    (options: {
        storage?: Storage;
        ratelimit?: number;
        serialise?: (value: any) => string;
        deserialise?: (value: string) => any;
    }): (<T extends object = {}>(
        key: string,
        defaultValue: T,
    ) => [store: Store<T>, setStore: SetStoreFunction<T>]) =>
    <T extends object = {}>(key: string, defaultValue: T) => {
        let serialise = options.serialise ?? JSON.stringify;
        let deserialise = options.deserialise ?? JSON.parse;
        let storage = options.storage ?? localStorage;

        let [store, setStore] = createStore<T>(defaultValue, { name: key });
        onClient(() => {
            eatErrors(() => {
                let storedString = storage.getItem(key);
                if (storedString) setStore(deserialise(storedString));
            });
        });

        let defered = createDeferedCallback(options.ratelimit);
        let setter: SetStoreFunction<T> = (...args: any[]) => {
            //@ts-expect-error, no types to avoid recursive type
            setStore(...args);

            defered(() => {
                eatErrors(() => {
                    if (isClient) storage.setItem(key, serialise(unwrap(store)));
                });
            });
        };

        return [store, setter] as const;
    };
