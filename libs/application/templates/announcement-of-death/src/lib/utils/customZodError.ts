import { MessageDescriptor } from 'react-intl'
import { ZodTypeAny } from 'zod'

export const customZodError = (
  zodValidation: ZodTypeAny,
  errorMessage: MessageDescriptor,
): ZodTypeAny => {
  if (zodValidation._def.checks) {
    for (const check of zodValidation._def.checks) {
      check['params'] = errorMessage
      check['code'] = 'custom_error'
    }
  }
  return zodValidation
}

/* Examples for attrinbutes in dataschema
    import { m } from './messages'
    ...
    
    //Singular
    name: customZodError(z.string().nonempty(), m.errorName)

    ...

    //Multiple
    email: z.intersection(
        customZodError(z.string().nonempty(), m.errorEmailEmpty),
        customZodError(z.string().max(25), m.errorEmailTooLong),
    )
*/
