import faker from 'faker'
import { factory } from './factory'

interface Obj {
  title: string
  age: number
}

describe('factory', () => {
  it('creates objects', () => {
    // Arrange
    const createObj = factory<Obj>({
      title: 'Hello',
      age: 20,
    })

    // Act
    const obj = createObj()

    // Assert
    expect(obj).toEqual({ title: 'Hello', age: 20 })
  })

  it('creates objects with field initializer', () => {
    // Arrange
    const createObj = factory<Obj>({
      title: 'Hello',
      age: () => faker.datatype.number(),
    })

    // Act
    const obj = createObj()

    // Assert
    expect(obj).toEqual({ title: 'Hello', age: expect.any(Number) })
  })

  it('creates objects with overridden fields', () => {
    // Arrange
    const createObj = factory<Obj>({
      title: 'Hello',
      age: 20,
    })

    // Act
    const obj = createObj({ title: 'Hæ' })

    // Assert
    expect(obj).toEqual({ title: 'Hæ', age: 20 })
  })

  it('creates objects with traits', () => {
    // Arrange
    const createObj = factory<Obj>({
      title: 'Hello',
      age: 20,

      $traits: {
        old: {
          age: 80,
        },
      },
    })

    // Act
    const obj = createObj('old')

    // Assert
    expect(obj).toEqual({ title: 'Hello', age: 80 })
  })

  it('creates objects where last requested trait counts', () => {
    // Arrange
    const createObj = factory<Obj>({
      title: 'Hello',
      age: 20,

      $traits: {
        young: {
          age: 10,
        },
        old: {
          age: 80,
        },
      },
    })

    // Act
    const obj = createObj('old', 'young')

    // Assert
    expect(obj).toEqual({ title: 'Hello', age: 10 })
  })

  it('creates objects where initializers can depend on other values through argument', () => {
    // Arrange
    const createObj = factory<Obj>({
      age: 20,
      title(obj) {
        return `Age: ${obj.age.toString()}`
      },
    })

    // Act
    const obj = createObj()

    // Assert
    expect(obj).toEqual({ title: 'Age: 20', age: 20 })
  })

  it('creates objects where initializers can depend on other values through this', () => {
    // Arrange
    const createObj = factory<Obj>({
      age: 20,
      title() {
        return `Age: ${this.age.toString()}`
      },
    })

    // Act
    const obj = createObj()

    // Assert
    expect(obj).toEqual({ title: 'Age: 20', age: 20 })
  })

  it('creates objects where initializers can depend on overridden values', () => {
    // Arrange
    const createObj = factory<Obj>({
      age: 20,
      title() {
        return `Age: ${this.age.toString()}`
      },
    })

    // Act
    const obj = createObj({ age: 40 })

    // Assert
    expect(obj).toEqual({ title: 'Age: 40', age: 40 })
  })

  it('creates a list of objects', () => {
    // Arrange
    let counter = 0
    const createObj = factory<Obj>({
      title: 'Hello',
      age: () => counter++,
    })

    // Act
    const objects = createObj.list(2)

    // Assert
    expect(objects).toEqual([
      { title: 'Hello', age: 0 },
      { title: 'Hello', age: 1 },
    ])
  })
})
