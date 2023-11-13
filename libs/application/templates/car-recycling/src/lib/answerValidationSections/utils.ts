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
