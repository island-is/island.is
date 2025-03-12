import * as kennitala from 'kennitala'
import { participants as participantMessages } from '../lib/messages'
import { isValidEmail } from './isValidEmail'
import { isValidPhoneNumber } from './isValidPhoneNumber'
import { MessageDescriptor } from 'react-intl'
/* 
    values[0] = name
    values[1] = ssn
    values[2] = email
    values[3] = phone
*/
export const validateFields = (csvInput: string) => {
  const values = csvInput.split(';')
  const errorStrings: Array<MessageDescriptor> = []
  if (!kennitala.isValid(values[1])) {
    errorStrings.push(participantMessages.labels.csvSsnInputError)
  }
  if (!isValidEmail(values[2])) {
    errorStrings.push(participantMessages.labels.csvEmailInputError)
  }
  if (!isValidPhoneNumber(values[3])) {
    errorStrings.push(participantMessages.labels.csvPhoneNumberInputError)
  }
  return errorStrings
}

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
