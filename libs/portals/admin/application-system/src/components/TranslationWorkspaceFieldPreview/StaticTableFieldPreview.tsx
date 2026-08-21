import { Box, Text, Table as T } from '@island.is/island-ui/core'
import { Markdown } from '@island.is/shared/components'
import type { MessageDescriptor } from '../../types/translationWorkspace'
import {
  fieldPreviewLayoutProps,
  resolvePreviewLabel,
  resolveTranslatableStaticText,
} from '../../utils/translationWorkspaceStaticText'
import { staticTableTitleVariantToText } from './translationWorkspaceFieldPreviewUtils'
import type { FieldPreviewBaseProps } from './types'

export const StaticTableFieldPreview = ({
  screen,
  resolvePreviewString,
}: FieldPreviewBaseProps) => {
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

  const displayColCount = Math.max(colCount, headerDescriptors.length, 1)

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
