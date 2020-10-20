import { simpleFactory } from './simpleFactory'

describe('simpleFactory', () => {
  it('creates objects with a function initializer', () => {
    // Arrange
    const createObj = simpleFactory(() => ({
      title: 'Hello',
      age: 20,
    }))

    // Act
    const obj = createObj()

    // Assert
    expect(obj).toEqual({ title: 'Hello', age: 20 })
  })

  it('creates objects with function initializer arguments', () => {
    // Arrange
    const createObj = simpleFactory((title) => ({
      title: title,
      age: 20,
    }))

    // Act
    const obj = createObj('Title')

    // Assert
    expect(obj).toEqual({ title: 'Title', age: 20 })
  })

  it('creates multiple objects with a function initializer', () => {
    // Arrange
    const createObj = simpleFactory(() => ({
      title: 'Hello',
      age: 20,
    }))

    // Act
    const obj = createObj.list(2)

    // Assert
    expect(obj).toEqual([
      { title: 'Hello', age: 20 },
      { title: 'Hello', age: 20 },
    ])
  })
})
