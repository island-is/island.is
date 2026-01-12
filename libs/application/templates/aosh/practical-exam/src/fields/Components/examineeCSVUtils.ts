import { examinee } from '../../lib/messages'
import { isValidEmail, isValidPhoneNumber } from '../../utils/validation'
import * as kennitala from 'kennitala'
import { ExamineeInput } from '../../utils/types'
import { MessageDescriptor } from 'react-intl'
import { CSVError } from '../../utils/interfaces'

export type ErrorMessageInvalidInput = {
  invalidSSNs: MessageDescriptor
  invalidEmails: MessageDescriptor
  invalidPhones: MessageDescriptor
}

export type ErrorIndexes = {
  invalidSSNs: Array<number>
  invalidEmails: Array<number>
  invalidPhones: Array<number>
}

export const validateExaminee = (
  parsedExaminee: ExamineeInput,
  index: number,
) => {
  const errors: ErrorIndexes = {
    invalidSSNs: [],
    invalidEmails: [],
    invalidPhones: [],
  }

  const { email, phone } = parsedExaminee
  const nationalId = parsedExaminee.nationalId.nationalId

  if (!kennitala.isValid(nationalId)) errors.invalidSSNs.push(index + 1)
  if (!isValidEmail(email)) errors.invalidEmails.push(index + 1)
  if (!isValidPhoneNumber(phone)) errors.invalidPhones.push(index + 1)

  return errors
}

export const trackDuplicates = (
  seenMap: Map<string, Set<number>>,
  key: string,
  index: number,
  errorArray: number[],
) => {
  if (seenMap.has(key)) {
    seenMap.get(key)?.add(index + 1)
    errorArray.push(index + 1)
  } else {
    seenMap.set(key, new Set([index + 1]))
  }
}

export const processErrors = (
  errorListFromAnswers: CSVError[],
  errors: Record<string, number[]>,
) => {
  const errorMessages: ErrorMessageInvalidInput = {
    invalidSSNs: examinee.tableRepeater.csvInvalidNationalId,
    invalidEmails: examinee.tableRepeater.csvInvalidEmailError,
    invalidPhones: examinee.tableRepeater.csvInvalidPhoneError,
  }

  Object.entries(errors).forEach(([key, value]) => {
    const errorKey = key as keyof ErrorMessageInvalidInput
    if (value.length > 0) {
      errorListFromAnswers.push({
        items: value,
        error: errorMessages[errorKey],
      })
    }
  })
}
