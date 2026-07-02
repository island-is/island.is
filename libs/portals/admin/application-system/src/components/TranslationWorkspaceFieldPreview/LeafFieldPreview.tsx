import {
  Box,
  Text,
  Checkbox,
  DatePicker,
  Select,
  Input,
  Icon,
  Divider,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import {
  coreErrorMessages,
  coreMessages,
  coreDefaultFieldMessages,
} from '@island.is/application/core'
import type {
  PreviewFormatMessage,
  ResolvePreviewString,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import {
  INPUT_FIELD_TYPES,
  noop,
  PLACEHOLDER_TYPES,
  PREVIEW_EXCLUDED_FIELD_TYPES,
  previewWorkspaceInputBackgroundColor,
  TEXT_DISPLAY_TYPES,
} from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { FieldTypes } from '@island.is/application/types'
import type { Application } from '@island.is/application/types'
import { TranslationWorkspaceOverviewFieldPreview } from '../TranslationWorkspaceOverviewFieldPreview/TranslationWorkspaceOverviewFieldPreview'
import { CustomFieldErrorBoundary } from '../CustomFieldErrorBoundary/CustomFieldErrorBoundary'
import type { PreviewFieldComponent } from '../../utils/previewFieldRegistry'
import {
  buildPreviewFieldFromScreen,
  TRANSLATION_WORKSPACE_UI_FIELD_TYPES,
} from '../../utils/buildPreviewFieldFromScreen'
import { resolveTranslationWorkspaceGraphicsComponent } from '../TranslationWorkspaceGraphicsSvg/TranslationWorkspaceGraphicsSvg'
import * as translationWorkspaceGraphicsSvg from '../TranslationWorkspaceGraphicsSvg/TranslationWorkspaceGraphicsSvg.css'
import {
  buildMockCustomField,
  inferTranslationWorkspaceShowFieldName,
  previewImageFieldJustifyContent,
  previewImageFieldWidthCss,
} from './translationWorkspaceFieldPreviewUtils'
import { DescriptionFieldPreview } from './DescriptionFieldPreview'
import { AlertMessageFieldPreview } from './AlertMessageFieldPreview'
import { StaticTableFieldPreview } from './StaticTableFieldPreview'
import { ExternalDataSourcePreview } from './ExternalDataSourcePreview'
import { RadioFieldLeafPreview } from './RadioFieldLeafPreview'
import { CheckboxFieldLeafPreview } from './CheckboxFieldLeafPreview'
import { NationalIdWithNameFieldPreview } from './NationalIdWithNameFieldPreview'
import { FieldsRepeaterFieldPreview } from './FieldsRepeaterFieldPreview'
import { TableRepeaterFieldPreview } from './TableRepeaterFieldPreview'
import { TextDisplayPreviewNodes } from './TextDisplayPreviewNodes'

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

  const label = resolvePreviewLabel(screen, resolvePreviewString)
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const hasErrorOverride = fieldErrorOverrides?.has(screen.id) === true

  const fieldErrorMessage = (() => {
    if (hasErrorOverride) {
      const descriptors = validationDescriptorsByPath?.[screen.id]
      if (descriptors && descriptors.length > 0) {
        return resolvePreviewString(
          descriptors[0].id,
          descriptors[0].defaultMessage,
        )
      }
      return formatMessage(coreErrorMessages.defaultError)
    }
    if (!showValidationErrors || !validationDescriptorsByPath) return undefined
    const descriptors = validationDescriptorsByPath[screen.id]
    if (!descriptors || descriptors.length === 0) return undefined
    const d = descriptors[0]
    return resolvePreviewString(d.id, d.defaultMessage)
  })()

  const registry = previewFields ?? {}
  const componentName = screen.component ?? ''
  const PreviewCtrl = componentName !== '' ? registry[componentName] : undefined

  if (
    PreviewCtrl &&
    screen.type !== FieldTypes.CUSTOM &&
    TRANSLATION_WORKSPACE_UI_FIELD_TYPES.has(screen.type)
  ) {
    const builtField = buildPreviewFieldFromScreen(screen)
    if (builtField) {
      return (
        <Box key={key} {...layout}>
          <CustomFieldErrorBoundary componentName={componentName}>
            <PreviewCtrl
              application={previewApplication}
              field={builtField}
              error={fieldErrorMessage}
              errors={{}}
              showFieldName={inferTranslationWorkspaceShowFieldName(screen)}
              goToScreen={noop}
              refetch={noop}
            />
          </CustomFieldErrorBoundary>
        </Box>
      )
    }
  }

  if (screen.type === FieldTypes.CUSTOM && screen.component) {
    const CustomComponent = registry[screen.component]
    if (CustomComponent) {
      const mockField = buildMockCustomField(screen)
      return (
        <Box key={key} {...layout}>
          <CustomFieldErrorBoundary componentName={screen.component}>
            <CustomComponent
              application={previewApplication}
              field={mockField}
              error={undefined}
              errors={{}}
              goToScreen={noop}
              refetch={noop}
            />
          </CustomFieldErrorBoundary>
        </Box>
      )
    }
    return (
      <Box
        key={screen.id}
        padding={2}
        border="standard"
        borderRadius="standard"
        background="blue100"
      >
        <Text variant="eyebrow" color="blue400">
          CUSTOM
        </Text>
        <Text variant="small">{screen.component}</Text>
      </Box>
    )
  }

  if (screen.type === 'EXTERNAL_DATA_SOURCE') {
    return (
      <Box key={key} {...layout}>
        <ExternalDataSourcePreview
          screen={screen}
          resolvePreviewString={resolvePreviewString}
        />
      </Box>
    )
  }

  if (screen.type === 'EXTERNAL_DATA_PROVIDER') {
    const intro = resolveTranslatableStaticText(
      screen.subTitle ?? '',
      screen.messageDescriptors,
      resolvePreviewString,
    )
    const checkboxStatic = screen.checkboxLabel ?? ''
    const checkboxResolved = checkboxStatic
      ? resolveTranslatableStaticText(
          checkboxStatic,
          screen.messageDescriptors,
          resolvePreviewString,
        )
      : formatMessage(coreMessages.externalDataAgreement)

    return (
      <Box key={key} {...layout}>
        <Box marginTop={2} marginBottom={5}>
          <Box display="flex" alignItems="center" justifyContent="flexStart">
            <Box marginRight={1}>
              <Icon
                icon="fileTrayFull"
                size="medium"
                color="blue400"
                type="outline"
              />
            </Box>
            <Text variant="h4">{intro}</Text>
          </Box>
          {screen.description && (
            <Box marginTop={4}>
              <Markdown>
                {resolveTranslatableStaticText(
                  screen.description,
                  screen.messageDescriptors,
                  resolvePreviewString,
                )}
              </Markdown>
            </Box>
          )}
        </Box>
        <Box marginBottom={5}>
          {screen.children
            ?.filter((c) => c.type === 'EXTERNAL_DATA_SOURCE')
            .map((child) => (
              <Box key={child.id}>
                <ExternalDataSourcePreview
                  screen={child}
                  resolvePreviewString={resolvePreviewString}
                />
              </Box>
            ))}
        </Box>
        <Checkbox
          large
          name={`preview-external-data-${key}`}
          onChange={noop}
          checked={false}
          backgroundColor="blue"
          label={<Markdown>{checkboxResolved}</Markdown>}
        />
        {screen.subDescription && (
          <Box marginTop={4}>
            <Markdown>
              {resolveTranslatableStaticText(
                screen.subDescription,
                screen.messageDescriptors,
                resolvePreviewString,
              )}
            </Markdown>
          </Box>
        )}
      </Box>
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
    return (
      <TableRepeaterFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
        showValidationErrors={showValidationErrors}
        validationDescriptorsByPath={validationDescriptorsByPath}
        focusedFieldId={focusedFieldId}
        fieldErrorOverrides={fieldErrorOverrides}
        previewFieldValues={previewFieldValues}
        previewFields={previewFields}
        previewApplication={previewApplication}
      />
    )
  }

  if (screen.type === 'FIELDS_REPEATER') {
    return (
      <FieldsRepeaterFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
        showValidationErrors={showValidationErrors}
        validationDescriptorsByPath={validationDescriptorsByPath}
        focusedFieldId={focusedFieldId}
        fieldErrorOverrides={fieldErrorOverrides}
        previewFieldValues={previewFieldValues}
        previewFields={previewFields}
        previewApplication={previewApplication}
      />
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

  if (INPUT_FIELD_TYPES.has(screen.type)) {
    const inputPreviewValue = previewFieldValues?.[screen.id]
    const isTextarea =
      screen.type === FieldTypes.TEXT && screen.textFieldVariant === 'textarea'
    const placeholderResolved =
      screen.inputPlaceholder != null && screen.inputPlaceholder !== ''
        ? resolveTranslatableStaticText(
            screen.inputPlaceholder,
            screen.messageDescriptors,
            resolvePreviewString,
          ).trim()
        : ''
    return (
      <Box key={key} {...layout}>
        <Box paddingTop={2}>
          <Input
            label={label}
            name={key}
            placeholder={placeholderResolved || undefined}
            readOnly
            value={inputPreviewValue ?? ''}
            hasError={!!fieldErrorMessage}
            errorMessage={fieldErrorMessage}
            backgroundColor={previewWorkspaceInputBackgroundColor(screen)}
            textarea={isTextarea}
            rows={
              isTextarea && screen.textFieldRows != null
                ? screen.textFieldRows
                : undefined
            }
          />
        </Box>
      </Box>
    )
  }

  if (screen.type === 'CHECKBOX') {
    return (
      <CheckboxFieldLeafPreview
        screen={screen}
        layout={layout}
        label={label}
        resolvePreviewString={resolvePreviewString}
        previewValue={previewFieldValues?.[screen.id]}
      />
    )
  }

  if (screen.type === 'DATE') {
    return (
      <Box key={key} {...layout}>
        <DatePicker
          label={label}
          placeholderText="dd.mm.yyyy"
          handleChange={noop}
          hasError={!!fieldErrorMessage}
          errorMessage={fieldErrorMessage}
          backgroundColor={previewWorkspaceInputBackgroundColor(screen)}
        />
      </Box>
    )
  }

  // Tier B: keep handcrafted select until introspection exposes option values/labels (`SelectFormField`).
  if (
    screen.type === 'SELECT' ||
    screen.type === 'VEHICLE_SELECT' ||
    screen.type === 'VEHICLE_RADIO'
  ) {
    return (
      <Box key={key} {...layout}>
        <Select
          label={label}
          name={key}
          options={[]}
          isDisabled
          hasError={!!fieldErrorMessage}
          errorMessage={fieldErrorMessage}
          backgroundColor={previewWorkspaceInputBackgroundColor(screen)}
        />
      </Box>
    )
  }

  if (screen.type === 'RADIO') {
    return (
      <RadioFieldLeafPreview
        screen={screen}
        layout={layout}
        label={label}
        resolvePreviewString={resolvePreviewString}
        previewValue={previewFieldValues?.[screen.id]}
      />
    )
  }

  if (screen.type === 'FILEUPLOAD') {
    const introductionText = screen.fileUploadIntroduction
      ? resolveTranslatableStaticText(
          screen.fileUploadIntroduction,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : ''

    const uploadHeader = screen.fileUploadHeader
      ? resolveTranslatableStaticText(
          screen.fileUploadHeader,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : label.trim() ||
        formatMessage(coreDefaultFieldMessages.defaultFileUploadHeader)

    const uploadDescription = screen.fileUploadDescription
      ? resolveTranslatableStaticText(
          screen.fileUploadDescription,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : formatMessage(coreDefaultFieldMessages.defaultFileUploadDescription)

    const uploadButtonLabel = screen.fileUploadButtonLabel
      ? resolveTranslatableStaticText(
          screen.fileUploadButtonLabel,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : formatMessage(coreDefaultFieldMessages.defaultFileUploadButtonLabel)

    return (
      <Box key={key} marginTop={3} marginBottom={3} {...layout}>
        {introductionText !== '' && (
          <Box marginBottom={2}>
            <Markdown>{introductionText}</Markdown>
          </Box>
        )}
        <Box paddingTop={2}>
          <InputFileUpload
            name={key}
            files={[]}
            title={uploadHeader || undefined}
            description={uploadDescription || undefined}
            buttonLabel={uploadButtonLabel || undefined}
            onRemove={noop}
          />
        </Box>
      </Box>
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
    const titleVariantDisplay: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' = (() => {
      const v = screen.titleVariant
      if (v === 'h1' || v === 'h2' || v === 'h3' || v === 'h4' || v === 'h5') {
        return v
      }
      return 'h4'
    })()
    const titleText =
      screen.title != null && screen.title !== ''
        ? resolveTranslatableStaticText(
            screen.title,
            screen.messageDescriptors,
            resolvePreviewString,
          ).trim()
        : ''
    const labelDm = screen.displayLabelMessageId
      ? screen.messageDescriptors.find(
          (d) => d.id === screen.displayLabelMessageId,
        )?.defaultMessage
      : undefined
    const suffixDm = screen.displaySuffixMessageId
      ? screen.messageDescriptors.find(
          (d) => d.id === screen.displaySuffixMessageId,
        )?.defaultMessage
      : undefined
    const inputLabel =
      screen.displayLabelMessageId != null
        ? resolvePreviewString(screen.displayLabelMessageId, labelDm).trim()
        : screen.displayLabelStatic ?? ''
    const suffixText =
      screen.displaySuffixMessageId != null
        ? resolvePreviewString(screen.displaySuffixMessageId, suffixDm).trim()
        : (screen.displaySuffixStatic ?? '').trim()
    const stubValue = previewFieldValues?.[screen.id] ?? '—'
    return (
      <Box key={key} {...layout}>
        <Box paddingY={3} display="flex" flexDirection="column">
          <Box width="full">
            {titleText !== '' && (
              <Text
                variant={titleVariantDisplay}
                as={titleVariantDisplay}
                paddingBottom={1}
              >
                {titleText}
              </Text>
            )}
            <Box
              display="flex"
              flexDirection="row"
              alignItems="flexEnd"
              columnGap={2}
            >
              <Box flexGrow={1}>
                <Input
                  id={key}
                  name={key}
                  label={inputLabel || undefined}
                  readOnly
                  value={stubValue}
                  hasError={!!fieldErrorMessage}
                  errorMessage={fieldErrorMessage}
                  backgroundColor="blue"
                />
              </Box>
              {suffixText !== '' && (
                <Text variant="small" paddingBottom={2}>
                  {suffixText}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  if (TEXT_DISPLAY_TYPES.has(screen.type)) {
    return (
      <Box key={key} {...layout}>
        <TextDisplayPreviewNodes
          screen={screen}
          resolvePreviewString={resolvePreviewString}
        />
      </Box>
    )
  }

  if (screen.type === 'DIVIDER') {
    return (
      <Box key={key} {...layout}>
        <Divider />
      </Box>
    )
  }

  if (screen.type === FieldTypes.IMAGE) {
    const titleV: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' = (() => {
      const v = screen.titleVariant
      if (v === 'h1' || v === 'h2' || v === 'h3' || v === 'h4' || v === 'h5') {
        return v
      }
      return 'h4'
    })()
    const titleText =
      screen.title != null && screen.title !== ''
        ? resolveTranslatableStaticText(
            screen.title,
            screen.messageDescriptors,
            resolvePreviewString,
          ).trim()
        : ''
    const imgWidth = previewImageFieldWidthCss(screen.imageWidth)
    const justify = previewImageFieldJustifyContent(screen.imagePosition)
    const GraphicsSvgComponent = resolveTranslationWorkspaceGraphicsComponent(
      screen.imageSvgComponentName,
    )
    return (
      <Box key={key} {...layout}>
        {titleText !== '' && (
          <Box marginBottom={1}>
            <Text variant={titleV} as={titleV}>
              {titleText}
            </Text>
          </Box>
        )}
        <Box
          display={screen.imagePosition != null ? 'flex' : 'block'}
          justifyContent={justify}
        >
          {screen.imageUrl ? (
            <img
              src={screen.imageUrl}
              alt={screen.imageAlt ?? ''}
              style={{
                width: imgWidth,
                height: 'auto',
                maxWidth: '100%',
                display: 'block',
              }}
            />
          ) : GraphicsSvgComponent ? (
            <Box
              style={{
                width: imgWidth,
                maxWidth: '100%',
              }}
              className={
                imgWidth !== 'auto'
                  ? translationWorkspaceGraphicsSvg.svgContained
                  : undefined
              }
            >
              <GraphicsSvgComponent />
            </Box>
          ) : screen.imageSvgComponentName ? (
            <Box
              padding={4}
              border="standard"
              borderRadius="standard"
              background="blue100"
              width="full"
            >
              <Text variant="small" color="dark400">
                SVG: {screen.imageSvgComponentName}
              </Text>
            </Box>
          ) : (
            <Text variant="small" color="dark300">
              Image
            </Text>
          )}
        </Box>
      </Box>
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

  if (PLACEHOLDER_TYPES.has(screen.type)) {
    return (
      <Box
        key={key}
        padding={2}
        border="standard"
        borderRadius="standard"
        background="white"
        {...layout}
      >
        <Text variant="eyebrow" color="dark300">
          {screen.type}
        </Text>
        <Text variant="small">{label}</Text>
      </Box>
    )
  }

  return (
    <Box
      key={key}
      padding={2}
      border="standard"
      borderRadius="standard"
      background="white"
      {...layout}
    >
      <Text variant="eyebrow" color="dark300">
        {screen.type}
      </Text>
      <Text variant="small">{label}</Text>
    </Box>
  )
}
