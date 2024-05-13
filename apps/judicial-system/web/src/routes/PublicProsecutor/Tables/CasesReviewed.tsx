import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Tag, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  CourtCaseNumber,
  DefendantInfo,
} from '@island.is/judicial-system-web/src/components/Table'
import Table, {
  TableWrapper,
} from '@island.is/judicial-system-web/src/components/Table/Table'
import TableInfoContainer from '@island.is/judicial-system-web/src/components/Table/TableInfoContainer/TableInfoContainer'
import {
  CaseListEntry,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CasesReviewed.strings'

interface Props {
  loading: boolean
  cases: CaseListEntry[]
}

const CasesReviewed: React.FC<Props> = ({ loading, cases }) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const decisionMapping = {
    [IndictmentCaseReviewDecision.ACCEPT]: formatMessage(
      strings.reviewTagAccepted,
    ),
    [IndictmentCaseReviewDecision.APPEAL]: formatMessage(
      strings.reviewTagAppealed,
    ),
  }

  return (
    <>
      <SectionHeading title={formatMessage(strings.title)} />
      <AnimatePresence initial={false}>
        <TableWrapper loading={loading}>
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
                  sortable: { isSortable: true, key: 'defendant' },
                },
                { title: formatMessage(tables.reviewDecision) },
                { title: formatMessage(tables.prosecutorName) },
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
                  cell: (row) => (
                    <Tag variant="darkerBlue" outlined disabled truncate>
                      {row.indictmentReviewDecision &&
                        decisionMapping[row.indictmentReviewDecision]}
                    </Tag>
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <Text>{row.indictmentReviewer?.name}</Text>
                  ),
                },
              ]}
            />
          ) : (
            <TableInfoContainer
              title={formatMessage(strings.infoContainerTitle)}
              message={formatMessage(strings.infoContainerMessage)}
            />
          )}
        </TableWrapper>
      </AnimatePresence>
    </>
  )
}

export default CasesReviewed
