import { FormValue, validateAnswers } from '@island.is/application/template'
import merge from 'lodash/merge'
import { Resolver } from 'react-hook-form'
import { ResolverContext } from '../types'

interface Error {
  [key: string]: string | Error
}

function constructError(path: (number | string)[], message: string): Error {
  if (path.length === 1) {
    return { [path[0]]: message }
  }
  const [first, ...rest] = path
  return { [first]: constructError(rest, message) }
}

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
  const validationError = validateAnswers(formValue, true, dataSchema)
  if (validationError) {
    const { errors } = validationError
    const errorMap: Record<string, Error> = {}
    errors.forEach(({ path, message }) => {
      const [first, ...rest] = path

      errorMap[first] = merge(
        rest?.length ? constructError(rest, message) : message,
        errorMap[first],
      ) as Error
    })
    return { values: {}, errors: errorMap }
  }

  return {
    values: formValue,
    errors: {},
  }
}
