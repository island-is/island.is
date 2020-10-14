type FactoryFn<T, FactoryArgs extends Array<any>> = (...args: FactoryArgs) => T

type TimesFn<T, FactoryArgs extends Array<any>> = (
  times: number,
  ...args: FactoryArgs
) => Array<T>

type Times = <T, FactoryArgs extends Array<any>>(
  factory: FactoryFn<T, FactoryArgs>,
) => TimesFn<T, FactoryArgs>

export const times: Times = (factory) => (times, ...args) => {
  const result = []
  for (let i = 0; i < times; i++) {
    result.push(factory(...args))
  }
  return result
}
