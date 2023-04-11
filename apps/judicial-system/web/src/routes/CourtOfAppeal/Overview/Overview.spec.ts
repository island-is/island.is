import { getStatementDeadline } from './Overview'

describe('getStatementDeadline', () => {
  it('should return the correct deadline', () => {
    // Arrange
    const date = '2020-10-10T00:00:00.000Z'

    // Act
    const deadline = getStatementDeadline(date)

    // Assert
    expect(deadline).toEqual(new Date('2020-10-11T00:00:00.000Z'))
  })

  it('should return undefined if no date is provided', () => {
    // Arrange
    const date = undefined

    // Act
    const deadline = getStatementDeadline(date)

    // Assert
    expect(deadline).toEqual(undefined)
  })

  it('should return undefined if the date is invalid', () => {
    // Arrange
    const date = 'invalid date'

    // Act
    const deadline = getStatementDeadline(date)

    // Assert
    expect(deadline).toEqual(undefined)
  })
})
