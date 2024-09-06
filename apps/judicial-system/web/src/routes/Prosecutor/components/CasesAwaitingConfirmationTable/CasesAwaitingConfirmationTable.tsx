import { FC } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  SectionHeading,
  TagCaseState,
} from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { contextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu.strings'
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
import {
  CaseListEntry,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CasesAwaitingConfirmationTable.strings'

interface CasesAwaitingConfirmationTableProps {
  loading: boolean
  isFiltering: boolean
  cases: CaseListEntry[]
  onContextMenuDeleteClick: (id: string) => void
}

const CasesAwaitingConfirmationTable: FC<
  CasesAwaitingConfirmationTableProps
> = (props) => {
  const { loading, isFiltering, cases, onContextMenuDeleteClick } = props
  const { formatMessage } = useIntl()

  const { openCaseInNewTabMenuItem } = useContextMenu()

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
                  title: capitalize(formatMessage(tables.created)),
                  sortable: { isSortable: true, key: 'created' },
                },
                { title: formatMessage(tables.state) },
                {
                  title: formatMessage(tables.prosecutor),
                },
              ]}
              data={cases}
              generateContextMenuItems={(row) => {
                return [
                  openCaseInNewTabMenuItem(row.id),
                  {
                    title: formatMessage(contextMenu.deleteCase),
                    onClick: () => {
                      onContextMenuDeleteClick(row.id)
                    },
                    icon: 'trash',
                  },
                ]
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
                  cell: () => (
                    <TagCaseState
                      caseState={CaseState.WAITING_FOR_CONFIRMATION}
                    />
                  ),
                },
                {
                  cell: (row) => <Text as="span">{row.prosecutor?.name}</Text>,
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

export default CasesAwaitingConfirmationTable
