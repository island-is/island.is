// TODO: Add tests

type Validation =
  | 'empty'
  | 'time-format'
  | 'police-casenumber-format'
  | 'national-id'

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
    case 'police-casenumber-format':
      return {
        regex: new RegExp(
          /^[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-\d{0,99999}$/g,
        ),
        errorMessage: 'Ekki á réttu formi',
      }
    case 'national-id':
      return {
        regex: new RegExp(
          /^(0[0-9]|1[0-9]|2[0-9]|3[0-1])(0[0-9]|1[0-2])(\d{2})-?(\d{3})(0|9)$/g,
        ),
        errorMessage: 'Ekki á réttu formi',
      }
  }
}
