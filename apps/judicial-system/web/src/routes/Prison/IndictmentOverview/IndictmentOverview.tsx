import { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardClosedIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  RenderFiles,
} from '@island.is/judicial-system-web/src/components'
import { useSentToPrisonAdminDate } from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  PunishmentType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import {
  useDefendants,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const { limitedAccessUpdateDefendant, updateDefendantState } = useDefendants()

  const { onOpen } = useFileList({
    caseId: workingCase.id,
  })

  const { defendants } = workingCase
  const defendant =
    defendants && defendants?.length > 0 ? defendants[0] : undefined

  const onChange = (updatedPunishmentType: PunishmentType) => {
    if (!defendant) return

    const defendantUpdate = {
      defendantId: defendant.id,
      caseId: workingCase.id,
      punishmentType: updatedPunishmentType,
    }
    updateDefendantState(defendantUpdate, setWorkingCase)
    limitedAccessUpdateDefendant(defendantUpdate)
  }

  const sentToPrisonAdminFiles = workingCase.caseFiles?.filter(
    (file) => file.category === CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
  )
  const criminalRecordUpdateFile = workingCase.caseFiles?.filter(
    (file) => file.category === CaseFileCategory.CRIMINAL_RECORD_UPDATE,
  )

  const sentToPrisonAdminDate = useSentToPrisonAdminDate(workingCase)
  const isCompletedWithRuling =
    workingCase.indictmentRulingDecision === CaseIndictmentRulingDecision.RULING

  const displaySentToPrisonAdminFiles =
    (isCompletedWithRuling && sentToPrisonAdminDate) ||
    isNonEmptyArray(sentToPrisonAdminFiles)

  const hasPunishmentType = (punishmentType: PunishmentType) =>
    defendant?.punishmentType === punishmentType
  const hasRuling = workingCase.caseFiles?.some(
    (file) => file.category === CaseFileCategory.RULING,
  )
  const fileCategory = hasRuling
    ? CaseFileCategory.RULING
    : CaseFileCategory.COURT_RECORD

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(strings.htmlTitle)} />
      <FormContentContainer>
        <PageTitle previousUrl={constants.PRISON_CASES_ROUTE}>
          {formatMessage(strings.title, {
            isFine:
              workingCase.indictmentRulingDecision ===
              CaseIndictmentRulingDecision.FINE,
          })}
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
          {workingCase.indictmentCompletedDate && (
            <Text variant="h4" as="h3">
              {formatMessage(strings.indictmentCompletedTitle, {
                date: formatDate(workingCase.indictmentCompletedDate, 'PPP'),
              })}
            </Text>
          )}
          {defendant?.openedByPrisonAdminDate && (
            <Text variant="h4" as="h3">
              {formatMessage(strings.indictmentReceivedTitle, {
                date: formatDate(defendant.openedByPrisonAdminDate, 'PPP'),
              })}
            </Text>
          )}
        </Box>
        <Box marginBottom={5}>
          <InfoCardClosedIndictment displayVerdictViewDate />
        </Box>
        {isNonEmptyArray(criminalRecordUpdateFile) && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(strings.criminalRecordUpdateSection)}
            </Text>
            <RenderFiles
              onOpenFile={onOpen}
              caseFiles={criminalRecordUpdateFile}
            />
          </Box>
        )}
        <Box marginBottom={5}>
          <Text variant="h4" as="h4" marginBottom={1}>
            {formatMessage(
              hasRuling ? strings.verdictTitle : strings.courtRecordTitle,
            )}
          </Text>
          <RenderFiles
            onOpenFile={onOpen}
            caseFiles={
              workingCase.caseFiles?.filter(
                (file) => file.category === fileCategory,
              ) ?? []
            }
          />
        </Box>
        {displaySentToPrisonAdminFiles && (
          <Box marginBottom={5}>
            <Text variant="h4" as="h4" marginBottom={1}>
              {formatMessage(strings.sentToPrisonAdminFileTitle)}
            </Text>
            {sentToPrisonAdminFiles && sentToPrisonAdminFiles.length > 0 && (
              <RenderFiles
                onOpenFile={onOpen}
                caseFiles={sentToPrisonAdminFiles}
              />
            )}
            {isCompletedWithRuling && sentToPrisonAdminDate && (
              <PdfButton
                caseId={workingCase.id}
                title={`Dómur til fullnustu ${formatDate(
                  sentToPrisonAdminDate,
                )}.pdf`}
                pdfType="rulingSentToPrisonAdmin"
                elementId={'Dómur til fullnustu'}
                renderAs="row"
              />
            )}
          </Box>
        )}
        <Box marginBottom={10}>
          <Text variant="h4" as="h4" marginBottom={2}>
            {formatMessage(strings.punishmentTypeTitle)}
          </Text>
          <BlueBox>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-imprisonment"
                name="punishmentTypeImprisonment"
                checked={hasPunishmentType(PunishmentType.IMPRISONMENT)}
                onChange={() => {
                  onChange(PunishmentType.IMPRISONMENT)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.punishmentTypeImprisonment)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-probation"
                name="punishmentTypeProbation"
                checked={hasPunishmentType(PunishmentType.PROBATION)}
                onChange={() => {
                  onChange(PunishmentType.PROBATION)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.punishmentTypeProbation)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-fine"
                name="punishmentTypeFine"
                checked={hasPunishmentType(PunishmentType.FINE)}
                onChange={() => {
                  onChange(PunishmentType.FINE)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.punishmentTypeFine)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-indictment-ruling-decision-fine"
                name="punishmentTypeIndictmentRulingDecisionFine"
                checked={hasPunishmentType(
                  PunishmentType.INDICTMENT_RULING_DECISION_FINE,
                )}
                onChange={() => {
                  onChange(PunishmentType.INDICTMENT_RULING_DECISION_FINE)
                }}
                large
                backgroundColor="white"
                label={formatMessage(
                  strings.punishmentTypeIndictmentRulingDecisionFine,
                )}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="punishment-type-indictment-signed-fine-invitation"
                name="punishmentTypeIndictmentSignedFineInvitation"
                checked={hasPunishmentType(
                  PunishmentType.SIGNED_FINE_INVITATION,
                )}
                onChange={() => {
                  onChange(PunishmentType.SIGNED_FINE_INVITATION)
                }}
                large
                backgroundColor="white"
                label={formatMessage(
                  strings.punishmentTypeSignedFineInvitation,
                )}
              />
            </Box>
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter previousUrl={constants.PRISON_CASES_ROUTE} hideNextButton />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
