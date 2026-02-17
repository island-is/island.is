import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Option, Text, toast } from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  hasGeneratedCourtRecordPdf,
  isCompletedCase,
  isRulingOrDismissalCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  Conclusion,
  FormContentContainer,
  FormContext,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  RenderFiles,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  getIdAndTitleForPdfButtonForRulingSentToPrisonPdf,
  useSentToPrisonAdminDate,
} from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  Defendant,
  IndictmentCaseReviewDecision,
  PunishmentType,
  ServiceRequirement,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import {
  useDefendants,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { DefendantPrisonAdminCard } from './DefendantPrisonAdminCard'

const getDefendantExplanation = (defendant: Defendant): string => {
  if (
    defendant.indictmentReviewDecision === IndictmentCaseReviewDecision.APPEAL
  ) {
    return 'Áfrýjun'
  }

  if (
    defendant.verdict?.serviceRequirement === ServiceRequirement.REQUIRED &&
    !defendant.verdict?.serviceDate
  ) {
    return 'Dómur er í birtingarferli'
  }

  return 'Ekki sent til fullnustu'
}

const IndictmentOverview = () => {
  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const { limitedAccessUpdateDefendant, updateDefendantState } = useDefendants()

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const sentToPrisonAdminFiles = workingCase.caseFiles?.filter(
    (file) => file.category === CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
  )
  const criminalRecordUpdateFile = workingCase.caseFiles?.filter(
    (file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
  )

  const sentToPrisonAdminDate = useSentToPrisonAdminDate(workingCase)

  const { pdfTitle, isCompletedWithRulingOrFine } =
    getIdAndTitleForPdfButtonForRulingSentToPrisonPdf(
      workingCase.indictmentRulingDecision ?? undefined,
      sentToPrisonAdminDate,
    )

  const displaySentToPrisonAdminFiles =
    (isCompletedWithRulingOrFine && sentToPrisonAdminDate) ||
    isNonEmptyArray(sentToPrisonAdminFiles)

  const hasRuling = workingCase.caseFiles?.some(
    (file) => file.category === CaseFileCategory.RULING,
  )
  const fileCategory = hasRuling
    ? CaseFileCategory.RULING
    : CaseFileCategory.COURT_RECORD

  // We show a court record pdf button if the case does not have a ruling
  // and it should have court sessions (not an uploaded court record)
  const showGeneratedCourtRecord = !hasRuling && workingCase.withCourtSessions
  // We disable the court record pdf button if the court record pdf does not exist (should not happen)
  const hasGeneratedCourtRecord = hasGeneratedCourtRecordPdf(
    workingCase.state,
    workingCase.indictmentRulingDecision,
    workingCase.withCourtSessions,
    workingCase.courtSessions,
    user,
  )

  const handlePunishmentTypeChange = useCallback(
    (defendant: Defendant, selectedOption: Option<PunishmentType> | null) => {
      if (!selectedOption) return

      const defendantUpdate = {
        defendantId: defendant.id,
        caseId: workingCase.id,
        punishmentType: selectedOption.value,
      }
      updateDefendantState(defendantUpdate, setWorkingCase)
      limitedAccessUpdateDefendant(defendantUpdate)
    },
    [
      workingCase.id,
      setWorkingCase,
      updateDefendantState,
      limitedAccessUpdateDefendant,
    ],
  )

  const handleToggleRegistration = useCallback(
    async (defendant: Defendant) => {
      const newValue = !defendant.isRegisteredInPrisonSystem

      const defendantUpdate = {
        defendantId: defendant.id,
        caseId: workingCase.id,
        isRegisteredInPrisonSystem: newValue,
      }

      updateDefendantState(defendantUpdate, setWorkingCase)

      const success = await limitedAccessUpdateDefendant(defendantUpdate)

      if (!success) {
        toast.error('Ekki tókst að uppfæra skráningu')
        updateDefendantState(
          { ...defendantUpdate, isRegisteredInPrisonSystem: !newValue },
          setWorkingCase,
        )
        return
      }

      toast.success(newValue ? 'Dómur skráður' : 'Dómur afskráður')
    },
    [
      workingCase.id,
      setWorkingCase,
      updateDefendantState,
      limitedAccessUpdateDefendant,
    ],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title="Yfirlit ákæru - Réttarvörslugátt" />
      <FormContentContainer>
        <PageTitle previousUrl={getStandardUserDashboardRoute(user)}>
          {workingCase.indictmentRulingDecision ===
          CaseIndictmentRulingDecision.FINE
            ? 'Viðurlagaákvörðun til fullnustu'
            : 'Dómur til fullnustu'}
        </PageTitle>
        <Box marginBottom={5}>
          {workingCase.courtCaseNumber && (
            <Box marginBottom={1}>
              <Text variant="h2" as="h2">
                {formatMessage(core.caseNumber, {
                  caseNumber: workingCase.courtCaseNumber,
                })}
              </Text>
            </Box>
          )}
          {workingCase.rulingDate && (
            <Text variant="h4" as="h3">
              {`Dómsuppkvaðning ${formatDate(workingCase.rulingDate, 'PPP')}`}
            </Text>
          )}
        </Box>

        {workingCase.defendants?.map((defendant) => {
          const isSentToPrisonAdmin = defendant.isSentToPrisonAdmin
          if (!isSentToPrisonAdmin) {
            return (
              <Box key={defendant.id} marginBottom={3}>
                <Text variant="h4" as="h4">
                  {defendant.name}
                </Text>
                <Box marginTop={1}>
                  <Text>{`\u2022 ${getDefendantExplanation(defendant)}`}</Text>
                </Box>
              </Box>
            )
          }

          return (
            <DefendantPrisonAdminCard
              key={defendant.id}
              defendant={defendant}
              onToggleRegistration={handleToggleRegistration}
              onPunishmentTypeChange={handlePunishmentTypeChange}
            />
          )
        })}

        <Box marginBottom={5}>
          <InfoCardClosedIndictment
            displayVerdictViewDate={false}
            displaySentToPrisonAdminDate={false}
          />
        </Box>

        {isCompletedCase(workingCase.state) &&
          isRulingOrDismissalCase(workingCase.indictmentRulingDecision) &&
          workingCase.courtSessions?.at(-1)?.ruling && (
            <Box component="section" marginBottom={5}>
              <Conclusion
                title={`${
                  workingCase.indictmentRulingDecision ===
                  CaseIndictmentRulingDecision.RULING
                    ? 'Dóms'
                    : 'Úrskurðar'
                }orð héraðsdóms`}
                conclusionText={workingCase.courtSessions?.at(-1)?.ruling}
                judgeName={workingCase.judge?.name}
              />
            </Box>
          )}
        {isNonEmptyArray(criminalRecordUpdateFile) && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              Tilkynning til sakaskrár
            </Text>
            <RenderFiles
              onOpenFile={onOpen}
              caseFiles={criminalRecordUpdateFile}
            />
          </Box>
        )}
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {hasRuling ? 'Dómur' : 'Þingbók'}
          </Text>
          {showGeneratedCourtRecord && (
            <PdfButton
              caseId={workingCase.id}
              title={`Þingbók ${workingCase.courtCaseNumber}.pdf`}
              pdfType="courtRecord"
              renderAs="row"
              elementId="Þingbók"
              disabled={!hasGeneratedCourtRecord}
            />
          )}
          <RenderFiles
            onOpenFile={onOpen}
            caseFiles={
              workingCase.caseFiles?.filter(
                (file) => file.category === fileCategory,
              ) ?? []
            }
          />
          {workingCase.defendants?.map((defendant) => {
            if (
              !defendant.verdict?.serviceDate ||
              !defendant.verdict?.externalPoliceDocumentId
            ) {
              return null
            }

            const serviceCertificateFileName = `Birtingarvottorð ${defendant.name}.pdf`

            return (
              <PdfButton
                key={defendant.id}
                caseId={workingCase.id}
                title={serviceCertificateFileName}
                pdfType="verdictServiceCertificate"
                elementId={[defendant.id, serviceCertificateFileName]}
                renderAs="row"
              />
            )
          })}
        </Box>
        {displaySentToPrisonAdminFiles && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              Fullnusta
            </Text>
            {sentToPrisonAdminFiles && sentToPrisonAdminFiles.length > 0 && (
              <RenderFiles
                onOpenFile={onOpen}
                caseFiles={sentToPrisonAdminFiles}
              />
            )}

            {isCompletedWithRulingOrFine && sentToPrisonAdminDate && (
              <PdfButton
                caseId={workingCase.id}
                title={pdfTitle}
                pdfType="rulingSentToPrisonAdmin"
                elementId={[pdfTitle]}
                renderAs="row"
              />
            )}
          </Box>
        )}
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
