import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  isCompletedCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  AppealCaseFilesOverview,
  AppealRulingModifiedAlert,
  CaseDates,
  CaseResentExplanation,
  CaseScheduledCard,
  CaseTitleInfoAndTags,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  MarkdownWrapper,
  PageHeader,
  PageLayout,
  PdfButton,
  RulingModifiedAlert,
  SignedDocument,
  UserContext,
  ZipButton,
} from '@island.is/judicial-system-web/src/components'
import InfoCard from '@island.is/judicial-system-web/src/components/InfoCard/InfoCard'
import useInfoCardItems from '@island.is/judicial-system-web/src/components/InfoCard/useInfoCardItems'
import { canDefenderViewRequest } from '@island.is/judicial-system-web/src/components/RequestCaseDefenderInfo/RequestCaseDefenderInfo.logic'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import { useAppealCaseBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { strings } from './CaseOverview.strings'

export const CaseOverview = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)

  const { formatMessage } = useIntl()
  const { appealBanner, appealModals } = useAppealCaseBanner()
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
  } = useInfoCardItems()

  const shouldDisplayAppealBanner =
    isCompletedCase(workingCase.state) &&
    (workingCase.canDefenderAppeal || workingCase.hasBeenAppealed)

  const shouldDisplayDocuments = canDefenderViewRequest({
    defendants: workingCase.defendants,
    nationalId: user?.nationalId,
    state: workingCase.state,
    hasArraignmentDate: Boolean(workingCase.arraignmentDate?.date),
  })

  return (
    <>
      {shouldDisplayAppealBanner && appealBanner}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={titles.defender.caseOverview} />
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
                  title={formatMessage(
                    {
                      id: strings.modifiedDatesHeading,
                      defaultMessage: strings.modifiedDatesHeading,
                    },
                    {
                      caseType: workingCase.type,
                    },
                  )}
                  message={
                    <MarkdownWrapper
                      markdown={workingCase.caseModifiedExplanation}
                      textProps={{ variant: 'small' }}
                    />
                  }
                />
              </Box>
            )}
          <Box className={stack({ gap: 5 })} marginBottom={5}>
            <AppealRulingModifiedAlert />
            <RulingModifiedAlert />
          </Box>
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
                {
                  id: 'victims-section',
                  items: [victims],
                },
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
                ...(workingCase.appealCase?.appealCaseNumber
                  ? [
                      {
                        id: 'court-of-appeal-section',
                        items: [
                          appealCaseNumber,
                          ...(appealAssistant ? [appealAssistant] : []),
                          ...(workingCase.appealCase?.appealJudge1 &&
                          workingCase.appealCase?.appealJudge2 &&
                          workingCase.appealCase?.appealJudge3
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
                title={conclusion.title}
                conclusionText={workingCase.conclusion}
                judgeName={workingCase.judge?.name}
              />
            </Box>
          )}
          {workingCase.appealCase?.appealConclusion && (
            <Box marginBottom={6}>
              <Conclusion
                title={conclusion.appealTitle}
                conclusionText={workingCase.appealCase?.appealConclusion}
              />
            </Box>
          )}
          <Box marginBottom={6}>
            <AppealCaseFilesOverview />
          </Box>
          {shouldDisplayDocuments && (
            <Box marginBottom={10}>
              <Text as="h3" variant="h3" marginBottom={1}>
                {strings.documentHeading}
              </Text>
              <Box>
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={core.pdfButtonRequest}
                  pdfType="request"
                  elementId={core.pdfButtonRequest}
                />
                {isCompletedCase(workingCase.state) && (
                  <>
                    <PdfButton
                      renderAs="row"
                      caseId={workingCase.id}
                      title={core.pdfButtonRulingShortVersion}
                      pdfType="courtRecord"
                      elementId={core.pdfButtonRulingShortVersion}
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
                      title={core.pdfButtonRuling}
                      pdfType="ruling"
                      elementId={core.pdfButtonRuling}
                      disabled={workingCase.isCompletedWithoutRuling || false}
                    >
                      {workingCase.rulingSignatureDate ? (
                        <SignedDocument
                          signatory={workingCase.judge?.name}
                          signingDate={workingCase.rulingSignatureDate}
                        />
                      ) : workingCase.isCompletedWithoutRuling ? (
                        <Text>{strings.noRuling}</Text>
                      ) : (
                        <Text>{strings.unsignedRuling}</Text>
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
        {appealModals}
      </PageLayout>
    </>
  )
}

export default CaseOverview
