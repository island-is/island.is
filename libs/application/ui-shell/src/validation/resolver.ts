import {
  FormatMessage,
  FormValue,
  validateAnswers,
} from '@island.is/application/core'
import { ResolverError, ResolverResult } from 'react-hook-form/dist/types/form'

import { ResolverContext } from '../types'

type Resolver = ({
  formValue,
  context,
  validateAllFieldCriteria,
  formatMessage,
}: {
  formValue: FormValue
  context?: ResolverContext
  validateAllFieldCriteria?: boolean
  formatMessage: FormatMessage
}) => Promise<ResolverResult<FormValue>> | ResolverResult<FormValue>

export const resolver: Resolver = ({ formValue, context, formatMessage }) => {
  if (!context) {
    return {
      values: formValue,
      errors: {},
    }
  }

  const validationError = validateAnswers({
    dataSchema: context.dataSchema,
    answers: formValue,
    isFullSchemaValidation: false,
    formatMessage,
  })

  if (validationError) {
    /**
     * TODO: We cast here, because validationError can be of `SchemaValidationError` type,
     * which doesn't follow the ResolverError type:
     *
     * export declare type FieldError = {
     *   type: LiteralUnion<keyof ValidationRules, string>;
     *   ref?: Ref;
     *   types?: MultipleFieldErrors;
     *   message?: Message;
     * };
     **/
    return ({
      values: {},
      errors: validationError,
    } as unknown) as ResolverError<FormValue>
  }

  return {
    values: formValue,
    errors: {},
  }
}
