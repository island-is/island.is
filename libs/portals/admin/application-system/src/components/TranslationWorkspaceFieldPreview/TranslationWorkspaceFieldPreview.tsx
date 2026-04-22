import type { ReactNode } from 'react'
import {
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
} from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import { coreMessages } from '@island.is/application/core'
import type {
  PreviewFormatMessage,
  ResolvePreviewString,
  ScreenIntrospection,
} from '../../types/translationWorkspace'
import {
  HALF_WIDTH_IGNORED_TYPES,
  INPUT_FIELD_TYPES,
  noop,
  PLACEHOLDER_TYPES,
  TEXT_DISPLAY_TYPES,
} from '../../utils/translationWorkspaceFieldConstants'
import {
  fieldPreviewLayoutProps,
  isMarkdownMessageId,
  resolvePreviewLabel,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { filterPreviewMultiFieldChildren } from '../../utils/translationWorkspaceMultiFieldChildren'

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
            isMarkdownMessageId(p.id) ? (
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
}: {
  screen: ScreenIntrospection
  resolvePreviewString: ResolvePreviewString
  formatMessage: PreviewFormatMessage
}) => {
  const label = resolvePreviewLabel(screen, resolvePreviewString)
  const key = screen.id
  const layout = fieldPreviewLayoutProps(screen)

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

  if (INPUT_FIELD_TYPES.has(screen.type)) {
    return (
      <Box key={key} {...layout}>
        <Box paddingTop={2}>
          <Input label={label} name={key} placeholder={label} disabled />
        </Box>
      </Box>
    )
  }

  if (screen.type === 'CHECKBOX') {
    return (
      <Box key={key} {...layout}>
        <Checkbox label={label} name={key} onChange={noop} />
      </Box>
    )
  }

  if (screen.type === 'DATE') {
    return (
      <Box key={key} {...layout}>
        <DatePicker
          label={label}
          placeholderText="dd.mm.yyyy"
          handleChange={noop}
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
        <Select label={label} name={key} options={[]} isDisabled />
      </Box>
    )
  }

  if (screen.type === 'RADIO') {
    return (
      <Box key={key} {...layout}>
        <Text variant="small" fontWeight="semiBold" marginBottom={1}>
          {label}
        </Text>
        <Box display="flex" flexDirection="column" rowGap={1}>
          <RadioButton label="Option 1" name={key} value="1" onChange={noop} />
          <RadioButton label="Option 2" name={key} value="2" onChange={noop} />
        </Box>
      </Box>
    )
  }

  if (screen.type === 'FILEUPLOAD') {
    return (
      <Box
        key={key}
        padding={3}
        border="standard"
        borderRadius="large"
        background="white"
        style={{ borderStyle: 'dashed' }}
        {...layout}
      >
        <Text variant="small" color="dark300">
          {label}
        </Text>
        <Text variant="small" color="blue400">
          Upload file
        </Text>
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
}

/**
 * Renders a screen matching the real application form layout.
 * MULTI_FIELD screens use GridRow/GridColumn with width-based spans.
 */
export const TranslationWorkspaceFieldPreview = ({
  screen,
  resolvePreviewString,
  formatMessage,
}: TranslationWorkspaceFieldPreviewProps) => {
  if (screen.type === 'MULTI_FIELD') {
    const space = (screen.space ?? 0) as 0 | 1 | 2 | 3 | 4 | 5 | 6
    const previewChildren = filterPreviewMultiFieldChildren(screen.children)
    return (
      <Box key={screen.id}>
        {screen.description && (
          <Box marginBottom={3}>
            <Text color="dark400">
              {resolveTranslatableStaticText(
                screen.description,
                screen.messageDescriptors,
                resolvePreviewString,
              )}
            </Text>
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
            return (
              <GridColumn
                key={child.id || index}
                span={['1/1', '1/1', '1/1', span]}
                paddingBottom={isLast ? 0 : space}
              >
                <Box>
                  <LeafFieldPreview
                    screen={child}
                    resolvePreviewString={resolvePreviewString}
                    formatMessage={formatMessage}
                  />
                </Box>
              </GridColumn>
            )
          })}
        </GridRow>
      </Box>
    )
  }

  return (
    <LeafFieldPreview
      screen={screen}
      resolvePreviewString={resolvePreviewString}
      formatMessage={formatMessage}
    />
  )
}
