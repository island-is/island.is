import { clearInputsOnChange } from './clearInputsOnChange'

describe('clearInputsOnChange', () => {
  it('should clear all specified inputs by setting them to empty string', () => {
    // Arrange
    const clearOnChange = ['field1', 'field2', 'field3']
    const setValue = jest.fn()

    // Act
    clearInputsOnChange(clearOnChange, setValue)

    // Assert
    expect(setValue).toHaveBeenCalledTimes(3)
    expect(setValue).toHaveBeenCalledWith('field1', '')
    expect(setValue).toHaveBeenCalledWith('field2', '')
    expect(setValue).toHaveBeenCalledWith('field3', '')
  })

  it('should handle empty array of fields', () => {
    // Arrange
    const clearOnChange: string[] = []
    const setValue = jest.fn()

    // Act
    clearInputsOnChange(clearOnChange, setValue)

    // Assert
    expect(setValue).not.toHaveBeenCalled()
  })
})
