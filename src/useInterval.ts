import { onCleanup } from "solid-js";
import { onClient } from "./onClient.js";

/**
 * setInterval with cleanup
 *
 * ```ts
 * useInterval(1000, () => {
 *     setTime(Date.now())
 * })
 * ```
 */
export const useInterval = (ms: number, callback: () => void) => {
    let timer: number | undefined;
    onClient(() => {
        timer = setInterval(callback, ms);
        onCleanup(() => clearInterval(timer));
    });
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
export const useDeltaInterval = (ms: number, callback: (deltaTime: number) => void) => {
    let lastFrame = Date.now();
    useDeltaInterval(ms, () => {
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
export const useFrameInterval = (callback: (timestamp: number) => void) => {
    let frameId: number;
    const tick = (timestamp: number) => {
        callback(timestamp);
        frameId = requestAnimationFrame(tick);
    };
    onClient(() => {
        frameId = requestAnimationFrame(tick);
        onCleanup(() => cancelAnimationFrame(frameId));
    });
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
export const useDeltaFrameInterval = (callback: (deltaTime: number, timestamp: number) => void) => {
    let lastTimestamp = performance.now();
    useFrameInterval((timestamp) => {
        let deltaTime = (timestamp - lastTimestamp) / 1000;
        callback(deltaTime, timestamp);
        lastTimestamp = timestamp;
    });
};
