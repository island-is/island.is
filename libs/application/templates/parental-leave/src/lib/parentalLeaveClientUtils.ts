type SelectOption = {
  label: string
  value: string
}

export const getSelectOptionLabel = (options: SelectOption[], id?: string) => {
  if (id === undefined) {
    return undefined
  }

  return options.find((option) => option.value === id)?.label
}
