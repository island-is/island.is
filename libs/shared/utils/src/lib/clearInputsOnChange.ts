export const clearInputsOnChange = (
  clearOnChange: string[],
  setValue: (key: string, value: any) => void,
  defaultValue?: string | boolean | number | undefined,
) => {
  clearOnChange.forEach((key) => {
    setValue(key, defaultValue ?? '')
  })
}
