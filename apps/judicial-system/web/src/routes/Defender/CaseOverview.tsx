import { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  AppealCaseFilesOverview,
  CaseDates,
  CaseResentExplanation,
  CaseScheduledCard,
  CaseTitleInfoAndTags,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  MarkdownWrapper,
  Modal,
  PageHeader,
  PageLayout,
  PdfButton,
  SignedDocument,
  ZipButton,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  RequestSharedWithDefender,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'

import InfoCard from '../../components/InfoCard/InfoCard'
import useInfoCardItems from '../../components/InfoCard/useInfoCardItems'
import { strings } from './CaseOverview.strings'

type availableModals =
  | 'NoModal'
  | 'ConfirmAppealAfterDeadline'
  | 'ConfirmStatementAfterDeadline'

export const CaseOverview = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const { title, description, child, isLoadingAppealBanner } =
    useAppealAlertBanner(
      workingCase,
      () => setModalVisible('ConfirmAppealAfterDeadline'),
      () => setModalVisible('ConfirmStatementAfterDeadline'),
    )
  const {
    defendants,
    policeCaseNumbers,
    courtCaseNumber,
    prosecutorsOffice,
    court,
    prosecutor,
    judge,
    caseType,
    registrar,
    appealCaseNumber,
    appealAssistant,
    appealJudges,
    victims,
    showItem,
  } = useInfoCardItems()
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState<availableModals>('NoModal')

  const shouldDisplayAlertBanner =
    isCompletedCase(workingCase.state) &&
    (workingCase.canDefenderAppeal || workingCase.hasBeenAppealed)

  return (
    <>
      {!isLoadingAppealBanner && shouldDisplayAlertBanner && (
        <AlertBanner variant="warning" title={title} description={description}>
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
          {!isCompletedCase(workingCase.state) &&
            workingCase.caseResentExplanation && (
              <Box marginBottom={5}>
                <CaseResentExplanation
                  explanation={workingCase.caseResentExplanation}
                />
              </Box>
            )}
          <Box marginBottom={5}>
            <CaseTitleInfoAndTags />
            {isCompletedCase(workingCase.state) &&
              isRestrictionCase(workingCase.type) &&
              workingCase.state === CaseState.ACCEPTED && (
                <CaseDates workingCase={workingCase} />
              )}
          </Box>
          {isCompletedCase(workingCase.state) &&
            workingCase.caseModifiedExplanation && (
              <Box marginBottom={5}>
                <AlertMessage
                  type="info"
                  title={formatMessage(strings.modifiedDatesHeading, {
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
          {workingCase.appealRulingModifiedHistory && (
            <Box marginBottom={5}>
              <AlertMessage
                type="info"
                title={formatMessage(strings.rulingModifiedTitle)}
                message={
                  <MarkdownWrapper
                    markdown={workingCase.appealRulingModifiedHistory}
                    textProps={{ variant: 'small' }}
                  />
                }
              />
            </Box>
          )}
          {workingCase.state === CaseState.RECEIVED &&
            workingCase.arraignmentDate?.date &&
            workingCase.court && (
              <Box component="section" marginBottom={5}>
                <CaseScheduledCard
                  court={workingCase.court}
                  courtDate={workingCase.arraignmentDate.date}
                  courtRoom={workingCase.arraignmentDate.location}
                />
              </Box>
            )}
          <Box marginBottom={6}>
            <InfoCard
              sections={[
                {
                  id: 'defendants-section',
                  items: [defendants({ caseType: workingCase.type })],
                },
                ...(showItem(victims)
                  ? [
                      {
                        id: 'victims-section',
                        items: [victims],
                      },
                    ]
                  : []),
                {
                  id: 'case-info-section',
                  items: [
                    policeCaseNumbers,
                    courtCaseNumber,
                    prosecutorsOffice,
                    court,
                    prosecutor(workingCase.type),
                    ...(workingCase.judge ? [judge] : []),
                    ...(isInvestigationCase(workingCase.type)
                      ? [caseType]
                      : []),
                    ...(workingCase.registrar ? [registrar] : []),
                  ],
                  columns: 2,
                },
                ...(workingCase.appealCaseNumber
                  ? [
                      {
                        id: 'court-of-appeal-section',
                        items: [
                          appealCaseNumber,
                          ...(appealAssistant ? [appealAssistant] : []),
                          ...(workingCase.appealJudge1 &&
                          workingCase.appealJudge2 &&
                          workingCase.appealJudge3
                            ? [appealJudges]
                            : []),
                        ],
                        columns: 2,
                      },
                    ]
                  : []),
              ]}
            />
          </Box>
          {isCompletedCase(workingCase.state) && (
            <Box marginBottom={6}>
              <Conclusion
                title={formatMessage(conclusion.title)}
                conclusionText={workingCase.conclusion}
                judgeName={workingCase.judge?.name}
              />
            </Box>
          )}
          {workingCase.appealConclusion && (
            <Box marginBottom={6}>
              <Conclusion
                title={formatMessage(conclusion.appealTitle)}
                conclusionText={workingCase.appealConclusion}
              />
            </Box>
          )}
          <Box marginBottom={6}>
            <AppealCaseFilesOverview />
          </Box>
          {(workingCase.requestSharedWithDefender ===
            RequestSharedWithDefender.READY_FOR_COURT ||
            workingCase.requestSharedWithDefender ===
              RequestSharedWithDefender.COURT_DATE ||
            isCompletedCase(workingCase.state)) && (
            <Box marginBottom={10}>
              <Text as="h3" variant="h3" marginBottom={1}>
                {formatMessage(strings.documentHeading)}
              </Text>
              <Box>
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRequest)}
                  pdfType="request"
                  elementId={formatMessage(core.pdfButtonRequest)}
                />
                {isCompletedCase(workingCase.state) && (
                  <>
                    <PdfButton
                      renderAs="row"
                      caseId={workingCase.id}
                      title={formatMessage(core.pdfButtonRulingShortVersion)}
                      pdfType="courtRecord"
                      elementId={formatMessage(
                        core.pdfButtonRulingShortVersion,
                      )}
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
                      pdfType="ruling"
                      elementId={formatMessage(core.pdfButtonRuling)}
                      disabled={workingCase.isCompletedWithoutRuling || false}
                    >
                      {workingCase.rulingSignatureDate ? (
                        <SignedDocument
                          signatory={workingCase.judge?.name}
                          signingDate={workingCase.rulingSignatureDate}
                        />
                      ) : workingCase.isCompletedWithoutRuling ? (
                        <Text>{formatMessage(strings.noRuling)}</Text>
                      ) : (
                        <Text>{formatMessage(strings.unsignedRuling)}</Text>
                      )}
                    </PdfButton>
                    <Box marginTop={7}>
                      <ZipButton
                        caseId={workingCase.id}
                        courtCaseNumber={workingCase.courtCaseNumber}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          )}
        </FormContentContainer>
        {modalVisible === 'ConfirmAppealAfterDeadline' && (
          <Modal
            title={formatMessage(strings.confirmAppealAfterDeadlineModalTitle)}
            text={formatMessage(strings.confirmAppealAfterDeadlineModalText)}
            primaryButton={{
              text: formatMessage(
                strings.confirmAppealAfterDeadlineModalPrimaryButtonText,
              ),
              onClick: () => {
                router.push(
                  `${constants.DEFENDER_APPEAL_ROUTE}/${workingCase.id}`,
                )
              },
            }}
            secondaryButton={{
              text: formatMessage(
                strings.confirmAppealAfterDeadlineModalSecondaryButtonText,
              ),
              onClick: () => {
                setModalVisible('NoModal')
              },
            }}
          />
        )}
        {modalVisible === 'ConfirmStatementAfterDeadline' && (
          <Modal
            title={formatMessage(
              strings.confirmStatementAfterDeadlineModalTitle,
            )}
            text={formatMessage(strings.confirmStatementAfterDeadlineModalText)}
            primaryButton={{
              text: formatMessage(
                strings.confirmStatementAfterDeadlineModalPrimaryButtonText,
              ),
              onClick: () => {
                router.push(
                  `${constants.DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`,
                )
              },
            }}
            secondaryButton={{
              text: formatMessage(
                strings.confirmStatementAfterDeadlineModalSecondaryButtonText,
              ),
              onClick: () => {
                setModalVisible('NoModal')
              },
            }}
          />
        )}
      </PageLayout>
    </>
  )
}

export default CaseOverview
