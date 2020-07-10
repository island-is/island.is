import {
  FormValue,
  areAnswersValid,
  FormNode,
  Schema,
} from '@island.is/application/schema'
import { Resolver } from 'react-hook-form'

type Context = { formNode: FormNode; dataSchema: Schema }

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
      errorMap[path.toString()] = { message }
    })
    return { values: {}, errors: errorMap }
  }

  return {
    values: formValue,
    errors: {},
  }
}
