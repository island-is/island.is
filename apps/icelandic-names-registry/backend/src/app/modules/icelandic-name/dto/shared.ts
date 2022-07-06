import { TransformFnParams } from 'class-transformer'

export const transformIcelandicName = ({ value }: TransformFnParams) => {
  if (value && typeof value === 'string') {
    return value.toLowerCase()
  }
}
