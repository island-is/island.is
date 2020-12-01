import { Case, UpdateCase } from '@island.is/judicial-system/types'
import {
  padTimeWithZero,
  parseString,
  parseTime,
  replaceTabs,
} from './formatters'
import { validate, Validation } from './validate'
import formatISO from 'date-fns/formatISO'

export const RemoveTabsValidateAndSet = (
  field: string,
  evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case | undefined>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  let value: string

  if (evt.target.value.includes('\t')) {
    value = replaceTabs(evt.target.value)
    evt.target.value = value
  } else {
    value = evt.target.value
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

export const validateAndSet = (
  field: string,
  value: string,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case | undefined>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  const isValid = !validations.some(
    (validation) => validate(value, validation).isValid === false,
  )

  if (errorMessage !== '' && setErrorMessage && isValid) {
    setErrorMessage('')
  }

  setCase({
    ...theCase,
    [field]: value,
  })
}

export const validateAndSetTime = (
  field: string,
  currentValue: string | undefined,
  time: string,
  validations: Validation[],
  theCase: Case,
  setCase: (value: React.SetStateAction<Case | undefined>) => void,
  errorMessage?: string,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  if (currentValue) {
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

) => {
export const setAndSendDateToServer = async (
  field: string,
  currentValue: string | undefined,
  date: Date,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case | undefined>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  if (setErrorMessage) {
    setErrorMessage('')
  }

  const currentRepresentation = currentValue?.includes('T')
    ? 'complete'
    : 'date'

  const formattedDate = formatISO(date, {
    representation: currentRepresentation,
  })

  setCase({
    ...theCase,
    [field]: formattedDate,
  })

  if (theCase.id !== '' && currentRepresentation === 'complete') {
    updateCase(theCase.id, parseString(field, formattedDate))
  }
}

export const validateAndSendToServer = async (
  field: string,
  value: string,
  validations: Validation[],
  theCase: Case,
  updateCase: (id: string, updateCase: UpdateCase) => void,
  setErrorMessage?: (value: React.SetStateAction<string>) => void,
) => {
  const error = validations
    .map((v) => validate(value, v))
    .find((v) => v.isValid === false)

  if (error && setErrorMessage) {
    setErrorMessage(error.errorMessage)
    return
  }

  if (theCase.id !== '') {
    await updateCase(theCase.id, parseString(field, value))
  }
}

export const validateAndSendTimeToServer = async (
    field: string,
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
        updateCase(theCase.id, parseString(field, dateMinutes))
      }
    }
  }

export const setAndSendToServer = (
  field: string,
  value: string,
  theCase: Case,
  setCase: (value: React.SetStateAction<Case | undefined>) => void,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  setCase({
    ...theCase,
    [field]: value,
  })

  if (theCase.id !== '') {
    updateCase(theCase.id, parseString(field, value))
  }
}
