import { validateAnswers } from '@island.is/application/core'
import { FormNode, FormValue } from '@island.is/application/types'
import { FormatMessage } from '@island.is/localization'
import { ResolverError, ResolverResult } from 'react-hook-form'
import { ResolverContext } from '../types'

// Get all field id's from the provided form node
const getFormNodeFieldIds = (formNode: FormNode) =>
  formNode?.children?.filter((x) => x.id).map((x) => x.id as string) ?? []

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
}) => Promise<ResolverResult> | ResolverResult | ResolverError

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
    currentScreenFields: getFormNodeFieldIds(context.formNode),
    formatMessage,
  })

  if (validationError) {
    /**
     * TODO: We cast here, because validationError can be of `SchemaValidationError` type,
     * which doesn't follow the ResolverError type:
     *
     * export declare type FieldError = {
     *   type: LiteralUnion<keyof ValidationRule, string>;
     *   ref?: Ref;
     *   types?: MultipleFieldErrors;
     *   message?: Message;
     * };
     **/
    return {
      values: {},
      errors: validationError,
    } as ResolverError
  }

  return {
    values: formValue,
    errors: {},
  }
}
