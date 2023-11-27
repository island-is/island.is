import React, { useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useAnimation,
} from 'framer-motion'

import { Box, Button, Icon, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import {
  CaseState,
  isDistrictCourtUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  TagAppealState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { SortButton } from '@island.is/judicial-system-web/src/components/Table'
import ColumnCaseType from '@island.is/judicial-system-web/src/components/Table/ColumnCaseType/ColumnCaseType'
import TagCaseState from '@island.is/judicial-system-web/src/components/TagCaseState/TagCaseState'
import {
  directionType,
  sortableTableColumn,
  SortConfig,
  TempCaseListEntry as CaseListEntry,
} from '@island.is/judicial-system-web/src/types'
import { useViewport } from '@island.is/judicial-system-web/src/utils/hooks'
import { compareLocaleIS } from '@island.is/judicial-system-web/src/utils/sortHelper'

import MobileCase from './MobileCase'
import { cases as m } from './Cases.strings'
import * as styles from './Cases.css'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
  isDeletingCase: boolean
  onDeleteCase?: (caseToDelete: CaseListEntry) => Promise<void>
}

const ActiveCases: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { cases, onRowClick, isDeletingCase, onDeleteCase } = props

  const controls = useAnimation()

  const variants = {
    isDeleting: (custom: number) =>
      custom === requestToRemoveIndex ? { x: '-150px' } : { x: '0px' },
    isNotDeleting: { x: 0 },
    deleted: { opacity: 0, scale: 0.8 },
  }

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: 'createdAt',
    direction: 'descending',
  })

  // The index of requset that's about to be removed
  const [requestToRemoveIndex, setRequestToRemoveIndex] = useState<number>()

  useMemo(() => {
    if (cases && sortConfig) {
      cases.sort((a: CaseListEntry, b: CaseListEntry) => {
        const getColumnValue = (entry: CaseListEntry) => {
          if (
            sortConfig.column === 'defendant' &&
            entry.defendants &&
            entry.defendants.length > 0
          ) {
            return entry.defendants[0].name ?? ''
          }
          if (sortConfig.column === 'courtDate') {
            return entry.courtDate ?? ''
          }
          return entry.created
        }
        const compareResult = compareLocaleIS(
          getColumnValue(a),
          getColumnValue(b),
        )

        return sortConfig.direction === 'ascending'
          ? compareResult
          : -compareResult
      })
    }
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

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {cases.map((theCase: CaseListEntry) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileCase
            onClick={() => onRowClick(theCase.id)}
            theCase={theCase}
            isCourtRole={isDistrictCourtUser(user)}
          >
            {theCase.courtDate && (
              <Text fontWeight={'medium'} variant="small">
                {`${formatMessage(
                  m.activeRequests.table.headers.hearing,
                )} ${format(parseISO(theCase.courtDate), 'd.M.y')} kl. ${format(
                  parseISO(theCase.courtDate),
                  'kk:mm',
                )}`}
              </Text>
            )}
          </MobileCase>
        </Box>
      ))}
    </>
  ) : (
    <table className={styles.table} data-testid="activeCasesTable">
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
              isActive={sortConfig.column === 'defendant'}
              dataTestid="accusedNameSortButton"
            />
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(m.activeRequests.table.headers.type)}
            </Text>
          </th>
          <th className={styles.th}>
            <SortButton
              title={capitalize(formatMessage(tables.created, { suffix: 'i' }))}
              onClick={() => requestSort('createdAt')}
              sortAsc={getClassNamesFor('createdAt') === 'ascending'}
              sortDes={getClassNamesFor('createdAt') === 'descending'}
              isActive={sortConfig.column === 'createdAt'}
              dataTestid="createdAtSortButton"
            />
          </th>
          <th className={styles.th}>
            <Text as="span" fontWeight="regular">
              {formatMessage(tables.state)}
            </Text>
          </th>
          <th className={styles.th}>
            <SortButton
              title={capitalize(
                formatMessage(m.activeRequests.table.headers.hearing, {
                  suffix: 'i',
                }),
              )}
              onClick={() => requestSort('courtDate')}
              sortAsc={getClassNamesFor('courtDate') === 'ascending'}
              sortDes={getClassNamesFor('courtDate') === 'descending'}
              isActive={sortConfig.column === 'courtDate'}
            />
          </th>
          <th></th>
        </tr>
      </thead>
      <LayoutGroup>
        <tbody>
          <AnimatePresence>
            {cases.map((c, i) => (
              <motion.tr
                key={c.id}
                animate={controls}
                exit="deleted"
                variants={variants}
                custom={i}
                className={cn(styles.tableRowContainer)}
                layout
                data-testid="custody-cases-table-row"
                role="button"
                aria-label="Opna kröfu"
                onClick={() => {
                  user?.role && onRowClick(c.id)
                }}
              >
                <td className={styles.td}>
                  {c.appealCaseNumber ? (
                    <Box display="flex" flexDirection="column">
                      <Text as="span" variant="small">
                        {c.appealCaseNumber}
                      </Text>
                      <Text as="span" variant="small">
                        {c.courtCaseNumber}
                      </Text>
                      <Text as="span" variant="small">
                        {displayFirstPlusRemaining(c.policeCaseNumbers)}
                      </Text>
                    </Box>
                  ) : c.courtCaseNumber ? (
                    <>
                      <Box component="span" className={styles.blockColumn}>
                        <Text as="span">{c.courtCaseNumber}</Text>
                      </Box>
                      <Text
                        as="span"
                        variant="small"
                        color="dark400"
                        title={c.policeCaseNumbers.join(', ')}
                      >
                        {displayFirstPlusRemaining(c.policeCaseNumbers)}
                      </Text>
                    </>
                  ) : (
                    <Text as="span" title={c.policeCaseNumbers.join(', ')}>
                      {displayFirstPlusRemaining(c.policeCaseNumbers) || '-'}
                    </Text>
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
                        (!c.defendants[0].noNationalId ||
                          c.defendants[0].nationalId) && (
                          <Text>
                            <Text as="span" variant="small" color="dark400">
                              {formatDOB(
                                c.defendants[0].nationalId,
                                c.defendants[0].noNationalId,
                              )}
                            </Text>
                          </Text>
                        )
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
                  <ColumnCaseType
                    type={c.type}
                    decision={c?.decision}
                    parentCaseId={c.parentCaseId}
                  />
                </td>
                <td className={styles.td}>
                  <Text as="span">
                    {format(parseISO(c.created), 'd.M.y', {
                      locale: localeIS,
                    })}
                  </Text>
                </td>
                <td className={styles.td} data-testid="tdTag">
                  <Box marginRight={1} marginBottom={1}>
                    <TagCaseState
                      caseState={c.state}
                      caseType={c.type}
                      isCourtRole={isDistrictCourtUser(user)}
                      isValidToDateInThePast={c.isValidToDateInThePast}
                      courtDate={c.courtDate}
                    />
                  </Box>

                  {c.appealState && (
                    <TagAppealState
                      appealState={c.appealState}
                      appealRulingDecision={c.appealRulingDecision}
                    />
                  )}
                </td>
                <td className={styles.td}>
                  {c.courtDate && (
                    <>
                      <Text>
                        <Box component="span" className={styles.blockColumn}>
                          {capitalize(
                            format(parseISO(c.courtDate), 'EEEE d. LLLL y', {
                              locale: localeIS,
                            }),
                          ).replace('dagur', 'd.')}
                        </Box>
                      </Text>
                      <Text as="span" variant="small">
                        kl. {format(parseISO(c.courtDate), 'kk:mm')}
                      </Text>
                    </>
                  )}
                </td>

                <td className={cn(styles.td, 'secondLast')}>
                  {isProsecutionUser(user) &&
                    (c.state === CaseState.NEW ||
                      c.state === CaseState.DRAFT ||
                      c.state === CaseState.SUBMITTED ||
                      c.state === CaseState.RECEIVED) && (
                      <Box
                        data-testid="deleteCase"
                        component="button"
                        aria-label="Viltu afturkalla kröfu?"
                        className={styles.deleteButton}
                        onClick={async (evt) => {
                          evt.stopPropagation()

                          await new Promise((resolve) => {
                            setRequestToRemoveIndex(
                              requestToRemoveIndex === i ? undefined : i,
                            )

                            resolve(true)
                          })

                          await controls.start('isDeleting')
                        }}
                      >
                        <Icon icon="close" color="blue400" />
                      </Box>
                    )}
                </td>
                <td className={cn(styles.deleteButtonContainer, styles.td)}>
                  <Button
                    colorScheme="destructive"
                    size="small"
                    loading={isDeletingCase}
                    onClick={async (evt) => {
                      if (onDeleteCase) {
                        evt.stopPropagation()

                        await onDeleteCase(cases[i])

                        controls.start('isNotDeleting').then(() => {
                          setRequestToRemoveIndex(undefined)
                        })
                      }
                    }}
                  >
                    <Box as="span" className={styles.deleteButtonText}>
                      Afturkalla
                    </Box>
                  </Button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </LayoutGroup>
    </table>
  )
}

export default ActiveCases
