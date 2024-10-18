import { FC, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  isDistrictCourtUser,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  CaseTag,
  ContextMenu,
  getIndictmentCaseStateTag,
  TagAppealState,
  TagCaseState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CreatedDate,
  DefendantInfo,
  DurationDate,
  getDurationDate,
  SortButton,
  TableContainer,
  TableHeaderText,
} from '@island.is/judicial-system-web/src/components/Table'
import {
  Case,
  CaseListEntry,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCaseList,
  useSort,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'

import WithdrawAppealContextMenuModal, {
  useWithdrawAppealMenuOption,
} from '../../ContextMenu/ContextMenuOptions/WithdrawAppealMenuOption'
import IconButton from '../../IconButton/IconButton'
import MobilePastCase from './MobilePastCase'
import { contextMenu } from '../../ContextMenu/ContextMenu.strings'
import * as styles from '../Table.css'

interface Props {
  cases: CaseListEntry[]
  loading?: boolean
  testid?: string
}

const PastCasesTable: FC<Props> = ({ cases, loading = false, testid }) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()

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

  const {
    withdrawAppealMenuOption,
    caseToWithdraw,
    setCaseToWithdraw,
    shouldDisplayWithdrawAppealOption,
  } = useWithdrawAppealMenuOption()

  const pastCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        (b['created'] ?? '').localeCompare(a['created'] ?? ''),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {pastCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.id}>
          <MobilePastCase
            theCase={theCase}
            onClick={() => handleOpenCase(theCase.id)}
            isCourtRole={false}
            isLoading={isOpeningCaseId === theCase.id && showLoading}
          >
            <DurationDate
              key={`${theCase.id}-duration-date`}
              date={getDurationDate(
                theCase.state,
                theCase.validToDate,
                theCase.initialRulingDate,
                theCase.rulingDate,
              )}
            />
          </MobilePastCase>
        </Box>
      ))}
    </>
  ) : (
    <>
      <TableContainer
        loading={loading}
        testid={testid}
        tableHeader={
          <>
            <TableHeaderText title={formatMessage(tables.caseNumber)} />
            <th className={cn(styles.th, styles.largeColumn)}>
              <SortButton
                title={capitalize(
                  formatMessage(core.defendant, { suffix: 'i' }),
                )}
                onClick={() => requestSort('defendants')}
                sortAsc={getClassNamesFor('defendants') === 'ascending'}
                sortDes={getClassNamesFor('defendants') === 'descending'}
                isActive={isActiveColumn('defendants')}
              />
            </th>
            <TableHeaderText title={formatMessage(tables.type)} />
            <th className={cn(styles.th, styles.largeColumn)}>
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
            <TableHeaderText title={formatMessage(tables.state)} />
            <TableHeaderText title={formatMessage(tables.duration)} />
            <th></th>
          </>
        }
      >
        {sortedData.map((column) => {
          const indictmentCaseTag = isIndictmentCase(column.type)
            ? getIndictmentCaseStateTag(column as Case, user)
            : null

          return (
            <tr
              className={styles.row}
              onClick={() => handleOpenCase(column.id)}
              key={column.id}
            >
              <td>
                <CourtCaseNumber
                  courtCaseNumber={column.courtCaseNumber}
                  policeCaseNumbers={column.policeCaseNumbers}
                  appealCaseNumber={column.appealCaseNumber}
                />
              </td>
              <td className={styles.largeColumn}>
                <DefendantInfo defendants={column.defendants} />
              </td>
              <td>
                <ColumnCaseType
                  type={column.type}
                  decision={column?.decision}
                  parentCaseId={column.parentCaseId}
                />
              </td>
              <td>
                <CreatedDate created={column.created} />
              </td>
              <td>
                <Box
                  marginRight={column.appealState ? 1 : 0}
                  marginBottom={column.appealState ? 1 : 0}
                >
                  {indictmentCaseTag ? (
                    <CaseTag
                      color={indictmentCaseTag.color}
                      text={formatMessage(indictmentCaseTag.text)}
                    />
                  ) : (
                    <TagCaseState
                      caseState={column.state}
                      caseType={column.type}
                      isCourtRole={isDistrictCourtUser(user)}
                      isValidToDateInThePast={column.isValidToDateInThePast}
                      indictmentRulingDecision={column.indictmentRulingDecision}
                      indictmentDecision={column.indictmentDecision}
                    />
                  )}
                </Box>
                {column.appealState && (
                  <TagAppealState
                    appealState={column.appealState}
                    appealRulingDecision={column.appealRulingDecision}
                  />
                )}
              </td>
              <td>
                <Text>
                  {getDurationDate(
                    column.state,
                    column.validToDate,
                    column.initialRulingDate,
                    column.rulingDate,
                  )}
                </Text>
              </td>
              <td className={styles.loadingContainer}>
                {showLoading ? (
                  <AnimatePresence>
                    {isOpeningCaseId === column.id && showLoading && (
                      <LoadingIndicator />
                    )}
                  </AnimatePresence>
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
              </td>
            </tr>
          )
        })}
      </TableContainer>
      {caseToWithdraw && (
        <WithdrawAppealContextMenuModal
          caseId={caseToWithdraw}
          cases={cases}
          onClose={() => setCaseToWithdraw(undefined)}
        />
      )}
    </>
  )
}

export default PastCasesTable
