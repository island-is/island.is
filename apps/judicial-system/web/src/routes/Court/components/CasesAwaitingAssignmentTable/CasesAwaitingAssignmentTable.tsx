import { FC } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  SectionHeading,
  TagCaseState,
  useOpenCaseInNewTab,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  DefendantInfo,
  TableDate,
} from '@island.is/judicial-system-web/src/components/Table'
import Table, {
  TableWrapper,
} from '@island.is/judicial-system-web/src/components/Table/Table'
import TableInfoContainer from '@island.is/judicial-system-web/src/components/Table/TableInfoContainer/TableInfoContainer'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CasesAwaitingAssignmentTable.strings'

interface CasesAwaitingAssignmentTableProps {
  loading: boolean
  isFiltering: boolean
  cases: CaseListEntry[]
}

const CasesAwaitingAssignmentTable: FC<CasesAwaitingAssignmentTableProps> = (
  props,
) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTab } = useOpenCaseInNewTab()

  const { loading, isFiltering, cases } = props
  return (
    <section>
      <SectionHeading title={formatMessage(strings.title)} />
      <AnimatePresence initial={false}>
        <TableWrapper loading={loading || isFiltering}>
          {cases.length > 0 ? (
            <Table
              thead={[
                {
                  title: formatMessage(tables.caseNumber),
                },
                {
                  title: capitalize(
                    formatMessage(core.defendant, { suffix: 'i' }),
                  ),
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
              ]}
              data={cases}
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
                  cell: (row) => <ColumnCaseType type={row.type} />,
                },
                {
                  cell: (row) => (
                    <TableDate displayDate={row.caseSentToCourtDate} />
                  ),
                },
                {
                  cell: (row) => <TagCaseState theCase={row} />,
                },
              ]}
            />
          ) : (
            <TableInfoContainer
              title={formatMessage(strings.noCasesTitle)}
              message={formatMessage(strings.noCasesMessage)}
            />
          )}
        </TableWrapper>
      </AnimatePresence>
    </section>
  )
}

export default CasesAwaitingAssignmentTable
