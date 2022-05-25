import React from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  InfoCard,
  PdfRow,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  completedCaseStates,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import {
  core,
  defenderCaseOverview,
} from '@island.is/judicial-system-web/messages'
import RestrictionTags from '@island.is/judicial-system-web/src/components/RestrictionTags/RestrictionTags'
import CaseDates from '@island.is/judicial-system-web/src/components/CaseDates/CaseDates'
import MarkdownWrapper from '@island.is/judicial-system-web/src/components/MarkdownWrapper/MarkdownWrapper'
import { SignedDocument } from '@island.is/judicial-system-web/src/components/SignedDocument/SignedDocument'

interface Props {
  workingCase: Case
}

const CaseOverviewForm: React.FC<Props> = (props) => {
  const { workingCase } = props

  const { formatMessage } = useIntl()

  const titleForCase = (theCase: Case) => {
    if (theCase.state === CaseState.REJECTED) {
      return isInvestigationCase(theCase.type)
        ? formatMessage(defenderCaseOverview.title.investigationCaseRejected)
        : formatMessage(defenderCaseOverview.title.restrictionCaseRejected)
    }

    if (theCase.state === CaseState.DISMISSED) {
      return formatMessage(defenderCaseOverview.title.caseDismissed)
    }

    if (theCase.state === CaseState.ACCEPTED) {
      if (isInvestigationCase(theCase.type)) {
        return formatMessage(
          defenderCaseOverview.title.investigationCaseAccepted,
        )
      }

      const caseType =
        theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
          ? CaseType.TRAVEL_BAN
          : theCase.type

      if (theCase.isValidToDateInThePast) {
        return formatMessage(
          defenderCaseOverview.title.restrictionCaseExpired,
          { caseType },
        )
      }

      return formatMessage(defenderCaseOverview.title.restrictionCaseActive, {
        caseType,
      })
    }

    return isInvestigationCase(theCase.type)
      ? ''
      : formatMessage(defenderCaseOverview.title.restrictionCaseScheduled, {
          caseType: theCase.type,
          isExtended: Boolean(theCase.parentCase),
        })
  }

  return (
    <FormContentContainer>
      <Box marginBottom={5}>
        <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
          <Box>
            <Box marginBottom={1} data-testid="caseTitle">
              <Text as="h1" variant="h1">
                {titleForCase(workingCase)}
              </Text>
            </Box>
            {completedCaseStates.includes(workingCase.state) && (
              <Box>
                <Text variant="h5">
                  {formatMessage(defenderCaseOverview.rulingDate, {
                    courtEndTime: `${formatDate(
                      workingCase.courtEndTime,
                      'PPP',
                    )} kl. ${formatDate(
                      workingCase.courtEndTime,
                      TIME_FORMAT,
                    )}`,
                  })}
                </Text>
              </Box>
            )}
          </Box>
          {completedCaseStates.includes(workingCase.state) && (
            <Box display="flex" flexDirection="column">
              <RestrictionTags workingCase={workingCase} />
            </Box>
          )}
        </Box>
        {completedCaseStates.includes(workingCase.state) &&
          isRestrictionCase(workingCase.type) &&
          workingCase.state === CaseState.ACCEPTED && (
            <CaseDates workingCase={workingCase} />
          )}
      </Box>
      {completedCaseStates.includes(workingCase.state) &&
        workingCase.caseModifiedExplanation && (
          <Box marginBottom={5}>
            <AlertMessage
              type="info"
              title={formatMessage(defenderCaseOverview.modifiedDatesHeading, {
                caseType: workingCase.type,
              })}
              message={
                <MarkdownWrapper
                  markdown={workingCase.caseModifiedExplanation}
                  textProps={{ variant: 'small' }}
                />
              }
            />
          </Box>
        )}
      <Box marginBottom={6}>
        <InfoCard
          data={[
            {
              title: formatMessage(core.policeCaseNumber),
              value: workingCase.policeCaseNumber,
            },
            {
              title: formatMessage(core.courtCaseNumber),
              value: workingCase.courtCaseNumber,
            },
            {
              title: formatMessage(core.prosecutor),
              value: `${workingCase.creatingProsecutor?.institution?.name}`,
            },
            {
              title: formatMessage(core.court),
              value: workingCase.court?.name,
            },
            {
              title: formatMessage(core.prosecutorPerson),
              value: workingCase.prosecutor?.name,
            },
            {
              title: formatMessage(core.judge),
              value: workingCase.judge?.name,
            },
            // Conditionally add this field based on case type
            ...(isInvestigationCase(workingCase.type)
              ? [
                  {
                    title: formatMessage(core.caseType),
                    value: capitalize(caseTypes[workingCase.type]),
                  },
                ]
              : []),
            ...(workingCase.registrar
              ? [
                  {
                    title: formatMessage(core.registrar),
                    value: workingCase.registrar?.name,
                  },
                ]
              : []),
          ]}
          defendants={workingCase.defendants ?? []}
          defender={{
            name: workingCase.defenderName ?? '',
            defenderNationalId: workingCase.defenderNationalId,
            email: workingCase.defenderEmail,
            phoneNumber: workingCase.defenderPhoneNumber,
          }}
          sessionArrangement={workingCase.sessionArrangements}
        />
      </Box>
      {completedCaseStates.includes(workingCase.state) && (
        <Box marginBottom={6}>
          <BlueBox>
            <Box marginBottom={2} textAlign="center">
              <Text as="h3" variant="h3">
                {formatMessage(defenderCaseOverview.conclusionHeading)}
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Box marginTop={1}>
                <Text variant="intro">{workingCase.conclusion}</Text>
              </Box>
            </Box>
            <Box marginBottom={1} textAlign="center">
              <Text variant="h4">{workingCase?.judge?.name}</Text>
            </Box>
          </BlueBox>
        </Box>
      )}
      <Box marginBottom={10}>
        <Text as="h3" variant="h3" marginBottom={3}>
          {formatMessage(defenderCaseOverview.documentHeading)}
        </Text>
        <Box marginBottom={2}>
          <Stack space={2} dividers>
            <PdfRow
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRequest)}
              pdfType={'request/limitedAccess'}
            />
            {completedCaseStates.includes(workingCase.state) && (
              <>
                <PdfRow
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRulingShortVersion)}
                  pdfType={'courtRecord/limitedAccess'}
                >
                  {workingCase.courtRecordSignatory ? (
                    <SignedDocument
                      signatory={workingCase.courtRecordSignatory.name}
                      signingDate={workingCase.courtRecordSignatureDate}
                    />
                  ) : (
                    <Text>
                      {formatMessage(defenderCaseOverview.unsignedDocument)}
                    </Text>
                  )}
                </PdfRow>
                <PdfRow
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRuling)}
                  pdfType={'ruling/limitedAccess'}
                >
                  <SignedDocument
                    signatory={workingCase.judge?.name}
                    signingDate={workingCase.rulingDate}
                  />
                </PdfRow>
              </>
            )}
          </Stack>
        </Box>
        <Divider />
      </Box>
    </FormContentContainer>
  )
}

export default CaseOverviewForm
