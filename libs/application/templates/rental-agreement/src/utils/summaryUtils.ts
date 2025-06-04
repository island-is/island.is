import { SelectOption } from './types'

// Utility function to get the label of a select option based on its value
export const getOptionLabel = (
  value: string,
  getOptions: () => SelectOption[],
  defaultValue: '',
): string => {
  if (!value) {
    return defaultValue
  }
  const options = getOptions()
  const matchingOption = options.find((option) => option.value === value)
  return matchingOption ? matchingOption.label.defaultMessage : defaultValue
}
