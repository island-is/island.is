import {
  Box,
  Text,
  GridRow,
  GridColumn,
  Button,
  Table as T,
  Stack,
} from '@island.is/island-ui/core'
import { coreMessages } from '@island.is/application/core'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { filterPreviewMultiFieldChildren } from '../../utils/translationWorkspaceMultiFieldChildren'
import { getTableRepeaterFormFieldSpan } from './translationWorkspaceFieldPreviewUtils'
import { LeafFieldPreview } from './LeafFieldPreview'
import type { FieldPreviewWithFormatMessageProps } from './types'

export const TableRepeaterFieldPreview = ({
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
}: FieldPreviewWithFormatMessageProps) => {
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

  const resolveOrCore = (
    staticText: string | null | undefined,
    coreMsg: { id: string; defaultMessage?: string | null },
  ) => {
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

  const hasStructuredPreview = headers.length > 0 || formChildren.length > 0

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
            {formTitle.length > 0 && <Text variant="h4">{formTitle}</Text>}
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
                      showValidationErrors={showValidationErrors}
                      validationDescriptorsByPath={validationDescriptorsByPath}
                      focusedFieldId={focusedFieldId}
                      fieldErrorOverrides={fieldErrorOverrides}
                      previewFieldValues={previewFieldValues}
                      previewFields={previewFields}
                      previewApplication={previewApplication}
                    />
                  </GridColumn>
                )
              })}
            </GridRow>
            <Box display="flex" alignItems="center" justifyContent="flexEnd">
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
