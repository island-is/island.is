import { useEffect, useState } from 'react'
import type { Case } from '@island.is/judicial-system/types'
import { parseString, replaceTabs } from './formatters'
import { validate, Validation } from './validate'
import { useCase } from './hooks'

export interface FieldSettings {
  validations?: Validation[]
  errorMessage?: string | undefined
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>
}

export interface FormSettings {
  [key: string]: FieldSettings
}

export const useCaseFormHelper = (
  theCase: Case,
  setCase: (value: React.SetStateAction<Case | undefined>) => void,
  formSettings: FormSettings,
) => {
  const [isValid, setIsValid] = useState(true)
  const { updateCase } = useCase()

  useEffect(() => {
    let valid = true

    for (const fieldName in formSettings) {
      const fieldSettings = formSettings[fieldName]
      const value = (theCase[fieldName as keyof Case] ?? '') as string

      if (
        fieldSettings.validations?.some(
          (v) => validate(value, v).isValid === false,
        )
      ) {
        valid = false
      } else if (fieldSettings.errorMessage && fieldSettings.setErrorMessage) {
        fieldSettings.setErrorMessage('')
      }
    }

    setIsValid(valid)
  }, [theCase, formSettings, setIsValid])

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
    if (element.name in formSettings) {
      const fieldValidation = formSettings[element.name]

      const error = fieldValidation.validations
        ?.map((v) => validate(element.value, v))
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
      [element.name]:
        element.type === 'checkbox' ? element.checked : element.value,
    })

    if (theCase.id !== '') {
      await updateCase(
        theCase.id,
        parseString(
          element.name,
          element.type === 'checkbox' ? element.checked : element.value,
        ),
      )
    }
  }

  return {
    isValid,
    setField,
    validateAndSendToServer,
    setAndSendToServer,
  }
}
