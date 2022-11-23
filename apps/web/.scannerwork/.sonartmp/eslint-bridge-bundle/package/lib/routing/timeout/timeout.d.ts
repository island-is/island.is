/**
 * Wrapper of Node.js timeout.
 *
 * The purpose of this wrapper is to rely on a single reference of Node.js timeout,
 * start the timeout to execute a function at a given delay, and stop it on demand.
 */
export default class Timeout {
    private readonly f;
    private readonly delay;
    private timeout;
    /**
     * Builds a wrapper of Node.js timeout.
     * @param f the function to be executed after the timer expires.
     * @param delay The time in milliseconds that the timer should wait.
     */
    constructor(f: () => void, delay: number);
    /**
     * Starts the timeout.
     */
    start(): void;
    /**
     * Stops the timeout.
     */
    stop(): void;
}
