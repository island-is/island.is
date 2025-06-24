import { FC } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'

import { Tag, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  districtCourtAbbreviation,
} from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  CaseTag,
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
import TagContainer from '@island.is/judicial-system-web/src/components/Tags/TagContainer/TagContainer'
import {
  CaseIndictmentRulingDecision,
  CaseListEntry,
  IndictmentCaseReviewDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CasesReviewed.strings'

interface Props {
  loading: boolean
  cases: CaseListEntry[]
}

const CasesReviewed: FC<Props> = ({ loading, cases }) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTab } = useOpenCaseInNewTab()

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

    if (someDefendantIsSentToPrisonAdmin) {
      variant = 'red'
      message = strings.tagVerdictViewSentToPrisonAdmin
    } else if (
      row.indictmentRulingDecision === CaseIndictmentRulingDecision.FINE
    ) {
      return null
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

  const hasDefendantAppealedVerdict = (
    defendants: CaseListEntry['defendants'],
  ) => {
    return defendants?.some((defendant) => Boolean(defendant.verdictAppealDate))
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
                  sortBy: 'courtCaseNumber',
                },
                {
                  title: capitalize(
                    formatMessage(core.defendant, { suffix: 'i' }),
                  ),
                  sortBy: 'defendants',
                },
                { title: formatMessage(tables.type) },
                { title: formatMessage(tables.reviewDecision) },
                { title: formatMessage(tables.verdictViewState) },
                { title: formatMessage(tables.prosecutorName) },
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
                    <CaseTag
                      color="darkerBlue"
                      text={formatMessage(
                        row.indictmentRulingDecision ===
                          CaseIndictmentRulingDecision.FINE
                          ? tables.fineTag
                          : tables.rulingTag,
                      )}
                    />
                  ),
                },
                {
                  cell: (row) => (
                    <TagContainer>
                      <CaseTag
                        color="darkerBlue"
                        text={
                          (row.indictmentReviewDecision &&
                            indictmentReviewDecisionMapping(
                              row.indictmentReviewDecision,
                              row.indictmentRulingDecision ===
                                CaseIndictmentRulingDecision.FINE,
                            )) ||
                          ''
                        }
                      />
                      {hasDefendantAppealedVerdict(row.defendants) && (
                        <CaseTag
                          color="red"
                          text={formatMessage(
                            strings.tagDefendantAppealedVerdict,
                          )}
                        />
                      )}
                    </TagContainer>
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
