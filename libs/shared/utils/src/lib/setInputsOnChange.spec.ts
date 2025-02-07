import { setInputsOnChange } from './setInputsOnChange'

describe('setInputsOnChange', () => {
  it('should set all specified inputs', () => {
    // Arrange
    const setOnChange = [
      { key: 'field1', value: 'value1' },
      { key: 'field2', value: 'value2' },
      { key: 'field3', value: 'value3' },
    ]
    const setValue = jest.fn()

    // Act
    setInputsOnChange(setOnChange, setValue)

    // Assert
    expect(setValue).toHaveBeenCalledTimes(3)
    expect(setValue).toHaveBeenCalledWith('field1', 'value1')
    expect(setValue).toHaveBeenCalledWith('field2', 'value2')
    expect(setValue).toHaveBeenCalledWith('field3', 'value3')
  })

  it('should handle empty array of fields', () => {
    // Arrange
    const setOnChange: { key: string; value: any }[] = []
    const setValue = jest.fn()

    // Act
    setInputsOnChange(setOnChange, setValue)

    // Assert
    expect(setValue).not.toHaveBeenCalled()
  })
})
