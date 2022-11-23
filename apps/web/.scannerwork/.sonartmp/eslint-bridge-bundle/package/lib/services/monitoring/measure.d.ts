/**
 * Mesures the running time of a function
 * @param f a function to run
 * @returns the returned value of the function and its running time
 */
export declare function measureDuration<T>(f: () => T): {
    result: T;
    duration: number;
};
