export const clearInputsOnChange = (
  clearOnChange: string[],
  setValue: (key: string, value: any) => void,
  defaultValue?:
    | string
    | string[]
    | boolean
    | boolean[]
    | number
    | number[]
    | undefined,
) => {
  clearOnChange.forEach((key) => {
    setValue(key, defaultValue ?? '')
  })
}
