import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Sections } from '@island.is/judicial-system-web/src/types'
import {
  BlueBox,
  CaseDates,
  FormContentContainer,
  FormContext,
  InfoCard,
  MarkdownWrapper,
  PageLayout,
  PdfButton,
  RestrictionTags,
  SignedDocument,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  CaseDecision,
  CaseState,
  CaseType,
  completedCaseStates,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  AlertMessage,
  Box,
  Divider,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'

import { defenderCaseOverview as m } from './CaseOverview.strings'

export const CaseOverview: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  const { formatMessage } = useIntl()

  const titleForCase = (theCase: Case) => {
    if (theCase.state === CaseState.REJECTED) {
      return isInvestigationCase(theCase.type)
        ? formatMessage(m.title.investigationCaseRejected)
        : formatMessage(m.title.restrictionCaseRejected)
    }

    if (theCase.state === CaseState.DISMISSED) {
      return formatMessage(m.title.caseDismissed)
    }

    if (theCase.state === CaseState.ACCEPTED) {
      if (isInvestigationCase(theCase.type)) {
        return formatMessage(m.title.investigationCaseAccepted)
      }

      const caseType =
        theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
          ? CaseType.TRAVEL_BAN
          : theCase.type

      if (theCase.isValidToDateInThePast) {
        return formatMessage(m.title.restrictionCaseExpired, { caseType })
      }

      return formatMessage(m.title.restrictionCaseActive, {
        caseType,
      })
    }

    return isInvestigationCase(theCase.type)
      ? ''
      : formatMessage(m.title.restrictionCaseScheduled, {
          caseType: theCase.type,
          isExtended: Boolean(theCase.parentCase),
        })
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        completedCaseStates.includes(workingCase.state)
          ? 2
          : workingCase.parentCase
          ? Sections.JUDGE_EXTENSION
          : Sections.JUDGE
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.defender.caseOverview)} />
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
                    {formatMessage(m.rulingDate, {
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
                title={formatMessage(m.modifiedDatesHeading, {
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
                value: workingCase.policeCaseNumbers.map((n) => (
                  <Text key={n}>{n}</Text>
                )),
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
            defendants={
              workingCase.defendants
                ? {
                    title: capitalize(
                      formatMessage(core.defendant, {
                        suffix: workingCase.defendants.length > 1 ? 'ar' : 'i',
                      }),
                    ),
                    items: workingCase.defendants,
                  }
                : undefined
            }
            defenders={[
              {
                name: workingCase.defenderName ?? '',
                defenderNationalId: workingCase.defenderNationalId,
                sessionArrangement: workingCase.sessionArrangements,
                email: workingCase.defenderEmail,
                phoneNumber: workingCase.defenderPhoneNumber,
              },
            ]}
          />
        </Box>
        {completedCaseStates.includes(workingCase.state) && (
          <Box marginBottom={6}>
            <BlueBox>
              <Box marginBottom={2} textAlign="center">
                <Text as="h3" variant="h3">
                  {formatMessage(m.conclusionHeading)}
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
            {formatMessage(m.documentHeading)}
          </Text>
          <Box marginBottom={2}>
            <Stack space={2} dividers>
              <PdfButton
                renderAs="row"
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRequest)}
                pdfType={'request/limitedAccess'}
              />
              {completedCaseStates.includes(workingCase.state) && (
                <>
                  <PdfButton
                    renderAs="row"
                    caseId={workingCase.id}
                    title={formatMessage(core.pdfButtonRulingShortVersion)}
                    pdfType={'courtRecord/limitedAccess'}
                  >
                    {workingCase.courtRecordSignatory ? (
                      <SignedDocument
                        signatory={workingCase.courtRecordSignatory.name}
                        signingDate={workingCase.courtRecordSignatureDate}
                      />
                    ) : null}
                  </PdfButton>
                  <PdfButton
                    renderAs="row"
                    caseId={workingCase.id}
                    title={formatMessage(core.pdfButtonRuling)}
                    pdfType={'ruling/limitedAccess'}
                  >
                    <SignedDocument
                      signatory={workingCase.judge?.name}
                      signingDate={workingCase.rulingDate}
                    />
                  </PdfButton>
                </>
              )}
            </Stack>
          </Box>
          <Divider />
        </Box>
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseOverview
