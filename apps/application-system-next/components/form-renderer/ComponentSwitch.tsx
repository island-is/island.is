import React, { useCallback } from 'react'
import type { ComponentSwitchProps, FieldRendererProps } from './types'
import { useFormExpressionEvaluator } from '../../hooks/useFormExpressionEvaluator'
import { SdfAccordionField } from './fields/SdfAccordionField'
import { SdfAlertMessageField } from './fields/SdfAlertMessageField'
import { SdfBankAccountField } from './fields/SdfBankAccountField'
import { SdfCheckboxField } from './fields/SdfCheckboxField'
import { SdfCopyLinkField } from './fields/SdfCopyLinkField'
import { SdfCustomComponent } from './fields/SdfCustomComponent'
import { SdfDataTableField } from './fields/SdfDataTableField'
import { SdfDateField } from './fields/SdfDateField'
import { SdfDescriptionField } from './fields/SdfDescriptionField'
import { SdfDisplayField } from './fields/SdfDisplayField'
import { SdfDividerField } from './fields/SdfDividerField'
import { SdfExpandableDescriptionField } from './fields/SdfExpandableDescriptionField'
import { SdfExternalDataProviderField } from './fields/SdfExternalDataProviderField'
import { SdfFileUploadField } from './fields/SdfFileUploadField'
import { SdfHiddenInputField } from './fields/SdfHiddenInputField'
import { SdfHiddenInputWithWatchedValueField } from './fields/SdfHiddenInputWithWatchedValueField'
import { SdfImageField } from './fields/SdfImageField'
import { SdfInformationCardField } from './fields/SdfInformationCardField'
import { SdfKeyValueField } from './fields/SdfKeyValueField'
import { SdfLinkField } from './fields/SdfLinkField'
import { SdfMessageWithLinkButtonField } from './fields/SdfMessageWithLinkButtonField'
import { SdfNationalIdField } from './fields/SdfNationalIdField'
import { SdfPaymentChargeOverviewField } from './fields/SdfPaymentChargeOverviewField'
import { SdfPdfLinkButtonField } from './fields/SdfPdfLinkButtonField'
import { SdfPhoneField } from './fields/SdfPhoneField'
import { SdfRadioField } from './fields/SdfRadioField'
import { SdfRepeaterComponent } from './fields/SdfRepeaterComponent'
import { SdfSearchField } from './fields/SdfSearchField'
import { SdfSelectField } from './fields/SdfSelectField'
import { SdfSliderField } from './fields/SdfSliderField'
import { SdfStaticTableField } from './fields/SdfStaticTableField'
import { SdfSubmitField } from './fields/SdfSubmitField'
import { SdfTextField } from './fields/SdfTextField'
import { SdfUnsupportedField } from './fields/SdfUnsupportedField'

const fieldRenderers: Record<string, React.ComponentType<FieldRendererProps>> = {
  SdfAccordionField,
  SdfAlertMessageField,
  SdfBankAccountField,
  SdfCheckboxField,
  SdfCopyLinkField,
  SdfCustomComponent,
  SdfDataTableField,
  SdfDateField,
  SdfDescriptionField,
  SdfDisplayField,
  SdfDividerField,
  SdfExpandableDescriptionField,
  SdfExternalDataProviderField,
  SdfFileUploadField,
  SdfHiddenInputField,
  SdfHiddenInputWithWatchedValueField,
  SdfImageField,
  SdfInformationCardField,
  SdfKeyValueField,
  SdfLinkField,
  SdfMessageWithLinkButtonField,
  SdfNationalIdField,
  SdfPaymentChargeOverviewField,
  SdfPdfLinkButtonField,
  SdfPhoneField,
  SdfRadioField,
  SdfRepeaterComponent,
  SdfSearchField,
  SdfSelectField,
  SdfSliderField,
  SdfStaticTableField,
  SdfSubmitField,
  SdfTextField,
}

const unsupportedFieldTypes = new Set([
  'SdfRedirectToServicePortalField',
  'SdfPaymentPendingField',
  'SdfTitleField',
  'SdfPaginatedSearchableTableField',
  'SdfNationalIdWithNameField',
  'SdfFieldsRepeaterField',
  'SdfOverviewField',
  'SdfVehiclePermnoWithInfoField',
  'SdfCompanySearchField',
  'SdfAsyncSelectField',
  'SdfActionCardListField',
  'SdfTableRepeaterField',
  'SdfFindVehicleField',
])

export const ComponentSwitch = ({
  component,
  error,
  answers,
  onAnswerChange,
  dispatch,
  displayValues,
  pendingRefetchTargets = [],
}: ComponentSwitchProps) => {
  const handleChange = useCallback(
    (value: unknown) => {
      if (component.id) {
        onAnswerChange(component.id, value)
      }
    },
    [component.id, onAnswerChange],
  )

  const clientShowWhenValue = useFormExpressionEvaluator(
    component.clientShowWhen ?? undefined,
    answers,
  )
  const visible =
    component.clientShowWhen === null || component.clientShowWhen === undefined
      ? true
      : Boolean(clientShowWhenValue)

  if (!visible) return null

  const currentValue = component.id ? answers[component.id] : undefined
  const isRefetchPending = component.id
    ? pendingRefetchTargets.includes(component.id)
    : false
  const Renderer = unsupportedFieldTypes.has(component.__typename)
    ? SdfUnsupportedField
    : fieldRenderers[component.__typename]

  if (!Renderer) {
    return null
  }

  return (
    <Renderer
      component={component}
      currentValue={currentValue}
      error={error}
      answers={answers}
      onAnswerChange={onAnswerChange}
      handleChange={handleChange}
      dispatch={dispatch}
      displayValues={displayValues}
      pendingRefetchTargets={pendingRefetchTargets}
      isRefetchPending={isRefetchPending}
    />
  )
}
