// TODO: Add tests

type Validation = 'empty' | 'time-format'
export const validate = (value: string, validation: Validation) => {
  const v = getRegexByValidation(validation)
  const isValid = v.regex.test(value)
  return { isValid, errorMessage: isValid ? '' : v.errorMessage }
}

export const getRegexByValidation = (validation: Validation) => {
  switch (validation) {
    case 'empty':
      return {
        regex: new RegExp('.'),
        errorMessage: 'Reitur má ekki vera tómur',
      }
    case 'time-format':
      return {
        regex: new RegExp('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),
        errorMessage: 'Ekki á réttu formi',
      }
  }
}
