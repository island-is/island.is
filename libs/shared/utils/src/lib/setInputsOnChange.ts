export const setInputsOnChange = (
  setOnChange: { key: string; value: any }[],
  setValue: (key: string, value: any) => void,
) => {
  setOnChange.forEach(({ key, value }) => {
    setValue(key, value)
  })
}
