import { tinyMemoize } from './tinyMemoize'
import result from '../../../../../api/schema/src/lib/schema'

type ResolveFn = (value?: number | PromiseLike<number>) => void

describe('tinyMemoize', () => {
  let resolve: null | ResolveFn = null
  let slowFunction: jest.Mock
  let memoizedFunction: () => Promise<number>

  beforeEach(() => {
    // arrange
    slowFunction = jest.fn(
      () =>
        new Promise<number>((res) => {
          resolve = res
        }),
    )
    memoizedFunction = tinyMemoize(slowFunction)
  })

  it("memoizes calls to an async function while it's running", async () => {
    // arrange
    const value = Math.random()

    // act
    const promise1 = memoizedFunction()
    const promise2 = memoizedFunction()
    resolve!(value)
    const results = await Promise.all([promise1, promise2])

    // assert
    expect(slowFunction).toHaveBeenCalledTimes(1)
    expect(promise1).toBe(promise2)
    expect(results).toStrictEqual([value, value])
  })

  it('stops memoizing as soon as the async function finishes', async () => {
    // arrange
    const value1 = Math.random()
    const value2 = value1 + 0.1

    // act
    const promise1 = memoizedFunction()
    resolve!(value1)
    const result1 = await promise1

    const promise2 = memoizedFunction()
    resolve!(value2)
    const result2 = await promise2

    // assert
    expect(slowFunction).toHaveBeenCalledTimes(2)
    expect(promise1).not.toBe(promise2)
    expect(result1).toEqual(value1)
    expect(result2).toEqual(value2)
  })
})
