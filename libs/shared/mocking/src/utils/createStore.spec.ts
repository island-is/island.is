import { createStore } from './createStore'

describe('createStore', () => {
  it('wraps returned object', () => {
    // Arrange
    const store = createStore(() => ({
      hello: 'world',
    }))

    // Assert
    expect(store).toHaveProperty('hello')
    expect(store.hello).toEqual('world')
  })

  it('only runs initializer on first access', () => {
    // Arrange
    const spy = jest.fn(() => ({ hello: 'world' }))
    const store = createStore(spy)
    expect(spy).not.toHaveBeenCalled()

    // Act
    expect(store.hello).toBeDefined()

    // Assert
    expect(spy).toHaveBeenCalled()
  })

  it('returns mutable objects', () => {
    // Arrange
    const store = createStore<{ arr: number[]; data?: string }>(() => ({
      arr: [2],
    }))

    // Act
    store.data = 'Hello'
    store.arr.push(5)

    // Assert
    expect(store.data).toEqual('Hello')
    expect(store.arr).toEqual([2, 5])
  })

  it('stores can be reset', () => {
    // Arrange
    const store = createStore<{ arr: number[]; data?: string }>(() => ({
      arr: [2],
    }))
    store.data = 'Hello'
    store.arr.push(5)

    // Act
    store.$reset()

    // Assert
    expect(store.data).toEqual(undefined)
    expect(store.arr).toEqual([2])
  })

  it('does not run initializer on accessing store api', () => {
    // Arrange
    const spy = jest.fn(() => ({ hello: 'world' }))
    const store = createStore(spy)

    // Act
    expect(store.$current).toBe(null)
    store.$reset()

    // Assert
    expect(spy).not.toHaveBeenCalled()
  })
})
