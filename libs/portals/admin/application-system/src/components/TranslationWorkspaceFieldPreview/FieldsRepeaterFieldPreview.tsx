import { Box, Text, GridRow, GridColumn, Button } from '@island.is/island-ui/core'
import { coreMessages } from '@island.is/application/core'
import {
  fieldPreviewLayoutProps,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { filterPreviewMultiFieldChildren } from '../../utils/translationWorkspaceMultiFieldChildren'
import { getTableRepeaterFormFieldSpan } from './translationWorkspaceFieldPreviewUtils'
import { LeafFieldPreview } from './LeafFieldPreview'
import type { FieldPreviewWithFormatMessageProps } from './types'

export const FieldsRepeaterFieldPreview = ({
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
        <Text as="h2" variant="h2" marginTop={1} marginBottom={1}>
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
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button type="button" variant="ghost" size="small" icon="add">
            {addLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
