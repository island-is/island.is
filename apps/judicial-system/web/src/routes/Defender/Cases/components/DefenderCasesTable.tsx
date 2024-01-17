import React from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import parseISO from 'date-fns/parseISO'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  TagAppealState,
  TagCaseState,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CreatedDate,
  DefendantInfo,
  getDurationDate,
  SortButton,
  TableSkeleton,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCaseList,
  useSortCases,
} from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from './DefenderCasesTable.css'

interface Props {
  cases: CaseListEntry[]
  showingCompletedCases?: boolean
  loading?: boolean
}

export const DefenderCasesTable: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { formatMessage } = useIntl()
  const { cases, showingCompletedCases, loading } = props
  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } =
    useSortCases('createdAt', 'descending', cases)
  const { isOpeningCaseId, LoadingIndicator, showLoading, handleOpenCase } =
    useCaseList()

  return (
    <Box marginBottom={7}>
      {loading ? (
        <TableSkeleton />
      ) : (
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
                  title={capitalize(
                    formatMessage(core.defendant, { suffix: 'i' }),
                  )}
                  onClick={() => requestSort('defendant')}
                  sortAsc={getClassNamesFor('defendant') === 'ascending'}
                  sortDes={getClassNamesFor('defendant') === 'descending'}
                  isActive={isActiveColumn('defendant')}
                  dataTestid="accusedNameSortButton"
                />
              </th>
              <th className={styles.th}>
                <Text as="span" fontWeight="regular">
                  {formatMessage(tables.type)}
                </Text>
              </th>
              <th className={styles.th}>
                <SortButton
                  title={capitalize(
                    formatMessage(tables.created, { suffix: 'i' }),
                  )}
                  onClick={() => requestSort('createdAt')}
                  sortAsc={getClassNamesFor('createdAt') === 'ascending'}
                  sortDes={getClassNamesFor('createdAt') === 'descending'}
                  isActive={isActiveColumn('createdAt')}
                />
              </th>
              <th className={cn(styles.th, styles.largeColumn)}>
                <Text as="span" fontWeight="regular">
                  {formatMessage(tables.state)}
                </Text>
              </th>
              {showingCompletedCases ? (
                <th>
                  <Text fontWeight="regular">
                    {formatMessage(tables.duration)}
                  </Text>
                </th>
              ) : (
                <th>
                  <Text fontWeight="regular">
                    {formatMessage(tables.hearingArrangementDate)}
                  </Text>
                </th>
              )}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((c: CaseListEntry) => (
              <tr
                className={cn(styles.tableRowContainer)}
                key={c.id}
                onClick={() => handleOpenCase(c.id)}
              >
                <td className={styles.td}>
                  <CourtCaseNumber
                    courtCaseNumber={c.courtCaseNumber}
                    policeCaseNumbers={c.policeCaseNumbers}
                    appealCaseNumber={c.appealCaseNumber}
                  />
                </td>
                <td className={cn(styles.td)}>
                  <DefendantInfo defendants={c.defendants} />
                </td>
                <td className={styles.td}>
                  <ColumnCaseType
                    type={c.type}
                    decision={c.decision}
                    parentCaseId={c.parentCaseId}
                  />
                </td>
                <td className={cn(styles.td)}>
                  <CreatedDate created={c.created} />
                </td>
                <td className={styles.td} data-testid="tdTag">
                  <Box marginRight={1} marginBottom={1}>
                    <TagCaseState
                      caseState={c.state}
                      caseType={c.type}
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
                {showingCompletedCases ? (
                  <td className={styles.td}>
                    <Text>
                      {getDurationDate(
                        c.state,
                        c.validToDate,
                        c.initialRulingDate,
                        c.rulingDate,
                      )}
                    </Text>
                  </td>
                ) : (
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
                )}
                <td>
                  <AnimatePresence>
                    {isOpeningCaseId === c.id && showLoading && (
                      <LoadingIndicator />
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  )
}

export default DefenderCasesTable
