import formatISO from 'date-fns/formatISO'

import { formatDate } from '@island.is/judicial-system/formatters'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import type { Case, UpdateCase } from '@island.is/judicial-system/types'

import { padTimeWithZero, parseTime, replaceTabs } from './formatters'
import { validate, Validation } from './validate'

export const removeTabsValidateAndSet = (
  field: keyof UpdateCase,
  value: string,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  if (value.includes('\t')) {
    value = replaceTabs(value)
  }

  validateAndSet(
    field,
    value,
    validations,
    theCase,
    setCase,
    errorMessage,
    setErrorMessage,
  )
}

export const removeErrorMessageIfValid = (
  validations: Validation[],
  value: string,
  errorMessage?: string,
  errorMessageSetter?: (value: React.SetStateAction<string>) => void,
) => {
  const isValid = !validations.some(
    (validation) => validate(value, validation).isValid === false,
  )

  if (errorMessage !== '' && errorMessageSetter && isValid) {
    errorMessageSetter('')
  }
}

export const validateAndSetErrorMessage = (
  validations: Validation[],
  value: string,
  errorMessageSetter?: (value: React.SetStateAction<string>) => void,
) => {
  const error = validations
    .map((v) => validate(value, v))
    .find((v) => v.isValid === false)

  if (error && errorMessageSetter) {
    errorMessageSetter(error.errorMessage)
    return
  }
}

export const validateAndSet = (
  field: keyof UpdateCase,
  value: string,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  removeErrorMessageIfValid(validations, value, errorMessage, setErrorMessage)

  setCase({
    ...theCase,
    [field]: value,
  })
}

export const validateAndSetTime = (
  field: keyof UpdateCase,
  currentValue: string | undefined,
  time: string,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
  setTime?: (value: React.SetStateAction<string | undefined>) => void,
) => {
  if (currentValue) {
    // remove optional
    if (setTime) {
      setTime(time)
    }

    const paddedTime = padTimeWithZero(time)

    const isValid = !validations.some(
      (validation) => validate(paddedTime, validation).isValid === false,
    )

    const arrestDateMinutes = parseTime(currentValue, paddedTime)

    if (errorMessage !== '' && setErrorMessage && isValid) {
      setErrorMessage('')
    }

    setCase({
      ...theCase,
      [field]: arrestDateMinutes,
    })
  }
}

export const setAndSendDateToServer = (
  field: keyof UpdateCase,
  date: Date | undefined,
  isValid: boolean,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  if (!isValid) {
    return
  }

  let formattedDate = null

  if (date !== undefined) {
    formattedDate = formatISO(date, {
      representation: 'complete',
    })
  }

  setCase({
    ...theCase,
    [field]: formattedDate,
  })

  if (theCase.id !== '') {
    updateCase(theCase.id, {
      [field]: formattedDate,
    })
  }
}

export const validateAndSendToServer = (
  field: keyof UpdateCase,
  value: string,
  validations: Validation[],
  theCase: Case,
  updateCase: (id: string, updateCase: UpdateCase) => void,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  validateAndSetErrorMessage(validations, value, setErrorMessage)

  if (theCase.id !== '') {
    updateCase(theCase.id, { [field]: value })
  }
}

export const validateAndSendTimeToServer = (
  field: keyof UpdateCase,
  currentValue: string | undefined,
  time: string,
  validations: Validation[],
  theCase: Case,
  updateCase: (id: string, updateCase: UpdateCase) => void,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  if (currentValue) {
    const paddedTime = padTimeWithZero(time)

    const error = validations
      .map((v) => validate(paddedTime, v))
      .find((v) => v.isValid === false)

    if (error && setErrorMessage) {
      setErrorMessage(error.errorMessage)
      return
    }

    const dateMinutes = parseTime(currentValue, paddedTime)

    if (theCase.id !== '') {
      updateCase(theCase.id, { [field]: dateMinutes })
    }
  }
}

export const setAndSendToServer = (
  field: keyof UpdateCase,
  value: string | boolean | undefined,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  const newCase = { ...theCase, [field]: value }
  setCase(newCase)

  if (theCase.id !== '') {
    if (typeof value === 'string' || typeof value === 'boolean') {
      updateCase(theCase.id, { [field]: value })
      return newCase
    } else {
      updateCase(newCase.id, { [field]: null })
      return newCase
    }
  }
}

/**If entry is included in values then it is removed
 * otherwise it is appended
 */
export function toggleInArray<T>(values: T[] | undefined, entry: T) {
  if (!values) return undefined

  return values.includes(entry)
    ? values.filter((x) => x !== entry)
    : [...values, entry]
}

export const setCheckboxAndSendToServer = (
  field: keyof UpdateCase,
  value: string,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  const checks = theCase[field as keyof Case]
    ? [...(theCase[field as keyof Case] as [])]
    : ([] as string[])

  if (!checks.includes(value)) {
    checks.push(value)
  } else {
    checks.splice(checks.indexOf(value), 1)
  }

  setCase({
    ...theCase,
    [field]: checks,
  })

  if (theCase.id !== '') {
    updateCase(theCase.id, { [field]: checks })
  }
}

export const getTimeFromDate = (date: string | undefined) => {
  return date?.includes('T') ? formatDate(date, TIME_FORMAT) : undefined
}
