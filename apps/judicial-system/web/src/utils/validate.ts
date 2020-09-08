type Validation = 'empty' | 'time'
export const isValid = (value: string, validation: Validation) => {
  const validationRegex = getRegexByValidation(validation)
  return validationRegex.test(value)
}

export const getRegexByValidation = (validation: Validation) => {
  switch (validation) {
    case 'empty':
      return new RegExp('.')
    case 'time':
      return new RegExp('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')
  }
}
