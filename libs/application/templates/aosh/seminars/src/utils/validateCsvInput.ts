import * as kennitala from 'kennitala'
import { isValidEmail } from './isValidEmail'
import { isValidPhoneNumber } from './isValidPhoneNumber'

export const validateSSN = (ssn: Array<string>) => {
  const indexOfErrors = Array<number>()
  ssn.forEach((x, index) => {
    if (!kennitala.isValid(x)) {
      indexOfErrors.push(index)
    }
  })
  return indexOfErrors
}

export const validateEmails = (emails: Array<string>) => {
  const indexOfErrors = Array<number>()
  emails.forEach((x, index) => {
    if (!isValidEmail(x)) {
      indexOfErrors.push(index)
    }
  })
  return indexOfErrors
}

export const validatePhoneNumbers = (numbers: Array<string>) => {
  const indexOfErrors = Array<number>()
  numbers.forEach((x, index) => {
    if (!isValidPhoneNumber(x)) {
      indexOfErrors.push(index)
    }
  })
  return indexOfErrors
}
