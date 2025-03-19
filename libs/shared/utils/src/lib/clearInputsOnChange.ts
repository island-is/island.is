export const clearInputsOnChange = (
  clearOnChange: string[],
  setValue: (key: string, value: any) => void,
) => {
  clearOnChange.forEach((key) => {
    setValue(key, '')
  })
}
