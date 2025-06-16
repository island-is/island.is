import { FC } from 'react'
import { useIntl } from 'react-intl'

import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  ContextMenuItem,
  TagCaseState,
  useOpenCaseInNewTab,
} from '@island.is/judicial-system-web/src/components'
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
  const { openCaseInNewTab } = useOpenCaseInNewTab()

  return (
    <Table
      thead={[
        {
          title: formatMessage(tables.caseNumber),
          sortBy: 'policeCaseNumbers',
          sortFn: 'number',
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
        { title: formatMessage(tables.state), sortBy: 'state' },
        {
          title: formatMessage(tables.hearingArrangementDate),
          sortBy: 'courtDate',
        },
      ]}
      data={cases}
      generateContextMenuItems={(row) => [
        openCaseInNewTab(row.id),
        ...(canDeleteCase(row)
          ? [
              {
                title: 'Afturkalla',
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
          cell: (row) => <TagCaseState theCase={row} />,
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
