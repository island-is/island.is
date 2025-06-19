import { FC, useMemo } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages/Core'
import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import {
  TagAppealState,
  useOpenCaseInNewTab,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  DefendantInfo,
  getDurationDate,
} from '@island.is/judicial-system-web/src/components/Table'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCaseList,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'

import Table, { TableWrapper } from '../Table'
import MobileAppealCase from './MobileAppealCase'

interface Props {
  cases: CaseListEntry[]
  loading: boolean
  showingCompletedCases?: boolean
}

const AppealCasesTable: FC<Props> = (props) => {
  const { cases, loading, showingCompletedCases } = props
  const { formatMessage } = useIntl()
  const { isOpeningCaseId, handleOpenCase, showLoading } = useCaseList()
  const { openCaseInNewTab } = useOpenCaseInNewTab()

  const activeCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        (a['appealedDate'] ?? '').localeCompare(b['appealedDate'] ?? ''),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {activeCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileAppealCase
            theCase={theCase}
            onClick={() => handleOpenCase(theCase.id)}
            isLoading={isOpeningCaseId === theCase.id && showLoading}
          >
            {showingCompletedCases && (
              <Text fontWeight={'medium'} variant="small">
                {isRestrictionCase(theCase.type)
                  ? `${formatDate(theCase.rulingDate ?? '', 'd.M.y')} -
                  ${formatDate(theCase.validToDate ?? '', 'd.M.y')}`
                  : ''}
              </Text>
            )}
          </MobileAppealCase>
        </Box>
      ))}
    </>
  ) : (
    <TableWrapper loading={loading}>
      <Table
        thead={[
          {
            title: formatMessage(tables.caseNumber),
            sortBy: 'appealCaseNumber',
            sortFn: 'number',
          },
          {
            title: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
            sortBy: 'defendants',
          },
          {
            title: formatMessage(tables.type),
          },
          { title: formatMessage(tables.state) },
          {
            title: showingCompletedCases
              ? formatMessage(tables.duration)
              : formatMessage(tables.appealDate),
            sortBy: showingCompletedCases ? undefined : 'appealedDate',
          },
        ]}
        data={activeCasesData}
        generateContextMenuItems={(row) => {
          return [openCaseInNewTab(row.id)]
        }}
        columns={[
          {
            cell: (row) => (
              <CourtCaseNumber
                courtCaseNumber={row.courtCaseNumber ?? ''}
                policeCaseNumbers={row.policeCaseNumbers ?? []}
                appealCaseNumber={row.appealCaseNumber ?? ''}
              />
            ),
          },
          {
            cell: (row) => <DefendantInfo defendants={row.defendants} />,
          },
          {
            cell: (row) => (
              <ColumnCaseType
                type={row.type}
                decision={row.decision}
                parentCaseId={row.parentCaseId}
              />
            ),
          },
          {
            cell: (row) => (
              <TagAppealState
                appealState={row.appealState}
                appealRulingDecision={row.appealRulingDecision}
                appealCaseNumber={row.appealCaseNumber}
              />
            ),
          },
          {
            cell: (row) => (
              <Text>
                {showingCompletedCases
                  ? isRestrictionCase(row.type)
                    ? getDurationDate(
                        row.state,
                        row.validToDate,
                        row.initialRulingDate,
                        row.rulingDate,
                      )
                    : ''
                  : row.appealedDate
                  ? formatDate(row.appealedDate, 'd.M.y')
                  : '-'}
              </Text>
            ),
          },
        ]}
      />
    </TableWrapper>
  )
}

export default AppealCasesTable
