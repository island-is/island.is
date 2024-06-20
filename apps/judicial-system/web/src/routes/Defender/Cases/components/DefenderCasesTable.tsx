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

import { strings } from './DefenderCasesTable.string'
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
                    {column.postponedIndefinitelyExplanation ? (
                      <Text>{formatMessage(strings.postponed)}</Text>
                    ) : (
                      column.courtDate && (
                        <>
                          <Text>
                            <Box
                              component="span"
                              className={styles.blockColumn}
                            >
                              {capitalize(
                                format(
                                  parseISO(column.courtDate),
                                  'EEEE d. LLLL y',
                                  {
                                    locale: localeIS,
                                  },
                                ),
                              ).replace('dagur', 'd.')}
                            </Box>
                          </Text>
                          <Text as="span" variant="small">
                            kl. {format(parseISO(column.courtDate), 'kk:mm')}
                          </Text>
                        </>
                      )
                    )}
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
