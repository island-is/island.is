import { FieldBaseProps } from '@island.is/application/types'
import { FC, SetStateAction } from 'react'
import { Box, Icon, Table as T } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { examCategories, shared } from '../../lib/messages'
import React from 'react'

type ExamCategoryTableProps = {
  rows: string[][]
  onEdit: React.Dispatch<SetStateAction<number>>
  onDelete: () => void
  hideDelete?: boolean
  hideEdit?: boolean
}

const headers = [
  shared.labels.name,
  shared.labels.ssn,
  examCategories.labels.categoryTableColumn,
]

export const ExamCategoryTable: FC<
  React.PropsWithChildren<FieldBaseProps & ExamCategoryTableProps>
> = ({
  application,
  rows,
  onEdit,
  onDelete,
  hideDelete = false,
  hideEdit = false,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={0} marginBottom={4}>
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData key={`delete`}>{}</T.HeadData>
            {headers.map((cell, index) => (
              <T.HeadData key={`${cell}-${index}`}>
                {formatMessage(cell)}
              </T.HeadData>
            ))}
            <T.HeadData key={`edit`}>{}</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {rows.map((row, rowIndex) => (
            <T.Row key={`row-${rowIndex}`}>
              <T.Data>
                {!hideDelete && (
                  <button type="button" onClick={onDelete}>
                    <Icon
                      icon="trash"
                      color="blue400"
                      type="outline"
                      size="small"
                    />
                  </button>
                )}
              </T.Data>
              {row.map((cell, cellIndex) => (
                <T.Data key={`row-${rowIndex}-cell-${cellIndex}`}>
                  {formatText(cell, application, formatMessage)}
                </T.Data>
              ))}
              <T.Data>
                {!hideEdit && (
                  <button type="button" onClick={() => onEdit(rowIndex)}>
                    <Icon
                      icon="pencil"
                      color="blue400"
                      type="outline"
                      size="small"
                    />
                  </button>
                )}
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    </Box>
  )
}
