import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  Divider,
  Checkbox,
  DatePicker,
  Select,
  RadioButton,
  Input,
  Icon,
  Table as T,
  Stack,
  InputFileUpload,
  type AlertMessageType,
  type InputBackgroundColor,
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import {
  coreErrorMessages,
  coreMessages,
  coreDefaultFieldMessages,
} from '@island.is/application/core'
import type {
  MessageDescriptor,
  PreviewFormatMessage,
  RadioOptionIntrospection,
  ResolvePreviewString,
  ScreenIntrospection,
  ValidationMessageDescriptor,
} from '../../types/translationWorkspace'
import {
  HALF_WIDTH_IGNORED_TYPES,
  INPUT_FIELD_TYPES,
  noop,
  PLACEHOLDER_TYPES,
  PREVIEW_EXCLUDED_FIELD_TYPES,
  TEXT_DISPLAY_TYPES,
  TEXT_DISPLAY_TYPES_ALWAYS_MARKDOWN,
} from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  isMarkdownMessageId,
  resolvePreviewLabel,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { filterPreviewMultiFieldChildren } from '../../utils/translationWorkspaceMultiFieldChildren'
import { focusedFieldHighlight } from '../TranslationWorkspacePreviewArea/TranslationWorkspacePreviewArea.css'

const staticTableTitleVariantToText = (
  v: string | null | undefined,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' => {
  if (v === 'h1' || v === 'h2' || v === 'h3' || v === 'h4' || v === 'h5') {
    return v
  }
  return 'h4'
}

const descriptionTitleVariantToText = (
  v: string | null | undefined,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' => {
  if (v === 'h1' || v === 'h2' || v === 'h3' || v === 'h4' || v === 'h5') {
    return v
  }
  return 'h3'
}

const DescriptionFieldPreview = ({
  screen,
  resolvePreviewString,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const titleText =
    screen.title != null && screen.title !== ''
      ? resolveTranslatableStaticText(
          screen.title,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : ''
  const descriptionResolved = screen.description
    ? resolveTranslatableStaticText(
        screen.description,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  const titleDescriptor = screen.title
    ? screen.messageDescriptors.find((d) => d.defaultMessage === screen.title)
    : undefined
  const descriptionDescriptor = screen.description
    ? screen.messageDescriptors.find(
        (d) => d.defaultMessage === screen.description,
      )
    : undefined
  const skipIds = new Set(
    [titleDescriptor?.id, descriptionDescriptor?.id].filter(
      Boolean,
    ) as string[],
  )
  const extraDescriptors = screen.messageDescriptors.filter(
    (d) => !skipIds.has(d.id),
  )

  const titleV = descriptionTitleVariantToText(screen.titleVariant)

  return (
    <Box key={key} {...layout}>
      {titleText !== '' && (
        <Text variant={titleV} as={titleV} marginBottom={descriptionResolved ? 1 : 0}>
          {titleText}
        </Text>
      )}
      {descriptionResolved !== '' && (
        <Box component="div">
          <Markdown>{descriptionResolved}</Markdown>
        </Box>
      )}
      {extraDescriptors.length > 0 && (
        <Box marginTop={titleText || descriptionResolved ? 2 : 0}>
          {extraDescriptors.map((d, i) => {
            const text = resolvePreviewString(d.id, d.defaultMessage).trim()
            if (!text) return null
            return isMarkdownMessageId(d.id) ? (
              <Box key={d.id} marginTop={i > 0 ? 2 : 0}>
                <Markdown>{text}</Markdown>
              </Box>
            ) : (
              <Text
                key={d.id}
                as="div"
                whiteSpace="preLine"
                marginTop={i > 0 ? 2 : 0}
              >
                {text}
              </Text>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

const VALID_ALERT_TYPES: Set<string> = new Set([
  'default',
  'error',
  'info',
  'success',
  'warning',
])

const AlertMessageFieldPreview = ({
  screen,
  resolvePreviewString,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}) => {
  const layout = fieldPreviewLayoutProps(screen)
  if (layout.marginBottom == null) {
    layout.marginBottom = 2
  }
  if (layout.marginTop == null) {
    layout.marginTop = 2
  }

  const alertType: AlertMessageType = VALID_ALERT_TYPES.has(
    screen.alertType ?? '',
  )
    ? (screen.alertType as AlertMessageType)
    : 'default'

  const titleResolved = resolveTranslatableStaticText(
    screen.title,
    screen.messageDescriptors,
    resolvePreviewString,
  ).trim()

  const messageResolved = screen.alertMessage
    ? resolveTranslatableStaticText(
        screen.alertMessage,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  if (!titleResolved && !messageResolved) {
    const fallback = screen.messageDescriptors
      .map((d) => resolvePreviewString(d.id, d.defaultMessage).trim())
      .filter((t) => t.length > 0)
      .join('\n')
    return (
      <Box {...layout}>
        <AlertMessage
          type={alertType}
          title={fallback || screen.id}
        />
      </Box>
    )
  }

  return (
    <Box {...layout}>
      <AlertMessage
        type={alertType}
        title={titleResolved || messageResolved}
        message={
          titleResolved && messageResolved ? (
            <Markdown>{messageResolved}</Markdown>
          ) : undefined
        }
      />
    </Box>
  )
}

const StaticTableFieldPreview = ({
  screen,
  resolvePreviewString,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const titleV = staticTableTitleVariantToText(
    screen.staticTableTitleVariant ?? 'h4',
  )

  const mainTitle = resolveTranslatableStaticText(
    screen.title,
    screen.messageDescriptors,
    resolvePreviewString,
  )
  const descriptionResolved = screen.description
    ? resolveTranslatableStaticText(
        screen.description,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  const resolveDesc = (d: MessageDescriptor) =>
    resolvePreviewString(d.id, d.defaultMessage)

  const headerDescriptors = screen.staticTableHeaderDescriptors ?? []
  const rowCells = screen.staticTableRowCellDescriptors ?? []
  const colCount = screen.staticTableColumnCount ?? 0
  const declaredRowCount = screen.staticTableRowCount ?? 0
  const rowsFromFn = screen.staticTableRowsFromFunction === true

  const displayColCount = Math.max(
    colCount,
    headerDescriptors.length,
    1,
  )

  const bodyRows: MessageDescriptor[][] = []
  if (rowCells.length > 0) {
    const perRow = Math.max(colCount, headerDescriptors.length, 1)
    for (let i = 0; i < rowCells.length; i += perRow) {
      bodyRows.push(rowCells.slice(i, i + perRow))
    }
  }

  const hasStructuredPreview =
    headerDescriptors.length > 0 ||
    rowCells.length > 0 ||
    (screen.staticTableSummary && screen.staticTableSummary.length > 0) ||
    mainTitle.trim() !== '' ||
    descriptionResolved.length > 0

  if (!hasStructuredPreview) {
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
        <Text variant="small">
          {mainTitle || resolvePreviewLabel(screen, resolvePreviewString)}
        </Text>
      </Box>
    )
  }

  return (
    <Box key={key} {...layout}>
      {mainTitle.trim() !== '' && (
        <Text variant={titleV} as="p" marginBottom={2}>
          {mainTitle}
        </Text>
      )}
      {descriptionResolved.length > 0 && (
        <Box marginBottom={3}>
          <Markdown>{descriptionResolved}</Markdown>
        </Box>
      )}
      <Box marginTop={0}>
        <T.Table>
          <T.Head>
            <T.Row>
              {headerDescriptors.length > 0
                ? headerDescriptors.map((d, i) => (
                    <T.HeadData key={`h-${d.id}-${i}`}>
                      {resolveDesc(d)}
                    </T.HeadData>
                  ))
                : Array.from({ length: displayColCount }, (_, i) => (
                    <T.HeadData key={`h-ph-${i}`}>
                      <Text color="dark300" variant="small">
                        —
                      </Text>
                    </T.HeadData>
                  ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {bodyRows.length > 0
              ? bodyRows.map((row, rowIndex) => (
                  <T.Row key={`b-${rowIndex}`}>
                    {row.map((d, i) => (
                      <T.Data key={`b-${rowIndex}-c-${i}`}>
                        {resolveDesc(d)}
                      </T.Data>
                    ))}
                    {row.length < displayColCount
                      ? Array.from(
                          { length: displayColCount - row.length },
                          (_, j) => (
                            <T.Data key={`b-${rowIndex}-pad-${j}`}>
                              <Text color="dark300" variant="small">
                                —
                              </Text>
                            </T.Data>
                          ),
                        )
                      : null}
                  </T.Row>
                ))
              : (rowsFromFn
                  ? [0]
                  : declaredRowCount > 0
                    ? Array.from(
                        { length: Math.min(declaredRowCount, 5) },
                        (_, i) => i,
                      )
                    : [0]
                ).map((rowIndex) => (
                  <T.Row key={`ph-row-${rowIndex}`}>
                    {Array.from({ length: displayColCount }, (_, i) => (
                      <T.Data key={`ph-${rowIndex}-${i}`}>
                        <Text color="dark300" variant="small">
                          —
                        </Text>
                      </T.Data>
                    ))}
                  </T.Row>
                ))}
          </T.Body>
        </T.Table>
      </Box>
      {screen.staticTableSummary && screen.staticTableSummary.length > 0 && (
        <Box marginTop={3}>
          {screen.staticTableSummary.map((s, index) => (
            <Box
              key={`st-sum-${s.label.id}-${index}`}
              marginTop={index > 0 ? 3 : 0}
              display="flex"
              flexDirection="column"
              padding={3}
              borderRadius="large"
              background="blue100"
            >
              <Text
                as="p"
                variant="medium"
                fontWeight="semiBold"
                marginBottom={1}
              >
                {resolveDesc(s.label)}
              </Text>
              <Text as="p" variant="h3" color="blue400">
                {resolveDesc(s.value)}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

const ExternalDataSourcePreview = ({
  screen,
  resolvePreviewString,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}) => {
  const layout = fieldPreviewLayoutProps(screen)
  const pageTitleResolved = screen.pageTitle
    ? resolveTranslatableStaticText(
        screen.pageTitle,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''
  const titleResolved = resolveTranslatableStaticText(
    screen.title ?? '',
    screen.messageDescriptors,
    resolvePreviewString,
  )
  const subResolved = resolveTranslatableStaticText(
    screen.description ?? '',
    screen.messageDescriptors,
    resolvePreviewString,
  ).trim()

  return (
    <Box marginBottom={3} {...layout}>
      {pageTitleResolved.length > 0 && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flexStart"
          marginTop={5}
        >
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">{pageTitleResolved}</Text>
        </Box>
      )}
      <Text variant="h4" color="blue400">
        {titleResolved}
      </Text>
      {screen.description && subResolved.length > 0 && (
        <Box component="div" marginTop={1}>
          <Markdown>{subResolved}</Markdown>
        </Box>
      )}
    </Box>
  )
}

const RadioFieldLeafPreview = ({
  screen,
  layout,
  label,
  resolvePreviewString,
  previewValue,
}: {
  screen: ScreenIntrospection
  layout: ReturnType<typeof fieldPreviewLayoutProps>
  label: string
  resolvePreviewString: ResolvePreviewString
  previewValue?: string
}) => {
  const key = screen.id
  const fallbackOptions: RadioOptionIntrospection[] = [
    { value: '1', labelDefaultMessage: 'Option 1' },
    { value: '2', labelDefaultMessage: 'Option 2' },
  ]
  const options =
    screen.radioOptions && screen.radioOptions.length > 0
      ? screen.radioOptions
      : fallbackOptions

  const large = screen.radioLargeButtons !== false
  const bgColor: InputBackgroundColor | undefined =
    large &&
    (screen.radioBackgroundColor === 'white' ||
      screen.radioBackgroundColor === 'blue')
      ? screen.radioBackgroundColor
      : large
        ? 'blue'
        : undefined

  const split = screen.width === 'half' ? ('1/2' as const) : ('1/1' as const)

  const [selected, setSelected] = useState(previewValue ?? '')

  useEffect(() => {
    if (previewValue !== undefined) {
      setSelected(previewValue)
    }
  }, [previewValue])

  const resolveOptionLabel = (opt: RadioOptionIntrospection) => {
    if (opt.labelMessageId) {
      return resolvePreviewString(
        opt.labelMessageId,
        opt.labelDefaultMessage,
      )
    }
    return opt.labelDefaultMessage ?? opt.value
  }

  return (
    <Box key={key} {...layout}>
      {label.trim() !== '' && (
        <Text variant="small" fontWeight="semiBold" marginBottom={1}>
          {label}
        </Text>
      )}
      <Box paddingTop={2}>
        <GridRow>
          {options.map((opt, index) => {
            const optionLabel = resolveOptionLabel(opt)
            return (
              <GridColumn
                key={`${key}-${opt.value}-${index}`}
                span={['1/1', split]}
                paddingBottom={2}
                paddingTop={0}
              >
                <RadioButton
                  large={large}
                  backgroundColor={bgColor}
                  name={key}
                  label={
                    <Markdown>
                      {optionLabel.trim() === '' ? '\u00a0' : optionLabel}
                    </Markdown>
                  }
                  value={opt.value}
                  checked={opt.value === selected}
                  onChange={({ target }) => setSelected(String(target.value))}
                />
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    </Box>
  )
}

const CheckboxFieldLeafPreview = ({
  screen,
  layout,
  label,
  resolvePreviewString,
  previewValue,
}: {
  screen: ScreenIntrospection
  layout: ReturnType<typeof fieldPreviewLayoutProps>
  label: string
  resolvePreviewString: ResolvePreviewString
  previewValue?: string
}) => {
  const key = screen.id
  const options =
    screen.checkboxOptions && screen.checkboxOptions.length > 0
      ? screen.checkboxOptions
      : [
          {
            value: '1',
            labelDefaultMessage: label.trim() !== '' ? label : ' ',
          },
        ]

  const large = screen.checkboxLarge !== false
  const strong = screen.checkboxStrong === true
  const bgColor: InputBackgroundColor | undefined =
    large &&
    (screen.checkboxBackgroundColor === 'white' ||
      screen.checkboxBackgroundColor === 'blue')
      ? screen.checkboxBackgroundColor
      : large
        ? 'blue'
        : undefined

  const split = screen.width === 'half' ? ('1/2' as const) : ('1/1' as const)
  const spacing = screen.checkboxSpacing
  const spacingBottom: 0 | 1 | 2 =
    spacing === 0 || spacing === 1 || spacing === 2 ? spacing : 2

  const resolveOptionLabel = (opt: RadioOptionIntrospection) => {
    if (opt.labelMessageId) {
      return resolvePreviewString(
        opt.labelMessageId,
        opt.labelDefaultMessage,
      )
    }
    return opt.labelDefaultMessage ?? opt.value
  }

  const descriptionResolved = screen.description
    ? resolveTranslatableStaticText(
        screen.description,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  return (
    <Box key={key} {...layout}>
      {descriptionResolved.length > 0 && (
        <Box marginBottom={1}>
          <Markdown>{descriptionResolved}</Markdown>
        </Box>
      )}
      <Box paddingTop={2}>
        <GridRow>
          {options.map((opt, index) => {
            const text = resolveOptionLabel(opt)
            return (
              <GridColumn
                key={`${key}-cb-${opt.value}-${index}`}
                span={['1/1', split]}
                paddingBottom={spacingBottom}
              >
                <Checkbox
                  large={large}
                  strong={strong}
                  backgroundColor={bgColor}
                  name={`${key}-${opt.value}`}
                  value={opt.value}
                  checked={previewValue === opt.value}
                  onChange={noop}
                  label={
                    <Markdown>
                      {text.trim() === '' ? '\u00a0' : text}
                    </Markdown>
                  }
                />
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    </Box>
  )
}

const getTableRepeaterFormFieldSpan = (
  child: ScreenIntrospection,
): '1/1' | '1/2' | '1/3' => {
  if (!HALF_WIDTH_IGNORED_TYPES.has(child.type) && child.width === 'half') {
    return '1/2'
  }
  if (child.width === 'third') {
    return '1/3'
  }
  return '1/1'
}

const NationalIdWithNameFieldPreview = ({
  screen,
  resolvePreviewString,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)

  const nationalIdLabel = screen.nationalIdWithNameCustomNationalIdLabelText
    ? resolveTranslatableStaticText(
        screen.nationalIdWithNameCustomNationalIdLabelText,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : resolvePreviewString(
        coreErrorMessages.nationalRegistryNationalId.id,
        coreErrorMessages.nationalRegistryNationalId.defaultMessage,
      )

  const nameLabel = screen.nationalIdWithNameCustomNameLabelText
    ? resolveTranslatableStaticText(
        screen.nationalIdWithNameCustomNameLabelText,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : resolvePreviewString(
        coreErrorMessages.nationalRegistryName.id,
        coreErrorMessages.nationalRegistryName.defaultMessage,
      )

  const showPhone = screen.nationalIdWithNameShowPhoneField === true
  const showEmail = screen.nationalIdWithNameShowEmailField === true

  const phoneLabel = showPhone
    ? screen.nationalIdWithNamePhoneLabelText
      ? resolveTranslatableStaticText(
          screen.nationalIdWithNamePhoneLabelText,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : resolvePreviewString(
          coreErrorMessages.nationalRegistryPhone.id,
          coreErrorMessages.nationalRegistryPhone.defaultMessage,
        )
    : ''

  const emailLabel = showEmail
    ? screen.nationalIdWithNameEmailLabelText
      ? resolveTranslatableStaticText(
          screen.nationalIdWithNameEmailLabelText,
          screen.messageDescriptors,
          resolvePreviewString,
        ).trim()
      : resolvePreviewString(
          coreErrorMessages.nationalRegistryEmail.id,
          coreErrorMessages.nationalRegistryEmail.defaultMessage,
        )
    : ''

  return (
    <Box key={key} {...layout}>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <Input
            label={nationalIdLabel}
            name={`${key}.__preview.nationalId`}
            placeholder="######-####"
            backgroundColor="blue"
            readOnly
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
          <Input
            label={nameLabel}
            name={`${key}.__preview.name`}
            readOnly
            backgroundColor="blue"
          />
        </GridColumn>
      </GridRow>
      {(showPhone || showEmail) && (
        <GridRow>
          {phoneLabel ? (
            <GridColumn
              span={['1/1', '1/1', '1/1', '1/2']}
              paddingTop={3}
            >
              <Input
                label={phoneLabel}
                name={`${key}.__preview.phone`}
                backgroundColor="blue"
                readOnly
              />
            </GridColumn>
          ) : null}
          {emailLabel ? (
            <GridColumn
              span={['1/1', '1/1', '1/1', '1/2']}
              paddingTop={3}
            >
              <Input
                label={emailLabel}
                name={`${key}.__preview.email`}
                type="email"
                backgroundColor="blue"
                readOnly
              />
            </GridColumn>
          ) : null}
        </GridRow>
      )}
    </Box>
  )
}

const FieldsRepeaterFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
}) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const formChildren = filterPreviewMultiFieldChildren(screen.children)
  const mainTitle = resolveTranslatableStaticText(
    screen.title,
    screen.messageDescriptors,
    resolvePreviewString,
  )
  const descriptionResolved = screen.description
    ? resolveTranslatableStaticText(
        screen.description,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''
  const formTitle = screen.fieldsRepeaterFormTitle
    ? resolveTranslatableStaticText(
        screen.fieldsRepeaterFormTitle,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''
  const addLabel = screen.fieldsRepeaterAddItemButtonText
    ? resolveTranslatableStaticText(
        screen.fieldsRepeaterAddItemButtonText,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : formatMessage(coreMessages.buttonAdd)

  if (formChildren.length === 0) {
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
        <Text variant="small">{mainTitle || screen.id}</Text>
      </Box>
    )
  }

  return (
    <Box key={key} marginBottom={2} {...layout}>
      {mainTitle.trim() !== '' && (
        <Text
          as="h2"
          variant="h2"
          marginTop={1}
          marginBottom={1}
        >
          {mainTitle}
        </Text>
      )}
      {descriptionResolved.length > 0 && (
        <Box marginBottom={3}>
          <Text color="dark400">{descriptionResolved}</Text>
        </Box>
      )}
      <Box
        border="standard"
        borderRadius="standard"
        paddingX={2}
        paddingY={2}
        background="white"
        marginY={1}
      >
        {formTitle.length > 0 && (
          <Text as="h4" variant="h4" marginBottom={2}>
            {formTitle}
          </Text>
        )}
        <GridRow rowGap={[2, 2, 2, 3]}>
          {formChildren.map((child, index) => {
            const span = getTableRepeaterFormFieldSpan(child)
            return (
              <GridColumn
                key={child.id || index}
                span={['1/1', '1/1', '1/1', span]}
                paddingBottom={1}
              >
                <LeafFieldPreview
                  screen={child}
                  resolvePreviewString={resolvePreviewString}
                  formatMessage={formatMessage}
                />
              </GridColumn>
            )
          })}
        </GridRow>
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button
            type="button"
            variant="ghost"
            size="small"
            icon="add"
          >
            {addLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

const TableRepeaterFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
}) => {
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const formChildren = filterPreviewMultiFieldChildren(screen.children)
  const headers = screen.tableRepeaterColumnHeaders ?? []

  const mainTitle = resolveTranslatableStaticText(
    screen.title,
    screen.messageDescriptors,
    resolvePreviewString,
  )
  const descriptionResolved = screen.description
    ? resolveTranslatableStaticText(
        screen.description,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  const formTitle = screen.tableRepeaterFormTitle
    ? resolveTranslatableStaticText(
        screen.tableRepeaterFormTitle,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
    : ''

  const resolveOrCore = (staticText: string | null | undefined, coreMsg: { id: string; defaultMessage?: string | null }) => {
    if (staticText) {
      const s = resolveTranslatableStaticText(
        staticText,
        screen.messageDescriptors,
        resolvePreviewString,
      ).trim()
      if (s) return s
    }
    return formatMessage(coreMsg)
  }

  const cancelLabel = resolveOrCore(
    screen.tableRepeaterCancelButtonText,
    coreMessages.buttonCancel,
  )
  const saveLabel = resolveOrCore(
    screen.tableRepeaterSaveItemButtonText,
    coreMessages.reviewButtonSubmit,
  )

  const hasStructuredPreview =
    headers.length > 0 || formChildren.length > 0

  if (!hasStructuredPreview) {
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
        <Text variant="small">
          {mainTitle || resolvePreviewLabel(screen, resolvePreviewString)}
        </Text>
      </Box>
    )
  }

  return (
    <Box key={key} {...layout}>
      {mainTitle.trim() !== '' && (
        <Text variant="h4" marginBottom={2}>
          {mainTitle}
        </Text>
      )}
      {descriptionResolved.length > 0 && (
        <Box marginBottom={3}>
          <Text color="dark400">{descriptionResolved}</Text>
        </Box>
      )}

      <Stack space={4}>
        {headers.length > 0 && (
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData />
                {headers.map((d, i) => (
                  <T.HeadData key={`${d.id}-${i}`}>
                    {resolvePreviewString(d.id, d.defaultMessage)}
                  </T.HeadData>
                ))}
              </T.Row>
            </T.Head>
            <T.Body>
              <T.Row>
                <T.Data />
                {headers.map((d, i) => (
                  <T.Data key={`ph-${d.id}-${i}`}>
                    <Text color="dark300" variant="small">
                      —
                    </Text>
                  </T.Data>
                ))}
              </T.Row>
            </T.Body>
          </T.Table>
        )}

        {formChildren.length > 0 && (
          <Stack space={2}>
            {formTitle.length > 0 && (
              <Text variant="h4">{formTitle}</Text>
            )}
            <GridRow rowGap={[2, 2, 2, 3]}>
              {formChildren.map((child, index) => {
                const span = getTableRepeaterFormFieldSpan(child)
                const isLast = index === formChildren.length - 1
                return (
                  <GridColumn
                    key={child.id || index}
                    span={['1/1', '1/1', '1/1', span]}
                    paddingBottom={isLast ? 0 : 1}
                  >
                    <LeafFieldPreview
                      screen={child}
                      resolvePreviewString={resolvePreviewString}
                      formatMessage={formatMessage}
                    />
                  </GridColumn>
                )
              })}
            </GridRow>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flexEnd"
            >
              <Button variant="ghost" type="button" size="small">
                {cancelLabel}
              </Button>
              <Box marginLeft={2}>
                <Button type="button" size="small">
                  {saveLabel}
                </Button>
              </Box>
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

const previewStringUsesMarkdown = (
  screenType: string,
  messageId: string,
): boolean =>
  isMarkdownMessageId(messageId) ||
  TEXT_DISPLAY_TYPES_ALWAYS_MARKDOWN.has(screenType)

const TextDisplayPreviewNodes = ({
  screen,
  resolvePreviewString,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
}): ReactNode => {
  if (screen.messageDescriptors.length > 0) {
    const resolvedParts = screen.messageDescriptors
      .map((d) => ({
        id: d.id,
        text: resolvePreviewString(d.id, d.defaultMessage).trim(),
      }))
      .filter((p) => p.text.length > 0)

    if (resolvedParts.length > 0) {
      return (
        <Box>
          {resolvedParts.map((p, i) =>
            previewStringUsesMarkdown(screen.type, p.id) ? (
              <Box key={p.id} marginTop={i > 0 ? 2 : 0}>
                <Markdown>{p.text}</Markdown>
              </Box>
            ) : (
              <Text
                key={p.id}
                as="div"
                whiteSpace="preLine"
                marginTop={i > 0 ? 2 : 0}
              >
                {p.text}
              </Text>
            ),
          )}
        </Box>
      )
    }
  }
  const fallback = screen.title ?? screen.description ?? screen.id
  return (
    <Text as="div" whiteSpace="preLine">
      {fallback}
    </Text>
  )
}

const LeafFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
  showValidationErrors,
  validationDescriptorsByPath,
  focusedFieldId,
  fieldErrorOverrides,
  previewFieldValues,
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
  showValidationErrors?: boolean
  validationDescriptorsByPath?: Record<string, ValidationMessageDescriptor[]>
  focusedFieldId?: string | null
  fieldErrorOverrides?: Set<string>
  previewFieldValues?: Record<string, string>
}) => {
  if (PREVIEW_EXCLUDED_FIELD_TYPES.has(screen.type)) {
    return null
  }

  const label = resolvePreviewLabel(screen, resolvePreviewString)
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)
  const isFocused = focusedFieldId != null && screen.id === focusedFieldId
  const hasErrorOverride = fieldErrorOverrides?.has(screen.id) === true

  const fieldErrorMessage = (() => {
    if (hasErrorOverride) {
      const descriptors = validationDescriptorsByPath?.[screen.id]
      if (descriptors && descriptors.length > 0) {
        return resolvePreviewString(descriptors[0].id, descriptors[0].defaultMessage)
      }
      return formatMessage(coreErrorMessages.defaultError)
    }
    if (!showValidationErrors || !validationDescriptorsByPath) return undefined
    const descriptors = validationDescriptorsByPath[screen.id]
    if (!descriptors || descriptors.length === 0) return undefined
    const d = descriptors[0]
    return resolvePreviewString(d.id, d.defaultMessage)
  })()

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
      />
    )
  }

  if (screen.type === 'FIELDS_REPEATER') {
    return (
      <FieldsRepeaterFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
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
    return (
      <Box key={key} {...layout}>
        <Box paddingTop={2}>
          <Input
            label={label}
            name={key}
            placeholder={label}
            readOnly
            value={inputPreviewValue ?? ''}
            hasError={!!fieldErrorMessage}
            errorMessage={fieldErrorMessage}
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
        />
      </Box>
    )
  }

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
      : label.trim() || formatMessage(coreDefaultFieldMessages.defaultFileUploadHeader)

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

  if (screen.type === 'SUBMIT') {
    return (
      <Box key={key} {...layout}>
        <Button size="small">{label}</Button>
      </Box>
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

export interface TranslationWorkspaceFieldPreviewProps {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
  showValidationErrors?: boolean
  validationDescriptorsByPath?: Record<string, ValidationMessageDescriptor[]>
  focusedFieldId?: string | null
  fieldErrorOverrides?: Set<string>
  previewFieldValues?: Record<string, string>
}

/**
 * Renders a screen matching the real application form layout.
 * MULTI_FIELD screens use GridRow/GridColumn with width-based spans.
 */
export const TranslationWorkspaceFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
  showValidationErrors,
  validationDescriptorsByPath,
  focusedFieldId,
  fieldErrorOverrides,
  previewFieldValues,
}: TranslationWorkspaceFieldPreviewProps) => {
  if (screen.type === 'MULTI_FIELD') {
    const space = (screen.space ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const previewChildren = filterPreviewMultiFieldChildren(screen.children)
    return (
      <Box key={screen.id}>
        {screen.description && (
          <Box marginBottom={3} component="div">
            <Markdown>
              {resolveTranslatableStaticText(
                screen.description,
                screen.messageDescriptors,
                resolvePreviewString,
              )}
            </Markdown>
          </Box>
        )}
        <Box width="full" marginTop={screen.description ? 3 : 4} />
        <GridRow>
          {previewChildren.map((child, index) => {
            const isHalfColumn =
              !HALF_WIDTH_IGNORED_TYPES.has(child.type) &&
              child.width === 'half'
            const span = isHalfColumn ? '1/2' : '1/1'
            const isLast = index === previewChildren.length - 1
            const childIsFocused =
              focusedFieldId != null && child.id === focusedFieldId
            return (
              <GridColumn
                key={child.id || index}
                span={['1/1', '1/1', '1/1', span]}
                paddingBottom={isLast ? 0 : space}
              >
                <Box className={childIsFocused ? focusedFieldHighlight : undefined}>
                  <LeafFieldPreview
                    screen={child}
                    resolvePreviewString={resolvePreviewString}
                    formatMessage={formatMessage}
                    showValidationErrors={showValidationErrors}
                    validationDescriptorsByPath={validationDescriptorsByPath}
                    focusedFieldId={focusedFieldId}
                    fieldErrorOverrides={fieldErrorOverrides}
                    previewFieldValues={previewFieldValues}
                  />
                </Box>
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    )
  }

  const isFocused =
    focusedFieldId != null && screen.id === focusedFieldId

  return (
    <Box className={isFocused ? focusedFieldHighlight : undefined}>
      <LeafFieldPreview
        screen={screen}
        resolvePreviewString={resolvePreviewString}
        formatMessage={formatMessage}
        showValidationErrors={showValidationErrors}
        validationDescriptorsByPath={validationDescriptorsByPath}
        focusedFieldId={focusedFieldId}
        fieldErrorOverrides={fieldErrorOverrides}
        previewFieldValues={previewFieldValues}
      />
    </Box>
  )
}
