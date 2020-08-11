import {
  FormValue,
  areAnswersValid,
  FormNode,
  Schema,
} from '@island.is/application/schema'
import merge from 'lodash/merge'
import { Resolver } from 'react-hook-form'

type Context = { formNode: FormNode; dataSchema: Schema }

function constructError(path: (number | string)[], message: string): object {
  if (path.length === 1) {
    return { [path[0]]: message }
  }
  const [first, ...rest] = path
  return { [first]: constructError(rest, message) }
}

export const resolver: Resolver<FormValue, Context> = async (
  formValue,
  context,
) => {
  const { formNode, dataSchema } = context
  const validationError = areAnswersValid(formValue, formNode, true, dataSchema)
  if (validationError) {
    const { errors } = validationError
    const errorMap = {}
    errors.forEach(({ path, message }) => {
      const [first, ...rest] = path

      errorMap[first] = merge(
        rest?.length ? constructError(rest, message) : message,
        errorMap[first],
      )
    })
    return { values: {}, errors: errorMap }
  }

  return {
    values: formValue,
    errors: {},
  }
}
