import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  TagAppealState,
  TagCaseState,
  useOpenCaseInNewTab,
  useWithdrawAppealMenuOption,
  WithdrawAppealContextMenuModal,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CourtDate,
  DefendantInfo,
  getDurationDate,
  TableDate,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import TagContainer from '@island.is/judicial-system-web/src/components/Tags/TagContainer/TagContainer'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  cases: CaseListEntry[]
  showingCompletedCases?: boolean
}

export const DefenderCasesTable: FC<Props> = ({
  cases,
  showingCompletedCases,
}) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTab } = useOpenCaseInNewTab()

  const {
    withdrawAppealMenuOption,
    caseToWithdraw,
    setCaseToWithdraw,
    shouldDisplayWithdrawAppealOption,
  } = useWithdrawAppealMenuOption()

  return (
    <>
      <Table
        thead={[
          {
            title: formatMessage(tables.caseNumber),
          },
          {
            title: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
            sortBy: 'defendants',
          },
          {
            title: formatMessage(tables.type),
          },
          {
            title: formatMessage(tables.sentToCourtDate),
            sortBy: 'caseSentToCourtDate',
          },
          { title: formatMessage(tables.state), sortBy: 'state' },
          {
            title: formatMessage(
              showingCompletedCases
                ? tables.duration
                : tables.hearingArrangementDate,
            ),
            sortBy: showingCompletedCases ? undefined : 'courtDate',
          },
        ]}
        data={cases}
        generateContextMenuItems={(row) => [
          openCaseInNewTab(row.id),
          ...(shouldDisplayWithdrawAppealOption(row)
            ? [withdrawAppealMenuOption(row.id)]
            : []),
        ]}
        columns={[
          {
            cell: (row) => (
              <CourtCaseNumber
                courtCaseNumber={row.courtCaseNumber}
                policeCaseNumbers={row.policeCaseNumbers}
                appealCaseNumber={row.appealCaseNumber}
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
            cell: (row) => <TableDate displayDate={row.caseSentToCourtDate} />,
          },
          {
            cell: (row) => (
              <TagContainer>
                <TagCaseState theCase={row} />
                {row.appealState && (
                  <TagAppealState
                    appealState={row.appealState}
                    appealRulingDecision={row.appealRulingDecision}
                  />
                )}
              </TagContainer>
            ),
          },
          {
            cell: (row) =>
              showingCompletedCases ? (
                <Text>
                  {getDurationDate(
                    row.state,
                    row.validToDate,
                    row.initialRulingDate,
                    row.rulingDate,
                  )}
                </Text>
              ) : (
                <CourtDate
                  courtDate={row.courtDate}
                  postponedIndefinitelyExplanation={
                    row.postponedIndefinitelyExplanation
                  }
                  courtSessionType={row.courtSessionType}
                />
              ),
          },
        ]}
      />
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

export default DefenderCasesTable
