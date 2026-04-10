import {
  shouldShowFormItem,
  validateAnswers,
} from '@island.is/application/core'
import {
  AccordionField,
  Application,
  Field,
  FieldTypes,
  FormNode,
  FormValue,
} from '@island.is/application/types'
import { FormatMessage } from '@island.is/localization'
import { ResolverError, ResolverResult } from 'react-hook-form'
import { FieldDef, ResolverContext } from '../types'
import { getAccordionChildFieldIds } from '../utils'

const getFormNodeFieldIds = (
  formNode: FormNode,
  application?: Application,
) => {
  const children = formNode?.children ?? []

  const visibleChildren = children.filter(
    (x) => (x as FieldDef).isNavigable !== false,
  )

  const directIds = visibleChildren
    .filter((x) => x.id)
    .map((x) => x.id as string)

  const nestedIds = visibleChildren
    .filter((x): x is Field => 'type' in x && x.type === FieldTypes.ACCORDION)
    .flatMap((accordion) => {
      if (!application) return getAccordionChildFieldIds(accordion)

      const acc = accordion as AccordionField
      const items =
        typeof acc.accordionItems === 'function' ? [] : acc.accordionItems
      return items.flatMap((item) =>
        item.children
          ? item.children
              .filter((child) =>
                shouldShowFormItem(
                  child,
                  application.answers,
                  application.externalData,
                  null,
                ),
              )
              .map((child) => child.id)
          : [],
      )
    })

  return [...directIds, ...nestedIds]
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

  const validationError = validateAnswers({
    dataSchema: context.dataSchema,
    answers: formValue,
    isFullSchemaValidation: false,
    currentScreenFields: getFormNodeFieldIds(
      context.formNode,
      context.application,
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
