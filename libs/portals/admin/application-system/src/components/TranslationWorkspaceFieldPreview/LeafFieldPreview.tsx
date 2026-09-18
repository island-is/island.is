import { Box } from '@island.is/island-ui/core'
import { FieldTypes } from '@island.is/application/types'
import type { Application } from '@island.is/application/types'
import type {
  PreviewFormatMessage,
  ResolvePreviewString,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import {
  INPUT_FIELD_TYPES,
  PREVIEW_EXCLUDED_FIELD_TYPES,
  TEXT_DISPLAY_TYPES,
} from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
} from '../../utils/translationWorkspaceStaticText'
import type { PreviewFieldComponent } from '../../utils/previewFieldRegistry'
import { TranslationWorkspaceOverviewFieldPreview } from '../TranslationWorkspaceOverviewFieldPreview/TranslationWorkspaceOverviewFieldPreview'
import { resolveLeafFieldErrorMessage } from './translationWorkspaceFieldPreviewUtils'
import { AlertMessageFieldPreview } from './AlertMessageFieldPreview'
import { BankAccountFieldPreview } from './BankAccountFieldPreview'
import { CheckboxFieldLeafPreview } from './CheckboxFieldLeafPreview'
import {
  CustomFieldPreview,
  shouldRenderCustomOrRegisteredField,
} from './CustomFieldPreview'
import { DateFieldPreview } from './DateFieldPreview'
import { DescriptionFieldPreview } from './DescriptionFieldPreview'
import { DisplayFieldPreview } from './DisplayFieldPreview'
import { DividerFieldPreview } from './DividerFieldPreview'
import { ExternalDataProviderPreview } from './ExternalDataProviderPreview'
import { ExternalDataSourcePreview } from './ExternalDataSourcePreview'
import { FieldsRepeaterFieldPreview } from './FieldsRepeaterFieldPreview'
import { FileUploadFieldPreview } from './FileUploadFieldPreview'
import { ImageFieldPreview } from './ImageFieldPreview'
import { InputFieldPreview } from './InputFieldPreview'
import { NationalIdWithNameFieldPreview } from './NationalIdWithNameFieldPreview'
import { PlaceholderFieldPreview } from './PlaceholderFieldPreview'
import { RadioFieldLeafPreview } from './RadioFieldLeafPreview'
import { SelectFieldPreview } from './SelectFieldPreview'
import { StaticTableFieldPreview } from './StaticTableFieldPreview'
import { TableRepeaterFieldPreview } from './TableRepeaterFieldPreview'
import { TextDisplayFieldPreview } from './TextDisplayFieldPreview'

export type LeafFieldPreviewProps = {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
  showValidationErrors?: boolean
  validationDescriptorsByPath?: Record<string, ValidationMessageDescriptor[]>
  focusedFieldId?: string | null
  fieldErrorOverrides?: Set<string>
  previewFieldValues?: Record<string, string>
  previewFields?: Record<string, PreviewFieldComponent>
  previewApplication: Application
}

export const LeafFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
  showValidationErrors,
  validationDescriptorsByPath,
  focusedFieldId,
  fieldErrorOverrides,
  previewFieldValues,
  previewFields,
  previewApplication,
}: LeafFieldPreviewProps) => {
  if (PREVIEW_EXCLUDED_FIELD_TYPES.has(screen.type)) {
    return null
  }

  const layout = fieldPreviewLayoutProps(screen)
  const fieldErrorMessage = resolveLeafFieldErrorMessage(
    screen,
    resolvePreviewString,
    formatMessage,
    showValidationErrors,
    validationDescriptorsByPath,
    fieldErrorOverrides,
  )
  const previewValue = previewFieldValues?.[screen.id]
  const nestedPreviewProps = {
    resolvePreviewString,
    formatMessage,
    showValidationErrors,
    validationDescriptorsByPath,
    focusedFieldId,
    fieldErrorOverrides,
    previewFieldValues,
    previewFields,
    previewApplication,
  }

  if (shouldRenderCustomOrRegisteredField(screen, previewFields)) {
    return (
      <CustomFieldPreview
        screen={screen}
        previewApplication={previewApplication}
        previewFields={previewFields}
        errorMessage={fieldErrorMessage}
      />
    )
  }

  if (screen.type === 'EXTERNAL_DATA_SOURCE') {
    return (
      <Box {...layout}>
        <ExternalDataSourcePreview
          screen={screen}
          resolvePreviewString={resolvePreviewString}
        />
      </Box>
    )
  }

  if (screen.type === 'EXTERNAL_DATA_PROVIDER') {
    return (
      <ExternalDataProviderPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
      />
    )
  }

  if (screen.type === 'STATIC_TABLE') {
    return (
      <StaticTableFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
      />
    )
  }

  if (screen.type === 'TABLE_REPEATER') {
    return <TableRepeaterFieldPreview screen={screen} {...nestedPreviewProps} />
  }

  if (screen.type === 'FIELDS_REPEATER') {
    return (
      <FieldsRepeaterFieldPreview screen={screen} {...nestedPreviewProps} />
    )
  }

  if (screen.type === 'NATIONAL_ID_WITH_NAME') {
    return (
      <NationalIdWithNameFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
      />
    )
  }

  if (screen.type === FieldTypes.BANK_ACCOUNT) {
    return (
      <BankAccountFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
        previewValue={previewValue}
        errorMessage={fieldErrorMessage}
      />
    )
  }

  if (INPUT_FIELD_TYPES.has(screen.type)) {
    return (
      <InputFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        previewValue={previewValue}
        errorMessage={fieldErrorMessage}
      />
    )
  }

  if (screen.type === 'CHECKBOX') {
    return (
      <CheckboxFieldLeafPreview
        screen={screen}
        layout={layout}
        label={resolvePreviewLabel(screen, resolvePreviewString)}
        resolvePreviewString={resolvePreviewString}
        previewValue={previewValue}
      />
    )
  }

  if (screen.type === 'DATE') {
    return (
      <DateFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        errorMessage={fieldErrorMessage}
      />
    )
  }

  if (
    screen.type === 'SELECT' ||
    screen.type === 'VEHICLE_SELECT' ||
    screen.type === 'VEHICLE_RADIO'
  ) {
    return (
      <SelectFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        errorMessage={fieldErrorMessage}
      />
    )
  }

  if (screen.type === 'RADIO') {
    return (
      <RadioFieldLeafPreview
        screen={screen}
        layout={layout}
        label={resolvePreviewLabel(screen, resolvePreviewString)}
        resolvePreviewString={resolvePreviewString}
        previewValue={previewValue}
      />
    )
  }

  if (screen.type === 'FILEUPLOAD') {
    return (
      <FileUploadFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
      />
    )
  }

  if (screen.type === 'DESCRIPTION') {
    return (
      <DescriptionFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
      />
    )
  }

  if (screen.type === 'ALERT_MESSAGE') {
    return (
      <AlertMessageFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
      />
    )
  }

  if (screen.type === FieldTypes.DISPLAY) {
    return (
      <DisplayFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        previewValue={previewValue}
        errorMessage={fieldErrorMessage}
      />
    )
  }

  if (TEXT_DISPLAY_TYPES.has(screen.type)) {
    return (
      <TextDisplayFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
      />
    )
  }

  if (screen.type === 'DIVIDER') {
    return <DividerFieldPreview screen={screen} />
  }

  if (screen.type === FieldTypes.IMAGE) {
    return (
      <ImageFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
      />
    )
  }

  if (screen.type === FieldTypes.OVERVIEW) {
    return (
      <TranslationWorkspaceOverviewFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
      />
    )
  }

  return (
    <PlaceholderFieldPreview
      screen={screen}
      resolvePreviewString={resolvePreviewString}
    />
  )
}
