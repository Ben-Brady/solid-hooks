import { createContext, type JSX, useContext } from "solid-js";

export const createContextHook = <
    TReturn,
    TParams extends Record<Exclude<string, "children">, any> = any,
>(
    factory: (args: TParams) => TReturn,
) => {
    const context = createContext<TReturn | undefined>();

    const use = (): TReturn => {
        const value = useContext(context);
        if (!value) throw new Error(`Context did not inherit from Provider`);
        return value;
    };

    const Provider = (props: TParams & { children: JSX.Element }) => {
        const value = factory(props);
        return <context.Provider value={value} children={props.children} />;
    };

    return [use, Provider] as const;
};
