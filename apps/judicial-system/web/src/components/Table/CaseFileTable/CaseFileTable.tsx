import { FC } from 'react'
import { useIntl } from 'react-intl'
import { motion } from 'motion/react'

import { Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatDate,
  getInitials,
  getRoleTitleFromCaseFileCategory,
} from '@island.is/judicial-system/formatters'
import { tables } from '@island.is/judicial-system-web/messages'
import { IconButton } from '@island.is/judicial-system-web/src/components'
import {
  SortButton,
  TableContainer,
  TableDate,
  TableHeaderText,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseFile } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useFiledCourtDocuments,
  useSort,
} from '@island.is/judicial-system-web/src/utils/hooks'

import ContextMenu from '../../ContextMenu/ContextMenu'
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
  const { prefixUploadedDocumentNameWithDocumentOrder } =
    useFiledCourtDocuments()
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
              {...createSortProps(formatMessage(tables.received), 'created')}
            />
          </th>
          <th className={tableStyles.th} />
        </>
      }
    >
      {sortedData.map((file) => {
        const initials = getInitials(
          file.fileRepresentative ?? file.submittedBy,
        )

        return (
          <tr key={file.id}>
            <td>
              <Box
                onClick={() => onOpenFile?.(file.id)}
                className={styles.linkButton}
              >
                <Text color="blue400" variant="h5">
                  {prefixUploadedDocumentNameWithDocumentOrder(
                    file.id,
                    file.userGeneratedFilename ?? '',
                  )}
                </Text>
              </Box>
            </td>
            <td>
              <TableDate displayDate={file.displayDate ?? file.created} />
            </td>
            <td>
              <Box className={styles.noWrapColumn}>
                <Text>
                  {file.fileRepresentative
                    ? formatDate(file.submissionDate || file.created)
                    : formatDate(file.created, "dd.MM.yyyy 'kl.' HH:mm")}
                </Text>
                <Text variant="small">
                  {`${getRoleTitleFromCaseFileCategory(
                    file.category ?? null,
                  )} ${initials ? `(${initials})` : ''} ${
                    file.fileRepresentative ? 'lagði fram' : 'sendi inn'
                  }`}
                </Text>
              </Box>
            </td>
            <td>
              <ContextMenu
                items={[]}
                render={
                  <motion.div
                    className={tableStyles.smallContainer}
                    key={file.id}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1, y: 1 }}
                    exit={{ opacity: 0, y: 5 }}
                    onClick={(evt) => evt.stopPropagation()}
                  >
                    <IconButton
                      icon="ellipsisVertical"
                      colorScheme="transparent"
                    />
                  </motion.div>
                }
              />
            </td>
          </tr>
        )
      })}
    </TableContainer>
  )
}

export default CaseFileTable
