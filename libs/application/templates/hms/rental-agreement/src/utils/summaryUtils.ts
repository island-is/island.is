import { SelectOption } from './types'

// Utility function to get the label of a select option based on its value
export const getOptionLabel = (
  value: string,
  getOptions: SelectOption[] | (() => SelectOption[]),
): { id: string; defaultMessage: string; description: string } | undefined => {
  if (!value) {
    return undefined
  }
  const options = typeof getOptions === 'function' ? getOptions() : getOptions
  const matchingOption = options.find((option) => option.value === value)
  return matchingOption ? matchingOption.label : undefined
}
