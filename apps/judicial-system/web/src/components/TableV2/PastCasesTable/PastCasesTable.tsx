import React from 'react'
import cn from 'classnames'

import { Box, Icon, Text } from '@island.is/island-ui/core'

import * as styles from '../Table.css'
import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import { useIntl } from 'react-intl'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDOB,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages/Core'
import {
  CaseListEntry,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { useSortCases } from '@island.is/judicial-system-web/src/utils/hooks'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'
import TagAppealState from '../../TagAppealState/TagAppealState'
import SortButton from '../SortButton/SortButton'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
}

const PastCasesTable: React.FC<Props> = (props) => {
  const { cases, onRowClick } = props
  const { formatMessage } = useIntl()

  const { sortedData, requestSort, getClassNamesFor } = useSortCases(
    'createdAt',
    'descending',
    cases,
  )

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(tables.caseNumber)}
            </Text>
          </th>
          <th className={cn(styles.th, styles.largeColumn)}>
            <SortButton
              title={capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
              onClick={() => requestSort('defendant')}
              sortAsc={getClassNamesFor('defendant') === 'ascending'}
              sortDes={getClassNamesFor('defendant') === 'descending'}
            />
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(tables.type)}
            </Text>
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(tables.state)}
            </Text>
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(tables.duration)}
            </Text>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((column) => {
          return (
            <tr className={styles.row} onClick={() => onRowClick(column.id)}>
              <td>
                {column.appealCaseNumber ? (
                  <Box display="flex" flexDirection="column">
                    <Text as="span" variant="small">
                      {column.appealCaseNumber}
                    </Text>
                    <Text as="span" variant="small">
                      {column.courtCaseNumber}
                    </Text>
                    <Text as="span" variant="small">
                      {displayFirstPlusRemaining(column.policeCaseNumbers)}
                    </Text>
                  </Box>
                ) : (
                  <Box display="flex" flexDirection="column">
                    <Text as="span">{column.courtCaseNumber}</Text>
                    <Text as="span" variant="small">
                      {displayFirstPlusRemaining(column.policeCaseNumbers)}
                    </Text>
                  </Box>
                )}
              </td>
              <td className={cn(styles.td, styles.largeColumn)}>
                {column.defendants && column.defendants.length > 0 ? (
                  <>
                    <Text>
                      <Box component="span" className={styles.blockColumn}>
                        {column.defendants[0].name ?? '-'}
                      </Box>
                    </Text>
                    {column.defendants.length === 1 ? (
                      (!column.defendants[0].noNationalId ||
                        column.defendants[0].nationalId) && (
                        <Text>
                          <Text as="span" variant="small" color="dark400">
                            {formatDOB(
                              column.defendants[0].nationalId,
                              column.defendants[0].noNationalId,
                            )}
                          </Text>
                        </Text>
                      )
                    ) : (
                      <Text as="span" variant="small" color="dark400">
                        {`+ ${column.defendants.length - 1}`}
                      </Text>
                    )}
                  </>
                ) : (
                  <Text>-</Text>
                )}
              </td>
              <td>
                <Box component="span" display="flex" flexDirection="column">
                  <Text as="span">
                    {displayCaseType(
                      formatMessage,
                      column.type,
                      column.decision,
                    )}
                  </Text>
                  {column.parentCaseId && (
                    <Text as="span" variant="small" color="dark400">
                      Framlenging
                    </Text>
                  )}
                </Box>
              </td>
              <td>
                <TagAppealState appealState={column.appealState} />
              </td>
              <td>
                {!isRestrictionCase(column.type) ? null : (
                  <Text>
                    {formatDate(column.courtEndTime, 'd.M.y')} -
                    {formatDate(column.validToDate, 'd.M.y')}
                  </Text>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default PastCasesTable
