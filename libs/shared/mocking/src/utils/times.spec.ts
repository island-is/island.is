import { times } from './times'

describe('times', () => {
  it('runs handler multiple times and returns an array of return values', () => {
    // Arrange
    let counter = 0
    const timesFn = times(() => counter++)

    // Act
    const result = timesFn(3)

    // Assert
    expect(result).toEqual([0, 1, 2])
  })

  it('passes arguments to handler', () => {
    // Arrange
    const timesFn = times(([name]: string[]) => name)

    // Act
    const result = timesFn(2, 'Hi')

    // Assert
    expect(result).toEqual(['Hi', 'Hi'])
  })
})
