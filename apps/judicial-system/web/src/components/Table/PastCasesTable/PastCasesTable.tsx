import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { capitalize } from '@island.is/judicial-system/formatters'
import { isDistrictCourtUser } from '@island.is/judicial-system/types'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  ContextMenu,
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
  CaseAppealState,
  CaseListEntry,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useCaseList,
  useSortCases,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'

import IconButton from '../../IconButton/IconButton'
import MobilePastCase from './MobilePastCase'
import * as styles from '../Table.css'

interface Props {
  cases: CaseListEntry[]
  loading?: boolean
  testid?: string
}

const PastCasesTable: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { cases, loading = false, testid } = props
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()

  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } =
    useSortCases('createdAt', 'descending', cases)

  const { transitionCase, isTransitioningCase } = useCase()

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
    <TableContainer
      loading={loading}
      testid={testid}
      tableHeader={
        <>
          <TableHeaderText title={formatMessage(tables.caseNumber)} />
          <th className={cn(styles.th, styles.largeColumn)}>
            <SortButton
              title={capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
              onClick={() => requestSort('defendant')}
              sortAsc={getClassNamesFor('defendant') === 'ascending'}
              sortDes={getClassNamesFor('defendant') === 'descending'}
              isActive={isActiveColumn('defendant')}
            />
          </th>
          <TableHeaderText title={formatMessage(tables.type)} />
          <th className={cn(styles.th, styles.largeColumn)}>
            <SortButton
              title={capitalize(formatMessage(tables.created, { suffix: 'i' }))}
              onClick={() => requestSort('createdAt')}
              sortAsc={getClassNamesFor('createdAt') === 'ascending'}
              sortDes={getClassNamesFor('createdAt') === 'descending'}
              isActive={isActiveColumn('createdAt')}
            />
          </th>
          <TableHeaderText title={formatMessage(tables.state)} />
          <TableHeaderText title={formatMessage(tables.duration)} />
          <th></th>
        </>
      }
    >
      {sortedData.map((column) => {
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
            <td className={cn(styles.td, styles.largeColumn)}>
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
                <TagCaseState
                  caseState={column.state}
                  caseType={column.type}
                  isCourtRole={isDistrictCourtUser(user)}
                  isValidToDateInThePast={column.isValidToDateInThePast}
                />
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
                        title: 'Afturkalla kæru',
                        onClick: async () => {
                          const res = await transitionCase(
                            column.id,
                            CaseTransition.WITHDRAW_APPEAL,
                          )
                          if (res === true) {
                            const transitionedCase = cases.find(
                              (c) => c.id === column.id,
                            )
                            if (transitionedCase) {
                              transitionedCase.appealState =
                                CaseAppealState.WITHDRAWN
                            }
                          }
                        },
                        icon: 'trash',
                      },
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
  )
}

export default PastCasesTable
