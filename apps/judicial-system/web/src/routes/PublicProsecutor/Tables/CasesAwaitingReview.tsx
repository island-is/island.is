import { FC } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Text } from '@island.is/island-ui/core'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
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
import TagCaseState, {
  mapIndictmentCaseStateToTagVariant,
} from '@island.is/judicial-system-web/src/components/Tags/TagCaseState/TagCaseState'
import TagIndictmentRulingDecision from '@island.is/judicial-system-web/src/components/Tags/TagIndictmentRulingDecision/TagIndictmentRulingDecison'
import {
  CaseIndictmentRulingDecision,
  CaseListEntry,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CasesAwaitingReview.strings'

interface CasesForReviewTableProps {
  loading: boolean
  cases?: CaseListEntry[]
}

const CasesForReview: FC<CasesForReviewTableProps> = ({ loading, cases }) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  return (
    <>
      <SectionHeading title={formatMessage(strings.title)} />
      <AnimatePresence initial={false}>
        <TableWrapper loading={loading}>
          {cases && cases.length > 0 ? (
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
                { title: formatMessage(tables.type) },
                { title: formatMessage(tables.state) },
                {
                  title: formatMessage(tables.deadline),
                  sortBy: 'indictmentAppealDeadline',
                },
              ]}
              data={cases}
              generateContextMenuItems={(row) => [
                openCaseInNewTabMenuItem(row.id),
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
                    <TagIndictmentRulingDecision
                      isFine={
                        row.indictmentRulingDecision ===
                        CaseIndictmentRulingDecision.FINE
                      }
                    />
                  ),
                },
                {
                  cell: (row) => (
                    <TagCaseState
                      caseState={row.state}
                      customMapCaseStateToTag={
                        mapIndictmentCaseStateToTagVariant
                      }
                      indictmentReviewer={row.indictmentReviewer}
                    />
                  ),
                },
                {
                  cell: (row) => (
                    <Text>{formatDate(row.indictmentAppealDeadline)}</Text>
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

export default CasesForReview
