export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    callback: T,
    wait: number,
    immediate?: boolean
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | undefined;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        const later = () => {
            timeout = undefined;
            if (!immediate) callback.apply(this, args);
        };

        const callNow = immediate && timeout === undefined;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) callback.apply(this, args);
    };
}
