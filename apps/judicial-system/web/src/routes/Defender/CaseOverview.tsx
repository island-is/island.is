import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CaseDates,
  FormContentContainer,
  FormContext,
  InfoCard,
  MarkdownWrapper,
  PageLayout,
  PdfButton,
  RestrictionTags,
  SignedDocument,
  PageHeader,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import CaseResentExplanation from '@island.is/judicial-system-web/src/components/CaseResentExplanation/CaseResentExplanation'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
  CaseType,
  completedCaseStates,
  Feature,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import * as constants from '@island.is/judicial-system/consts'
import AppealConclusion from '@island.is/judicial-system-web/src/components/Conclusion/AppealConclusion'
import { AlertBanner } from '@island.is/judicial-system-web/src/components/AlertBanner'
import useAppealAlertBanner from '@island.is/judicial-system-web/src/utils/hooks/useAppealAlertBanner'

import { defenderCaseOverview as m } from './CaseOverview.strings'
import Conclusion from '../../components/Conclusion/Conclusion'
import CaseFilesOverview from '../CourtOfAppeal/components/CaseFilesOverview/CaseFilesOverview'

type availableModals =
  | 'NoModal'
  | 'ConfirmAppealAfterDeadline'
  | 'ConfirmStatementAfterDeadline'

export const CaseOverview: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  const { formatMessage } = useIntl()
  const { features } = useContext(FeatureContext)
  const { title, description, child } = useAppealAlertBanner(
    workingCase,
    () => setModalVisible('ConfirmAppealAfterDeadline'),
    () => setModalVisible('ConfirmStatementAfterDeadline'),
  )
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState<availableModals>('NoModal')

  const titleForCase = (theCase: Case) => {
    if (theCase.state === CaseState.REJECTED) {
      return isInvestigationCase(theCase.type)
        ? formatMessage(m.investigationCaseRejectedTitle)
        : formatMessage(m.restrictionCaseRejectedTitle)
    }

    if (theCase.state === CaseState.DISMISSED) {
      return formatMessage(m.caseDismissedTitle)
    }

    if (theCase.state === CaseState.ACCEPTED) {
      if (isInvestigationCase(theCase.type)) {
        return formatMessage(m.investigationCaseAcceptedTitle)
      }

      const caseType =
        theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
          ? CaseType.TRAVEL_BAN
          : theCase.type

      if (theCase.isValidToDateInThePast) {
        return formatMessage(m.restrictionCaseExpiredTitle, { caseType })
      }

      return formatMessage(m.restrictionCaseActiveTitle, {
        caseType,
      })
    }

    return isInvestigationCase(theCase.type)
      ? ''
      : formatMessage(m.restrictionCaseScheduledTitle, {
          caseType: theCase.type,
          isExtended: Boolean(theCase.parentCase),
        })
  }

  const shouldDisplayAlertBanner =
    workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
    workingCase.hasBeenAppealed

  return (
    <>
      {features.includes(Feature.APPEAL_TO_COURT_OF_APPEALS) &&
        shouldDisplayAlertBanner && (
          <AlertBanner
            variant="warning"
            title={title}
            description={description}
          >
            {child}
          </AlertBanner>
        )}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={formatMessage(titles.defender.caseOverview)} />
        <FormContentContainer>
          {!completedCaseStates.includes(workingCase.state) &&
            workingCase.caseResentExplanation && (
              <Box marginBottom={5}>
                <CaseResentExplanation
                  explanation={workingCase.caseResentExplanation}
                />
              </Box>
            )}
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
                          suffix:
                            workingCase.defendants.length > 1 ? 'ar' : 'i',
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
              courtOfAppealData={
                workingCase.appealCaseNumber
                  ? [
                      {
                        title: formatMessage(core.appealCaseNumberHeading),
                        value: workingCase.appealCaseNumber,
                      },
                      {
                        title: formatMessage(core.appealAssistantHeading),
                        value: workingCase.appealAssistant?.name,
                      },
                      {
                        title: formatMessage(core.appealJudgesHeading),
                        value: (
                          <>
                            <Text>{workingCase.appealJudge1?.name}</Text>
                            <Text>{workingCase.appealJudge2?.name}</Text>
                            <Text>{workingCase.appealJudge3?.name}</Text>
                          </>
                        ),
                      },
                    ]
                  : undefined
              }
            />
          </Box>
          {completedCaseStates.includes(workingCase.state) && (
            <Box marginBottom={6}>
              <Conclusion
                conclusionText={workingCase.conclusion}
                judgeName={workingCase.judge?.name}
              />
            </Box>
          )}
          {workingCase.appealConclusion && (
            <Box marginBottom={6}>
              <AppealConclusion
                conclusionText={workingCase.appealConclusion}
                judgeName={workingCase.appealJudge1?.name}
              />
            </Box>
          )}

          {workingCase.appealState ? (
            <CaseFilesOverview />
          ) : (
            <Box marginBottom={10}>
              <Text as="h3" variant="h3" marginBottom={3}>
                {formatMessage(m.documentHeading)}
              </Text>
              <Box>
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRequest)}
                  pdfType={'limitedAccess/request'}
                />
                {completedCaseStates.includes(workingCase.state) && (
                  <>
                    <PdfButton
                      renderAs="row"
                      caseId={workingCase.id}
                      title={formatMessage(core.pdfButtonRulingShortVersion)}
                      pdfType={'limitedAccess/courtRecord'}
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
                      pdfType={'limitedAccess/ruling'}
                    >
                      {workingCase.rulingDate ? (
                        <SignedDocument
                          signatory={workingCase.judge?.name}
                          signingDate={workingCase.rulingDate}
                        />
                      ) : (
                        <Text>{formatMessage(m.unsignedRuling)}</Text>
                      )}
                    </PdfButton>
                  </>
                )}
              </Box>
            </Box>
          )}
        </FormContentContainer>
        {modalVisible === 'ConfirmAppealAfterDeadline' && (
          <Modal
            title={formatMessage(m.confirmAppealAfterDeadlineModalTitle)}
            text={formatMessage(m.confirmAppealAfterDeadlineModalText)}
            primaryButtonText={formatMessage(
              m.confirmAppealAfterDeadlineModalPrimaryButtonText,
            )}
            secondaryButtonText={formatMessage(
              m.confirmAppealAfterDeadlineModalSecondaryButtonText,
            )}
            onPrimaryButtonClick={() => {
              router.push(`${constants.APPEAL_ROUTE}/${workingCase.id}`)
            }}
            onSecondaryButtonClick={() => {
              setModalVisible('NoModal')
            }}
          />
        )}
        {modalVisible === 'ConfirmStatementAfterDeadline' && (
          <Modal
            title={formatMessage(m.confirmStatementAfterDeadlineModalTitle)}
            text={formatMessage(m.confirmStatementAfterDeadlineModalText)}
            primaryButtonText={formatMessage(
              m.confirmStatementAfterDeadlineModalPrimaryButtonText,
            )}
            secondaryButtonText={formatMessage(
              m.confirmStatementAfterDeadlineModalSecondaryButtonText,
            )}
            onPrimaryButtonClick={() => {
              router.push(`${constants.APPEAL_ROUTE}/${workingCase.id}`)
            }}
            onSecondaryButtonClick={() => {
              setModalVisible('NoModal')
            }}
          />
        )}
      </PageLayout>
    </>
  )
}

export default CaseOverview
