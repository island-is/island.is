type SelectOption = {
  label: string
  value: string
}

export function getSelectOptionLabel(options: SelectOption[], id?: string) {
  if (id === undefined) {
    return undefined
  }

  return options.find((option) => option.value === id)?.label
}
