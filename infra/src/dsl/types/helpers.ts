/**
 * Makes attribute `K` optional in `T`
 *
 * @example
 * The type `B` is equivalent to the type `C`
 * ```ts
 * type A = {
 *   foo: string
 *   bar: number
 * }
 * type B = Optional<A, 'bar'>
 * type C = {
 *   foo: string
 *   bar?: number
 * }
 * ```
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
