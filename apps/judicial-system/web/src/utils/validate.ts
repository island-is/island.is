// TODO: Add tests

export type Validation =
  | 'empty'
  | 'time-format'
  | 'police-casenumber-format'
  | 'national-id'
  | 'email-format'
  | 'phonenumber'
  | 'date-format'

export const validate = (value: string, validation: Validation) => {
  if (!value && validation === 'empty') {
    return { isValid: false, errorMessage: 'Reitur má ekki vera tómur' }
  } else {
    const v = getRegexByValidation(validation)

    const isValid = v.regex.test(value)
    return { isValid, errorMessage: isValid ? '' : v.errorMessage }
  }
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
        regex: new RegExp('^((0[0-9]|1[0-9]|2[0-3])|[0-9]):[0-5][0-9]$'),
        errorMessage: 'Dæmi: 12:34 eða 1:23',
      }
    case 'police-casenumber-format':
      return {
        regex: new RegExp(
          /^[0-9][0-9][0-9]-[0-9][0-9][0-9][0-9]-\d{0,99999}$/g,
        ),
        errorMessage: 'Dæmi: 012-3456-7890',
      }
    case 'national-id':
      return {
        regex: new RegExp(/^\d{6}(-?\d{4})?$/g),
        errorMessage: 'Dæmi: 000000-0000',
      }
    case 'email-format':
      return {
        regex: new RegExp(/^$|^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g),
        errorMessage: 'Netfang ekki á réttu formi',
      }
    case 'phonenumber':
      return {
        regex: new RegExp(/^$|^(\d{3})(-?(\d{4}))$/g),
        errorMessage: 'Dæmi: 555-5555',
      }
    case 'date-format': {
      return {
        regex: new RegExp(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/g),
        errorMessage: '',
      }
    }
  }
}
