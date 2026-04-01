import { resolveFieldId, validateAnswers } from '@island.is/application/core'
import {
  Application,
  Field,
  FormItemTypes,
  FormNode,
  FormValue,
  MultiField,
} from '@island.is/application/types'
import { BffUser } from '@island.is/shared/types'
import { FormatMessage } from '@island.is/localization'
import { ResolverError, ResolverResult } from 'react-hook-form'
import { ResolverContext } from '../types'

const getFormNodeFieldIds = (
  formNode: FormNode,
  application: Application,
  user?: BffUser,
): string[] => {
  if (formNode.type === FormItemTypes.MULTI_FIELD && 'children' in formNode) {
    return (formNode as MultiField).children.map((c) =>
      resolveFieldId(c as Field, application, user),
    )
  }
  if ('component' in formNode && 'id' in formNode) {
    return [resolveFieldId(formNode as Field, application, user)]
  }
  return []
}

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

  const applicationForFields: Application = {
    ...context.application,
    answers: formValue,
  }

  const validationError = validateAnswers({
    dataSchema: context.dataSchema,
    answers: formValue,
    isFullSchemaValidation: false,
    currentScreenFields: getFormNodeFieldIds(
      context.formNode as FormNode,
      applicationForFields,
      context.user,
    ),
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
