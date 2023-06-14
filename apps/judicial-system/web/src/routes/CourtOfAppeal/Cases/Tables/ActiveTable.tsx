import React, { useMemo, useState } from 'react'
import cn from 'classnames'

import { Box, Icon, Text } from '@island.is/island-ui/core'

import * as styles from './Table.css'
import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import { useIntl } from 'react-intl'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDOB,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages/Core'

import { directionType } from '@island.is/judicial-system-web/src/types'
import { displayCaseType } from '../../../Shared/Cases/utils'
import { TagAppealState } from '@island.is/judicial-system-web/src/components'

interface Props {
  data: any[]
  onRowClick: (id: string) => void
}

type sortableTableColumn = 'defendant' | 'appealedDate'

export interface SortConfig {
  column: sortableTableColumn
  direction: directionType
}

const ActiveTable: React.FC<Props> = (props) => {
  const { data, onRowClick } = props
  const { formatMessage } = useIntl()

  // const { sortedData, requestSort, getClassNamesFor } = useSortCases(
  //   'createdAt',
  //   'descending',
  //   data,
  // )

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'appealedDate',
    direction: 'ascending',
  })

  useMemo(() => {
    if (data && sortConfig) {
      data.sort((a: any, b: any) => {
        // Credit: https://stackoverflow.com/a/51169
        return sortConfig.direction === 'ascending'
          ? (sortConfig.column === 'defendant' &&
            a.defendants &&
            a.defendants.length > 0
              ? a.defendants[0].name ?? ''
              : b['appealedDate'] + a['created']
            ).localeCompare(
              sortConfig.column === 'defendant' &&
                b.defendants &&
                b.defendants.length > 0
                ? b.defendants[0].name ?? ''
                : a['appealedDate'] + b['created'],
            )
          : (sortConfig.column === 'defendant' &&
            b.defendants &&
            b.defendants.length > 0
              ? b.defendants[0].name ?? ''
              : a['appealedDate'] + b['created']
            ).localeCompare(
              sortConfig.column === 'defendant' &&
                a.defendants &&
                a.defendants.length > 0
                ? a.defendants[0].name ?? ''
                : b['appealedDate'] + a['created'],
            )
      })
    }
  }, [data, sortConfig])

  const requestSort = (column: string) => {
    let direction: 'ascending' | 'descending' = 'ascending'

    if (sortConfig.column === column && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }

    setSortConfig({ column, direction })
  }

  const getClassNamesFor = (column: string) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.column === column ? sortConfig.direction : undefined
  }

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
            <Box
              component="button"
              display="flex"
              alignItems="center"
              className={styles.thButton}
              onClick={() => requestSort('defendant')}
            >
              <Text fontWeight="regular">
                {capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
              </Text>
              <Box
                className={cn(styles.sortIcon, {
                  [styles.sortAccusedNameAsc]:
                    getClassNamesFor('defendant') === 'ascending',
                  [styles.sortAccusedNameDes]:
                    getClassNamesFor('defendant') === 'descending',
                })}
                marginLeft={1}
                component="span"
                display="flex"
                alignItems="center"
              >
                <Icon icon="caretDown" size="small" />
              </Box>
            </Box>
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
            <Box
              component="button"
              display="flex"
              alignItems="center"
              className={styles.thButton}
              onClick={() => requestSort('appealedDate')}
            >
              <Text fontWeight="regular">Kært</Text>
              <Box
                className={cn(styles.sortIcon, {
                  [styles.sortCreatedAsc]:
                    getClassNamesFor('appealedDate') === 'ascending',
                  [styles.sortCreatedDes]:
                    getClassNamesFor('appealedDate') === 'descending',
                })}
                marginLeft={1}
                component="span"
                display="flex"
                alignItems="center"
              >
                <Icon icon="caretUp" size="small" />
              </Box>
            </Box>
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
                <TagAppealState
                  appealState={column.appealState}
                  appealRulingDecision={column.appealRulingDecision}
                />
              </td>
              <td>
                <Text>
                  {column.appealedDate
                    ? formatDate(column.appealedDate, 'd.M.y')
                    : '-'}
                </Text>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ActiveTable
