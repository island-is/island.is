import React, { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import localeIS from 'date-fns/locale/is'
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

import { Box, Text, Tag, Icon, Button } from '@island.is/island-ui/core'
import { CaseState, UserRole } from '@island.is/judicial-system/types'
import { insertAt } from '@island.is/judicial-system-web/src/utils/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  directionType,
  sortableTableColumn,
  SortConfig,
} from '@island.is/judicial-system-web/src/types'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import { core, requests } from '@island.is/judicial-system-web/messages'
import type { Case } from '@island.is/judicial-system/types'

import { mapCaseStateToTagVariant } from './utils'
import * as styles from './Requests.css'

interface Props {
  cases: Case[]
  onRowClick: (id: string) => void
  onDeleteCase?: (caseToDelete: Case) => Promise<void>
}

const ActiveRequests: React.FC<Props> = (props) => {
  const { cases, onRowClick, onDeleteCase } = props

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const isProsecutor = user?.role === UserRole.PROSECUTOR
  const isCourtRole =
    user?.role === UserRole.JUDGE || user?.role === UserRole.REGISTRAR

  const [sortConfig, setSortConfig] = useState<SortConfig>()
  // The index of requset that's about to be removed
  const [requestToRemoveIndex, setRequestToRemoveIndex] = useState<number>()

  useMemo(() => {
    const sortedCases = cases ?? []

    if (sortConfig) {
      sortedCases.sort((a: Case, b: Case) => {
        // Credit: https://stackoverflow.com/a/51169
        return sortConfig.direction === 'ascending'
          ? (sortConfig.column === 'defendant' && a.defendants
              ? a.defendants[0].name || ''
              : '' + a['created']
            ).localeCompare(
              sortConfig.column === 'defendant' && b.defendants
                ? b.defendants[0].name || ''
                : '' + b['created'],
            )
          : (sortConfig.column === 'defendant' && b.defendants
              ? b.defendants[0].name || ''
              : '' + b['created']
            ).localeCompare(
              sortConfig.column === 'defendant' && a.defendants
                ? a.defendants[0].name || ''
                : '' + a['created'],
            )
      })
    }
    return sortedCases
  }, [cases, sortConfig])

  const requestSort = (column: sortableTableColumn) => {
    let d: directionType = 'ascending'

    if (
      sortConfig &&
      sortConfig.column === column &&
      sortConfig.direction === 'ascending'
    ) {
      d = 'descending'
    }
    setSortConfig({ column, direction: d })
  }

  const getClassNamesFor = (name: sortableTableColumn) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.column === name ? sortConfig.direction : undefined
  }

  return (
    <table
      className={styles.table}
      data-testid="custody-request-table"
      aria-describedby="activeRequestsTableCaption"
    >
      <thead className={styles.thead}>
        <tr>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(
                requests.sections.activeRequests.table.headers.caseNumber,
              )}
            </Text>
          </th>
          <th className={cn(styles.th, styles.largeColumn)}>
            <Box
              component="button"
              display="flex"
              alignItems="center"
              className={styles.thButton}
              onClick={() => requestSort('defendant')}
              data-testid="accusedNameSortButton"
            >
              <Text fontWeight="regular">
                {formatMessage(core.defendant, { suffix: 'i' })}
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
              {formatMessage(
                requests.sections.activeRequests.table.headers.type,
              )}
            </Text>
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(
                requests.sections.activeRequests.table.headers.state,
              )}
            </Text>
          </th>
          <th className={styles.th}>
            <Box
              component="button"
              display="flex"
              alignItems="center"
              className={styles.thButton}
              onClick={() => requestSort('createdAt')}
            >
              <Text fontWeight="regular">
                {formatMessage(
                  requests.sections.activeRequests.table.headers.created,
                )}
              </Text>
              <Box
                className={cn(styles.sortIcon, {
                  [styles.sortCreatedAsc]:
                    getClassNamesFor('createdAt') === 'ascending',
                  [styles.sortCreatedDes]:
                    getClassNamesFor('createdAt') === 'descending',
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        {cases.map((c, i) => (
          <tr
            key={i}
            className={cn(
              styles.tableRowContainer,
              requestToRemoveIndex === i && 'isDeleting',
            )}
            data-testid="custody-requests-table-row"
            role="button"
            aria-label="Opna kröfu"
            onClick={() => {
              user?.role && onRowClick(c.id)
            }}
          >
            <td className={styles.td}>
              {c.courtCaseNumber ? (
                <>
                  <Box component="span" className={styles.blockColumn}>
                    <Text as="span">{c.courtCaseNumber}</Text>
                  </Box>
                  <Text as="span" variant="small" color="dark400">
                    {c.policeCaseNumber}
                  </Text>
                </>
              ) : (
                <Text as="span">{c.policeCaseNumber || '-'}</Text>
              )}
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              {c.defendants && c.defendants.length > 0 ? (
                <>
                  <Text>
                    <Box component="span" className={styles.blockColumn}>
                      {c.defendants[0].name ?? '-'}
                    </Box>
                  </Text>
                  {c.defendants.length === 1 ? (
                    <Text>
                      <Text as="span" variant="small" color="dark400">
                        {`kt. ${
                          insertAt(
                            c.defendants[0].nationalId.replace('-', ''),
                            '-',
                            6,
                          ) || '-'
                        }`}
                      </Text>
                    </Text>
                  ) : (
                    <Text as="span" variant="small" color="dark400">
                      {`+ ${c.defendants.length - 1}`}
                    </Text>
                  )}
                </>
              ) : (
                <Text>-</Text>
              )}
            </td>
            <td className={styles.td}>
              <Box component="span" display="flex" flexDirection="column">
                <Text as="span">{capitalize(caseTypes[c.type])}</Text>
                {c.parentCase && (
                  <Text as="span" variant="small" color="dark400">
                    Framlenging
                  </Text>
                )}
              </Box>
            </td>
            <td className={styles.td} data-testid="tdTag">
              <Tag
                variant={
                  mapCaseStateToTagVariant(
                    c.state,
                    isCourtRole,
                    c.isValidToDateInThePast,
                  ).color
                }
                outlined
                disabled
              >
                {
                  mapCaseStateToTagVariant(
                    c.state,
                    isCourtRole,
                    c.isValidToDateInThePast,
                  ).text
                }
              </Tag>
            </td>
            <td className={styles.td}>
              <Text as="span">
                {format(parseISO(c.created), 'd.M.y', {
                  locale: localeIS,
                })}
              </Text>
            </td>
            <td className={cn(styles.td, 'secondLast')}>
              {isProsecutor &&
                (c.state === CaseState.NEW ||
                  c.state === CaseState.DRAFT ||
                  c.state === CaseState.SUBMITTED ||
                  c.state === CaseState.RECEIVED) && (
                  <Box
                    data-testid="deleteCase"
                    component="button"
                    aria-label="Viltu afturkalla kröfu?"
                    className={styles.deleteButton}
                    onClick={(evt) => {
                      evt.stopPropagation()
                      setRequestToRemoveIndex(
                        requestToRemoveIndex === i ? undefined : i,
                      )
                    }}
                  >
                    <Icon icon="close" color="blue400" />
                  </Box>
                )}
            </td>
            <td
              className={cn(
                styles.deleteButtonContainer,
                styles.td,
                requestToRemoveIndex === i && 'open',
              )}
            >
              <Button
                colorScheme="destructive"
                size="small"
                onClick={(evt) => {
                  evt.stopPropagation()
                  setRequestToRemoveIndex(undefined)
                  onDeleteCase && onDeleteCase(cases[i])
                }}
              >
                <Box as="span" className={styles.deleteButtonText}>
                  Afturkalla
                </Box>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ActiveRequests
