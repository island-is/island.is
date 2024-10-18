import { FC } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  ContextMenu,
  TagAppealState,
  TagCaseState,
  useWithdrawAppealMenuOption,
  WithdrawAppealContextMenuModal,
} from '@island.is/judicial-system-web/src/components'
import { contextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu.strings'
import IconButton from '@island.is/judicial-system-web/src/components/IconButton/IconButton'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CourtDate,
  CreatedDate,
  DefendantInfo,
  getDurationDate,
  SortButton,
  TableSkeleton,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCaseList,
  useSort,
} from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from './DefenderCasesTable.css'

interface Props {
  cases: CaseListEntry[]
  showingCompletedCases?: boolean
  loading?: boolean
}

export const DefenderCasesTable: FC<Props> = ({
  cases,
  showingCompletedCases,
  loading,
}) => {
  const { formatMessage } = useIntl()

  const getColumnValue = (
    entry: CaseListEntry,
    column: keyof CaseListEntry,
  ) => {
    if (
      column === 'defendants' &&
      entry.defendants &&
      entry.defendants.length > 0
    ) {
      return entry.defendants[0].name ?? ''
    }
    return entry.created
  }
  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } = useSort(
    'created',
    'descending',
    cases,
    getColumnValue,
  )
  const { isOpeningCaseId, LoadingIndicator, showLoading, handleOpenCase } =
    useCaseList()

  const {
    withdrawAppealMenuOption,
    caseToWithdraw,
    setCaseToWithdraw,
    shouldDisplayWithdrawAppealOption,
  } = useWithdrawAppealMenuOption()

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
                  onClick={() => requestSort('defendants')}
                  sortAsc={getClassNamesFor('defendants') === 'ascending'}
                  sortDes={getClassNamesFor('defendants') === 'descending'}
                  isActive={isActiveColumn('defendants')}
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
                  onClick={() => requestSort('created')}
                  sortAsc={getClassNamesFor('created') === 'ascending'}
                  sortDes={getClassNamesFor('created') === 'descending'}
                  isActive={isActiveColumn('created')}
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
            {sortedData?.map((column: CaseListEntry) => (
              <tr
                className={cn(styles.tableRowContainer)}
                key={column.id}
                onClick={() => handleOpenCase(column.id)}
              >
                <td className={styles.td}>
                  <CourtCaseNumber
                    courtCaseNumber={column.courtCaseNumber}
                    policeCaseNumbers={column.policeCaseNumbers}
                    appealCaseNumber={column.appealCaseNumber}
                  />
                </td>
                <td className={cn(styles.td)}>
                  <DefendantInfo defendants={column.defendants} />
                </td>
                <td className={styles.td}>
                  <ColumnCaseType
                    type={column.type}
                    decision={column.decision}
                    parentCaseId={column.parentCaseId}
                  />
                </td>
                <td className={cn(styles.td)}>
                  <CreatedDate created={column.created} />
                </td>
                <td className={styles.td} data-testid="tdTag">
                  <Box
                    marginRight={column.appealState ? 1 : 0}
                    marginBottom={column.appealState ? 1 : 0}
                  >
                    <TagCaseState
                      caseState={column.state}
                      caseType={column.type}
                      isValidToDateInThePast={column.isValidToDateInThePast}
                      courtDate={column.courtDate}
                      indictmentDecision={column.indictmentDecision}
                      indictmentRulingDecision={column.indictmentRulingDecision}
                    />
                  </Box>
                  {column.appealState && (
                    <TagAppealState
                      appealState={column.appealState}
                      appealRulingDecision={column.appealRulingDecision}
                    />
                  )}
                </td>
                {showingCompletedCases ? (
                  <td className={styles.td}>
                    <Text>
                      {getDurationDate(
                        column.state,
                        column.validToDate,
                        column.initialRulingDate,
                        column.rulingDate,
                      )}
                    </Text>
                  </td>
                ) : (
                  <td className={styles.td}>
                    <CourtDate
                      courtDate={column.courtDate}
                      postponedIndefinitelyExplanation={
                        column.postponedIndefinitelyExplanation
                      }
                      courtSessionType={column.courtSessionType}
                    />
                  </td>
                )}
                <td>
                  <AnimatePresence>
                    {isOpeningCaseId === column.id && showLoading ? (
                      <LoadingIndicator />
                    ) : (
                      <Box>
                        <ContextMenu
                          items={[
                            {
                              title: formatMessage(contextMenu.openInNewTab),
                              onClick: () => handleOpenCase(column.id, true),
                              icon: 'open',
                            },
                            ...(shouldDisplayWithdrawAppealOption(column)
                              ? [withdrawAppealMenuOption(column.id)]
                              : []),
                          ]}
                          menuLabel="Opna valmöguleika á máli"
                          disclosure={
                            <IconButton
                              icon="ellipsisVertical"
                              colorScheme="transparent"
                              onClick={(evt) => {
                                evt.stopPropagation()
                              }}
                              disabled={false}
                            />
                          }
                        />
                      </Box>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {caseToWithdraw && (
        <WithdrawAppealContextMenuModal
          caseId={caseToWithdraw}
          cases={cases}
          onClose={() => setCaseToWithdraw(undefined)}
        />
      )}
    </Box>
  )
}

export default DefenderCasesTable
