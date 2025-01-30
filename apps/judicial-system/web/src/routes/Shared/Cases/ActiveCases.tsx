import { FC } from 'react'
import { useIntl } from 'react-intl'

import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { TagCaseState } from '@island.is/judicial-system-web/src/components'
import {
  ContextMenuItem,
  useContextMenu,
} from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { contextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu.strings'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CourtDate,
  DefendantInfo,
  TableDate,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  cases: CaseListEntry[]
  onContextMenuDeleteClick: (id: string) => void
  canDeleteCase: (caseToDelete: CaseListEntry) => boolean
}

const ActiveCases: FC<Props> = (props) => {
  const { cases, onContextMenuDeleteClick, canDeleteCase } = props
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  return (
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
          title: capitalize(formatMessage(tables.sentToCourtDate)),
          sortBy: 'caseSentToCourtDate',
        },
        { title: formatMessage(tables.state) },
        {
          title: formatMessage(tables.hearingArrangementDate),
          sortBy: 'courtDate',
        },
      ]}
      data={cases}
      generateContextMenuItems={(row) => [
        openCaseInNewTabMenuItem(row.id),
        ...(canDeleteCase(row)
          ? [
              {
                title: formatMessage(contextMenu.deleteCase),
                onClick: () => {
                  onContextMenuDeleteClick(row.id)
                },
                icon: 'trash',
              } as ContextMenuItem,
            ]
          : []),
      ]}
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
          cell: (row) => <TableDate displayDate={row.caseSentToCourtDate} />,
        },
        {
          cell: (row) => (
            <TagCaseState
              caseState={row.state}
              caseType={row.type}
              isValidToDateInThePast={row.isValidToDateInThePast}
              courtDate={row.courtDate}
              indictmentDecision={row.indictmentDecision}
              indictmentRulingDecision={row.indictmentRulingDecision}
              defendants={row.defendants}
            />
          ),
        },
        {
          cell: (row) => (
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
  )
}

export default ActiveCases
