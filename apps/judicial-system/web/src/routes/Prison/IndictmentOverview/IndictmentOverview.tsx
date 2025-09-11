import { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  ButtonTypes,
  IconMapIcon,
  RadioButton,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
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
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  getIdAndTitleForPdfButtonForRulingSentToPrisonPdf,
  useSentToPrisonAdminDate,
} from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  PunishmentType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isNonEmptyArray } from '@island.is/judicial-system-web/src/utils/arrayHelpers'
import {
  useCase,
  useDefendants,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './IndictmentOverview.strings'

const IndictmentOverview = () => {
  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { updateCase, isUpdatingCase } = useCase()

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

  const { pdfTitle, pdfElementId, isCompletedWithRulingOrFine } =
    getIdAndTitleForPdfButtonForRulingSentToPrisonPdf(
      workingCase.indictmentRulingDecision ?? undefined,
      sentToPrisonAdminDate,
    )

  const displaySentToPrisonAdminFiles =
    (isCompletedWithRulingOrFine && sentToPrisonAdminDate) ||
    isNonEmptyArray(sentToPrisonAdminFiles)

  const hasPunishmentType = (punishmentType: PunishmentType) =>
    defendant?.punishmentType === punishmentType
  const hasRuling = workingCase.caseFiles?.some(
    (file) => file.category === CaseFileCategory.RULING,
  )
  const fileCategory = hasRuling
    ? CaseFileCategory.RULING
    : CaseFileCategory.COURT_RECORD

  const savePunishmentType = async () => {
    const updatedCase = await updateCase(workingCase.id, {
      isRegisteredInPrisonSystem: !workingCase.isRegisteredInPrisonSystem,
    })

    if (!updatedCase) {
      toast.error('Tókst ekki að skrá í fangelsiskerfi')
      return
    }

    toast.success(
      !updatedCase.isRegisteredInPrisonSystem
        ? 'Dómur afskráður'
        : 'Dómur skráður',
    )

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      isRegisteredInPrisonSystem: updatedCase.isRegisteredInPrisonSystem,
    }))
  }

  const footerNextButtonText: {
    title: string
    colorScheme: ButtonTypes['colorScheme']
    icon: IconMapIcon
  } = !workingCase?.isRegisteredInPrisonSystem
    ? {
        title: 'Dómur skráður',
        colorScheme: 'default',
        icon: 'checkmark',
      }
    : {
        title: 'Afskrá dóm',
        colorScheme: 'destructive',
        icon: 'close',
      }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(strings.htmlTitle)} />
      <FormContentContainer>
        <PageTitle previousUrl={getStandardUserDashboardRoute(user)}>
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
          {workingCase.rulingDate && (
            <Text variant="h4" as="h3">
              {formatMessage(strings.indictmentCompletedTitle, {
                date: formatDate(workingCase.rulingDate, 'PPP'),
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

            {isCompletedWithRulingOrFine && sentToPrisonAdminDate && (
              <PdfButton
                caseId={workingCase.id}
                title={pdfTitle}
                pdfType="rulingSentToPrisonAdmin"
                elementId={pdfElementId}
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
            <RadioButton
              id="punishment-type-other"
              name="punishmentTypeOther"
              checked={hasPunishmentType(PunishmentType.OTHER)}
              onChange={() => {
                onChange(PunishmentType.OTHER)
              }}
              large
              backgroundColor="white"
              label="Annað"
            />
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={getStandardUserDashboardRoute(user)}
          nextButtonText={footerNextButtonText.title}
          onNextButtonClick={savePunishmentType}
          nextButtonColorScheme={footerNextButtonText.colorScheme}
          nextButtonIcon={footerNextButtonText.icon}
          nextIsLoading={isUpdatingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default IndictmentOverview
