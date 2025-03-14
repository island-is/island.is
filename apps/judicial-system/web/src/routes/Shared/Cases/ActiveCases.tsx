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
import Table, {
  useTable,
} from '@island.is/judicial-system-web/src/components/Table/Table'
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
  const { sortConfig } = useTable()

  return (
    <Table
      thead={[
        {
          title: formatMessage(tables.caseNumber),
          sortBy: 'courtCaseNumber',
          sortFn: (a: CaseListEntry, b: CaseListEntry) => {
            const aa = a.policeCaseNumbers?.[0]?.replace(/\D/g, '') || '0'
            const bb = b.policeCaseNumbers?.[0]?.replace(/\D/g, '') || '0'
            const aaa =
              Number(aa) +
              (!a.policeCaseNumbers?.[0] ||
              a.policeCaseNumbers?.[0]?.includes('R')
                ? 0
                : Number.MAX_SAFE_INTEGER)
            const bbb =
              Number(bb) +
              (!b.policeCaseNumbers?.[0] ||
              b.policeCaseNumbers?.[0]?.includes('R')
                ? 0
                : Number.MAX_SAFE_INTEGER)

            return sortConfig?.direction === 'ascending' ? aaa - bbb : bbb - aaa
          },
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
