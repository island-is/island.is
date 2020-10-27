import { FormValue, validateAnswers } from '@island.is/application/core'
import { Resolver } from 'react-hook-form'
import { ResolverContext } from '../types'

// TODO type this properly
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const resolver: Resolver<FormValue, ResolverContext> = (
  formValue,
  context,
) => {
  if (!context) {
    return {
      values: formValue,
      errors: {},
    }
  }
  const { dataSchema } = context
  const validationError = validateAnswers(dataSchema, formValue, false)
  if (validationError) {
    return { values: {}, errors: validationError }
  }

  return {
    values: formValue,
    errors: {},
  }
}
