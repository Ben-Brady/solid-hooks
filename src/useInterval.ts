import { onCleanup } from "solid-js";

/**
 * setInterval with cleanup
 *
 * ```ts
 * useInterval(1000, () => {
 *     setTime(Date.now())
 * })
 * ```
 */
export const useInterval = (ms: number, callback: () => void): number => {
    let timer = setInterval(callback, ms);
    onCleanup(() => clearInterval(timer));
    return timer;
};

/**
 * setInterval with cleanup, and also a deltaTime
 *
 * ```ts
 * useInterval(50, (delta) => {
 *     setX(v => v + (velocity.x * delta))
 *     setY(v => v + (velocity.y * delta))
 * })
 * ```
 */
export const useDeltaInterval = (ms: number, callback: (deltaTime: number) => void): number => {
    let lastFrame = Date.now();
    return useDeltaInterval(ms, () => {
        let timestamp = Date.now();
        callback((timestamp - lastFrame) / 1000);
        lastFrame = timestamp;
    });
};

/**
 * A `requestAnimationFrame` wrapper with an API similar to useInterval
 *
 * ```ts
 * useFrameInterval(() => {
 *     const newFrame = renderFrame()
 *     setFrame(newFrame)
 * })
 * ```
 */
export const useFrameInterval = (callback: (timestamp: number) => void): number => {
    let frameId: number;
    const tick = (timestamp: number) => {
        callback(timestamp);
        frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    onCleanup(() => cancelAnimationFrame(frameId));
    return frameId;
};

/**
 * A `requestAnimationFrame` wrapper with an API similar to useInterval
 *
 * ```ts
 * useDeltaFrameInterval((delta) => {
 *     setX(v => v + (velocity.x * delta))
 *     setY(v => v + (velocity.y * delta))
 * })
 * ```
 */
export const useDeltaFrameInterval = (
    callback: (deltaTime: number, timestamp: number) => void,
): number => {
    let lastTimestamp = performance.now();
    return useFrameInterval((timestamp) => {
        let deltaTime = (timestamp - lastTimestamp) / 1000;
        callback(deltaTime, timestamp);
        lastTimestamp = timestamp;
    });
};
