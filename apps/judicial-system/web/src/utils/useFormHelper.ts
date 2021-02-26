import { useEffect, useState } from 'react'
import { Case, UpdateCase } from 'libs/judicial-system/types/src'
import { parseString, replaceTabs } from './formatters'
import { validate, Validation } from './validate'

export interface FieldValidation {
  validations: Validation[]
  errorMessage?: string | undefined
  setErrorMessage?: React.Dispatch<React.SetStateAction<string | undefined>>
}

export interface FormValidation {
  [key: string]: FieldValidation
}

export const useCaseFormHelper = (
  theCase: Case,
  setCase: (value: React.SetStateAction<Case>) => void,
  validations: FormValidation,
  updateCase: (id: string, updateCase: UpdateCase) => void,
) => {
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    let valid = true

    for (const fieldName in validations) {
      const validation = validations[fieldName]
      const value = theCase[fieldName as keyof Case] as string

      if (
        validation.validations.some((v) => validate(value, v).isValid === false)
      ) {
        valid = false
      } else if (validation.errorMessage) {
        validation.setErrorMessage?.(undefined)
      }
    }

    setIsValid(valid)
  }, [theCase, setIsValid])

  const setField = (element: HTMLInputElement | HTMLTextAreaElement) => {
    if (element.value.includes('\t')) {
      element.value = replaceTabs(element.value)
    }

    setCase({
      ...theCase,
      [element.name]: element.value,
    })
  }

  const validateAndSendToServer = async (
    element: HTMLInputElement | HTMLTextAreaElement,
  ) => {
    if (element.name in validations) {
      const fieldValidation = validations[element.name]

      const error = fieldValidation.validations
        .map((v) => validate(element.value, v))
        .find((v) => v.isValid === false)

      if (error && fieldValidation.setErrorMessage) {
        fieldValidation.setErrorMessage(error.errorMessage)
        return
      }
    }

    if (theCase.id !== '') {
      await updateCase(theCase.id, parseString(element.name, element.value))
    }
  }

  const setAndSendToServer = async (element: HTMLInputElement) => {
    setCase({
      ...theCase,
      [element.name]: element.value,
    })

    if (theCase.id !== '') {
      await updateCase(theCase.id, parseString(element.name, element.value))
    }
  }

  return {
    isValid,
    setField,
    validateAndSendToServer,
    setAndSendToServer,
  }
}
