import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  getInitials,
} from '@island.is/judicial-system/formatters'
import { tables } from '@island.is/judicial-system-web/messages'
import {
  SortButton,
  TableContainer,
  TableDate,
  TableHeaderText,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'
import { useSort } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './CaseFileTable.strings'
import * as tableStyles from '../Table.css'
import * as styles from './CaseFileTable.css'

interface Props {
  caseFiles: CaseFile[]
  loading?: boolean
  onOpenFile?: (fileId: string) => void
}

const CaseFileTable: FC<Props> = ({
  caseFiles,
  loading = false,
  onOpenFile,
}) => {
  const { formatMessage } = useIntl()

  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } = useSort(
    'created',
    'descending',
    caseFiles,
    (entry, column) => entry[column] as string | null | undefined,
  )

  const createSortProps = (columnTitle: string, column: keyof CaseFile) => ({
    title: capitalize(columnTitle),
    onClick: () => requestSort(column),
    sortAsc: getClassNamesFor(column) === 'ascending',
    sortDes: getClassNamesFor(column) === 'descending',
    isActive: isActiveColumn(column),
  })

  return (
    <TableContainer
      loading={loading}
      tableHeader={
        <>
          <th className={tableStyles.th}>
            <SortButton
              {...createSortProps(formatMessage(tables.caseFileName), 'name')}
            />
          </th>
          <TableHeaderText title={formatMessage(tables.caseFileDate)} />
          <th className={tableStyles.th}>
            <SortButton
              {...createSortProps(formatMessage(tables.sent), 'created')}
            />
          </th>
        </>
      }
    >
      {sortedData.map((file) => {
        return (
          <tr key={file.id}>
            <td>
              <Box
                onClick={() => onOpenFile?.(file.id)}
                className={styles.linkButton}
              >
                <Text color="blue400" variant="h5">
                  {file.userGeneratedFilename}
                </Text>
              </Box>
            </td>
            <td>
              <TableDate displayDate={file.displayDate ?? file.created} />
            </td>
            <td>
              <Box className={styles.noWrapColumn}>
                <Text>
                  {formatDate(file.created, "dd.MM.yyyy 'kl.' HH:mm")}
                </Text>
                <Text variant="small">
                  {formatMessage(strings.submittedBy, {
                    category: file.category,
                    initials: getInitials(file.submittedBy),
                  })}
                </Text>
              </Box>
            </td>
          </tr>
        )
      })}
    </TableContainer>
  )
}

export default CaseFileTable
