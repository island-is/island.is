import { buildValidationError } from '@island.is/application/core'
import { StaticText } from '@island.is/application/types'

export const buildError = (message: StaticText, path: string) =>
  buildValidationError(`${path}`)(message)
