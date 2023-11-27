type FactoryFn<T, FactoryArgs extends Array<unknown>> = (
  args: FactoryArgs,
  index: number,
) => T

type TimesFn<T, FactoryArgs extends Array<unknown>> = (
  times: number,
  ...args: FactoryArgs
) => Array<T>

type Times = <T, FactoryArgs extends Array<unknown>>(
  factory: FactoryFn<T, FactoryArgs>,
) => TimesFn<T, FactoryArgs>

export const times: Times =
  (factory) =>
  (times, ...args) => {
    const result = []
    for (let i = 0; i < times; i++) {
      result.push(factory(args, i))
    }
    return result
  }
