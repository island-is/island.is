import { FC } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { Text } from '@island.is/island-ui/core'
import {
  capitalize,
  districtCourtAbbreviation,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  SectionHeading,
  useOpenCaseInNewTab,
} from '@island.is/judicial-system-web/src/components'
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

import { strings } from './CasesForReview.strings'

interface CasesForReviewTableProps {
  loading: boolean
  cases: CaseListEntry[]
}

const CasesForReview: FC<CasesForReviewTableProps> = ({ loading, cases }) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTab } = useOpenCaseInNewTab()

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
                  sortBy: 'courtCaseNumber',
                },
                {
                  title: capitalize(
                    formatMessage(core.defendant, { suffix: 'i' }),
                  ),
                  sortBy: 'defendants',
                },
                { title: formatMessage(tables.type) },
                { title: formatMessage(tables.state) },
                { title: formatMessage(tables.prosecutorName) },
                {
                  title: formatMessage(tables.deadline),
                  sortBy: 'indictmentAppealDeadline',
                },
              ]}
              data={cases}
              generateContextMenuItems={(row) => [openCaseInNewTab(row.id)]}
              columns={[
                {
                  cell: (row) => {
                    const courtAbbreviation = districtCourtAbbreviation(
                      row.court?.name,
                    )

                    return (
                      <CourtCaseNumber
                        courtCaseNumber={`${
                          courtAbbreviation ? `${courtAbbreviation}: ` : ''
                        }${row.courtCaseNumber ?? ''}`}
                        policeCaseNumbers={row.policeCaseNumbers ?? []}
                        appealCaseNumber={row.appealCaseNumber ?? ''}
                        publicProsecutorIsRegisteredInPoliceSystem={
                          row.publicProsecutorIsRegisteredInPoliceSystem
                        }
                      />
                    )
                  },
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
                      theCase={row}
                      customMapCaseStateToTag={
                        mapIndictmentCaseStateToTagVariant
                      }
                    />
                  ),
                },
                {
                  cell: (row) => <Text>{row.indictmentReviewer?.name}</Text>,
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
