import { Block, Document } from '@contentful/rich-text-types'

import { Table as T, Text } from '@island.is/island-ui/core'
import { TableSlice as TableSliceSchema } from '@island.is/web/graphql/schema'

import {
  extractTableRowsFromRichTextDocument,
  extractTextFromRichTextTableCell,
  isHeaderRow,
} from './utils'

interface TableSliceProps {
  slice: TableSliceSchema
}

export const TableSlice = ({ slice }: TableSliceProps) => {
  const rows = extractTableRowsFromRichTextDocument(
    slice.tableContent as Document,
  )
  const isFirstRowAHeader = isHeaderRow(rows[0])

  return (
    <T.Table>
      {rows.length > 0 && isFirstRowAHeader && (
        <T.Head>
          {rows[0].content?.map((cell, index) => (
            <T.HeadData key={index}>
              <Text>{extractTextFromRichTextTableCell(cell as Block)}</Text>
            </T.HeadData>
          ))}
        </T.Head>
      )}

      <T.Body>
        {rows.slice(isFirstRowAHeader ? 1 : 0).map((row, rowIndex) => (
          <T.Row key={rowIndex}>
            {row.content.map((cell, cellIndex) => (
              <T.Data key={cellIndex}>
                <Text>{extractTextFromRichTextTableCell(cell as Block)}</Text>
              </T.Data>
            ))}
          </T.Row>
        ))}
      </T.Body>
    </T.Table>
  )
}
