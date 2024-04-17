import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDate,
} from '@island.is/judicial-system/formatters'
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
  TableSkeleton,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import TableInfoContainer from '@island.is/judicial-system-web/src/components/Table/TableInfoContainer/TableInfoContainer'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CasesAwaitingAssignmentTable.strings'

interface CasesAwaitingAssignmentTableProps {
  loading: boolean
  isFiltering: boolean
  cases: CaseListEntry[]
}

const CasesAwaitingAssignmentTable: React.FC<
  CasesAwaitingAssignmentTableProps
> = (props) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const { loading, isFiltering, cases } = props
  return (
    <>
      <SectionHeading title={formatMessage(strings.title)} />
      <AnimatePresence initial={false}>
        <Box marginBottom={[5, 5, 12]}>
          {loading || isFiltering ? (
            <TableSkeleton />
          ) : cases.length > 0 ? (
            <Table
              thead={[
                {
                  title: formatMessage(tables.caseNumber),
                },
                {
                  title: capitalize(
                    formatMessage(core.defendant, { suffix: 'i' }),
                  ),
                  sortable: { isSortable: true, key: 'defendant' },
                },
                {
                  title: formatMessage(tables.type),
                },
                {
                  title: capitalize(
                    formatMessage(tables.created, { suffix: 'i' }),
                  ),
                  sortable: { isSortable: true, key: 'createdAt' },
                },
                { title: formatMessage(tables.state) },
              ]}
              data={cases}
              generateContextMenuItems={(row: CaseListEntry) => {
                return [openCaseInNewTabMenuItem(row.id)]
              }}
              columns={[
                {
                  cell: (row: CaseListEntry) => (
                    <CourtCaseNumber
                      courtCaseNumber={row.courtCaseNumber ?? ''}
                      policeCaseNumbers={row.policeCaseNumbers ?? []}
                      appealCaseNumber={row.appealCaseNumber ?? ''}
                    />
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <DefendantInfo defendants={row.defendants} />
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <ColumnCaseType type={row.type} />
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <CreatedDate created={row.created} />
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <TagCaseState caseState={row.state} isCourtRole={true} />
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
        </Box>
      </AnimatePresence>
    </>
  )
}

export default CasesAwaitingAssignmentTable
