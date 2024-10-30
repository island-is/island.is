import { FC } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  SectionHeading,
  TagCaseState,
} from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CreatedDate,
  DefendantInfo,
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
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const { loading, isFiltering, cases } = props
  return (
    <>
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
                  sortable: { isSortable: true, key: 'defendants' },
                },
                {
                  title: formatMessage(tables.type),
                },
                {
                  title: capitalize(
                    formatMessage(tables.created, { suffix: 'i' }),
                  ),
                  sortable: { isSortable: true, key: 'created' },
                },
                { title: formatMessage(tables.state) },
              ]}
              data={cases}
              generateContextMenuItems={(row) => {
                return [openCaseInNewTabMenuItem(row.id)]
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
                  cell: (row) => <CreatedDate created={row.created} />,
                },
                {
                  cell: (row) => (
                    <TagCaseState
                      caseState={row.state}
                      isCourtRole={true}
                      indictmentDecision={row.indictmentDecision}
                    />
                  ),
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
    </>
  )
}

export default CasesAwaitingAssignmentTable
