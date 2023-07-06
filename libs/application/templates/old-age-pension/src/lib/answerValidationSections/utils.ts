import { buildValidationError } from '@island.is/application/core'
import { StaticText } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'

export const buildError = (message: StaticText, path: string) =>
  buildValidationError(`${path}`)(message)

export type ValidateField<T> = {
  fieldName: string
  validationFn: (value: T) => boolean
  message: MessageDescriptor
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const validateFieldInDictionary = <T extends Object>(
  dictionary: Record<string, T>,
  answerField: string,
  fieldName: string,
  validationFn: (value: T) => boolean,
  message: MessageDescriptor,
) => {
  try {
    const invalidKey = Object.keys(dictionary).find((key) => {
      const currentPeriod = dictionary[key]
      // eslint-disable-next-line no-prototype-builtins
      if (currentPeriod.hasOwnProperty(fieldName)) {
        return validationFn(currentPeriod)
      }
      return false
    })

    if (invalidKey) {
      return buildError(message, `${answerField}[${invalidKey}].${fieldName}`)
    }
  } catch (e) {
    // Ignore
  }
}
