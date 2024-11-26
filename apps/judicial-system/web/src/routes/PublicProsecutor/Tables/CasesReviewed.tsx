import { FC } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
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
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system/types'

interface Props {
  loading: boolean
  cases: CaseListEntry[]
}

const CasesReviewed: FC<Props> = ({ loading, cases }) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  const indictmentReviewDecisionMapping = (
    reviewDecision: IndictmentCaseReviewDecision,
    isFine: boolean,
  ) => {
    if (reviewDecision === IndictmentCaseReviewDecision.ACCEPT) {
      return formatMessage(strings.reviewTagAccepted)
    } else if (reviewDecision === IndictmentCaseReviewDecision.APPEAL) {
      return formatMessage(
        isFine ? strings.reviewTagFineAppealed : strings.reviewTagAppealed,
      )
    } else {
      return null
    }
  }

  const getVerdictViewTag = (row: CaseListEntry) => {
    let variant: 'red' | 'mint' | 'blue'
    let message: MessageDescriptor

    const someDefendantIsSentToPrisonAdmin = Boolean(
      row.defendants?.length &&
        row.defendants.some((defendant) => defendant.isSentToPrisonAdmin),
    )

    if (row.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE) {
      return null
    } else if (someDefendantIsSentToPrisonAdmin) {
      variant = 'red'
      message = strings.tagVerdictViewSentToPrisonAdmin
    } else if (!row.indictmentVerdictViewedByAll) {
      variant = 'red'
      message = strings.tagVerdictUnviewed
    } else if (row.indictmentVerdictAppealDeadlineExpired) {
      variant = 'mint'
      message = strings.tagVerdictViewComplete
    } else {
      variant = 'blue'
      message = strings.tagVerdictViewOnDeadline
    }

    return (
      <Tag variant={variant} outlined disabled truncate>
        {formatMessage(message)}
      </Tag>
    )
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
                  sortable: { isSortable: true, key: 'defendants' },
                },
                { title: formatMessage(tables.reviewDecision) },
                { title: formatMessage(tables.verdictViewState) },
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
                        indictmentReviewDecisionMapping(
                          row.indictmentReviewDecision,
                          row.indictmentRulingDecision ===
                            CaseIndictmentRulingDecision.FINE,
                        )}
                    </Tag>
                  ),
                },
                {
                  cell: (row) => getVerdictViewTag(row),
                },
                {
                  cell: (row) => <Text>{row.indictmentReviewer?.name}</Text>,
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
