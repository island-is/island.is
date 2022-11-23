/**
 * A discriminator between JavaScript and TypeScript analysis inputs
 *
 * Analyzing JavaScript and TypeScript code is rather transparent and
 * indistinguishable since we use ESLint-based APIs not only to parse
 * but also to analyze source code. However, there are minor parsing
 * details that require a clear distinction between the two.
 */
export declare type Language = 'js' | 'ts';
