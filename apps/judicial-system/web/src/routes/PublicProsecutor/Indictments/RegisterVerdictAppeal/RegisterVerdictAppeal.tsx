import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import type { UploadFile } from '@island.is/island-ui/core'
import {
  Box,
  FileUploadStatus,
  InputFileUpload,
  Text,
} from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { Feature } from '@island.is/judicial-system/types'
import { core, errors } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  DateTime,
  FeatureContext,
  FormContentContainer,
  FormContext,
  FormFooter,
  InputAdvocate,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  canRegisterVerdictAppeal,
  isAfterVerdictAppealDeadline,
} from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/VerdictTimelineCard.logic'
import DateLabel from '@island.is/judicial-system-web/src/components/DateLabel/DateLabel'
import { canViewVerdictAppealFile } from '@island.is/judicial-system-web/src/components/VerdictAppealFiles/VerdictAppealFiles.logic'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  formatDateForServer,
  useAppealCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import type { AppealDefender } from '@island.is/judicial-system-web/src/utils/hooks/useAppealCase'
import { toast } from '@island.is/judicial-system-web/src/utils/toast'

/**
 * The public prosecution office registers a verdict appeal that reached it
 * outside the system - by letter or email, typically from a new defender who is
 * not in the system - for the defendant selected by the defendantId route
 * parameter. The office files the declaration it received (required), dates the
 * appeal to the filing and names the defender who made it. The defender is
 * recorded as information only; no access follows until the court of appeals
 * confirms them.
 *
 * Registering after the deadline is allowed - the appeal already happened - but
 * is confirmed as such. The page guards itself the way the defender's does:
 * while the feature flags load it shows the loading state, and when the feature
 * is hidden, or the defendant is not one an appeal may be registered for, it
 * sends the user back to the overview. The backend enforces the same rules again.
 */
const RegisterVerdictAppeal = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound, refreshCase } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const { features, isLoading: isLoadingFeatures } = useContext(FeatureContext)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [appealDate, setAppealDate] = useState<Date>()
  const [appealDefender, setAppealDefender] = useState<AppealDefender>({})

  const defendantId = router.query.defendantId?.toString()
  const defendant = workingCase.defendants?.find(
    (candidate) => candidate.id === defendantId,
  )
  const overviewUrl = `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE}/${workingCase.id}`

  const isFeatureEnabled = features.includes(Feature.INDICTMENT_APPEAL)
  const mayRegister =
    defendant !== undefined &&
    canRegisterVerdictAppeal(workingCase, defendant, user)

  useEffect(() => {
    if (isLoadingWorkingCase || isLoadingFeatures || caseNotFound) {
      return
    }

    if (!isFeatureEnabled || !mayRegister) {
      router.replace(overviewUrl)
    }
  }, [
    isLoadingWorkingCase,
    isLoadingFeatures,
    caseNotFound,
    isFeatureEnabled,
    mayRegister,
    router,
    overviewUrl,
  ])

  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRemove } = useS3Upload(
    workingCase.id,
    defendantId,
  )
  const { onOpenFile } = useFileList({ caseId: workingCase.id })
  const { registerVerdictAppeal, isCreatingAppealCase } = useAppealCase()

  // Only this defendant's files of the category: an appeal is registered for one
  // defendant at a time.
  const filesOf = (category: CaseFileCategory): TUploadFile[] =>
    uploadFiles.filter(
      (file) =>
        file.defendantId === defendantId &&
        canViewVerdictAppealFile(workingCase, [category], file, user),
    )
  const declarationFiles = filesOf(
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
  )
  const declarationCaseFiles = filesOf(
    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
  )

  const handleChange = (files: File[], category: CaseFileCategory) => {
    addUploadFiles(files, {
      category,
      status: FileUploadStatus.done,
      defendantId,
    })
  }

  const handleRemoveFile = (file: UploadFile) => {
    if (file.key) {
      handleRemove(file, removeUploadFile)
    } else {
      removeUploadFile(file)
    }
  }

  const handleAppealDateChange = (date: Date | undefined, valid: boolean) => {
    if (!date) {
      setAppealDate(undefined)
      return
    }

    if (!valid) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    setAppealDate(date)
  }

  const handleRegister = useCallback(async () => {
    setIsConfirming(false)

    if (!defendantId || !appealDate) {
      return
    }

    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    const appealCase = await registerVerdictAppeal(
      workingCase.id,
      defendantId,
      formatDateForServer(appealDate),
      appealDefender,
    )

    if (!appealCase) {
      return
    }

    // The overview reads the appeal off the verdict, the defendant and the new
    // appeal case, none of which the mutation result carries, so the case is
    // reloaded.
    refreshCase()
    router.push(overviewUrl)
  }, [
    defendantId,
    appealDate,
    appealDefender,
    handleUpload,
    uploadFiles,
    updateUploadFile,
    registerVerdictAppeal,
    workingCase.id,
    refreshCase,
    router,
    overviewUrl,
  ])

  const isReady = !isLoadingWorkingCase && !isLoadingFeatures
  const isAfterDeadline =
    defendant !== undefined &&
    appealDate !== undefined &&
    isAfterVerdictAppealDeadline(defendant, appealDate)

  // The confirmation states what is about to be registered. An appeal after
  // the deadline ran out is pointed out there rather than in a second modal.
  const confirmationText = [
    isAfterDeadline
      ? `Áfrýjunarfrestur rann út ${formatDate(
          defendant?.verdictAppealDeadline,
        )}.`
      : undefined,
    `Dagsetning áfrýjunar: ${formatDate(appealDate)}`,
    appealDefender.name
      ? `Verjandi sem áfrýjar: ${appealDefender.name}`
      : undefined,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={!isReady}
      notFound={caseNotFound}
    >
      <PageHeader title="Áfrýjun til Landsréttar - Réttarvörslugátt" />
      {isReady && isFeatureEnabled && mayRegister && (
        <>
          <FormContentContainer>
            <PageTitle>Áfrýjun til Landsréttar</PageTitle>
            <Box component="section" marginBottom={5}>
              <Text variant="h2" as="h2">
                {`Mál nr. ${workingCase.courtCaseNumber}`}
              </Text>
              {workingCase.rulingDate && (
                <DateLabel
                  text="Dómsuppkvaðning"
                  date={workingCase.rulingDate}
                  hideTime
                  as="h3"
                />
              )}
            </Box>
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Áfrýjunaryfirlýsing" required />
              <InputFileUpload
                name="appealDeclaration"
                files={declarationFiles}
                accept="application/pdf"
                title={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                onChange={(files) =>
                  handleChange(
                    files,
                    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
                  )
                }
                onRemove={handleRemoveFile}
                onOpenFile={(file) => onOpenFile(file)}
                hideIcons={!allFilesDoneOrError}
                disabled={!allFilesDoneOrError}
              />
            </Box>
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Gögn" marginBottom={1} />
              <Text marginBottom={3}>
                Ef ný gögn eiga að fylgja áfrýjunaryfirlýsingu er hægt að hlaða
                þeim upp hér að neðan.
              </Text>
              <InputFileUpload
                name="appealDeclarationCaseFiles"
                files={declarationCaseFiles}
                accept="application/pdf"
                title={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                onChange={(files) =>
                  handleChange(
                    files,
                    CaseFileCategory.DEFENDANT_APPEAL_DECLARATION_CASE_FILE,
                  )
                }
                onRemove={handleRemoveFile}
                onOpenFile={(file) => onOpenFile(file)}
                hideIcons={!allFilesDoneOrError}
                disabled={!allFilesDoneOrError}
              />
            </Box>
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Dagsetning áfrýjunar" />
              <DateTime
                name="appealDate"
                datepickerLabel="Dagsetning áfrýjunar"
                datepickerPlaceholder="Veldu dagsetningu"
                selectedDate={appealDate}
                maxDate={new Date()}
                onChange={handleAppealDateChange}
                required
                dateOnly
              />
            </Box>
            <Box component="section" marginBottom={10}>
              <SectionHeading title="Verjandi sem áfrýjar" />
              <BlueBox>
                <InputAdvocate
                  advocateType="defender"
                  name={appealDefender.name}
                  email={appealDefender.email}
                  phoneNumber={appealDefender.phoneNumber}
                  onAdvocateChange={(name, nationalId, email, phoneNumber) =>
                    setAppealDefender({ name, nationalId, email, phoneNumber })
                  }
                  onEmailChange={(email) =>
                    setAppealDefender((prev) => ({ ...prev, email }))
                  }
                  onEmailSave={(email) =>
                    setAppealDefender((prev) => ({ ...prev, email }))
                  }
                  onPhoneNumberChange={(phoneNumber) =>
                    setAppealDefender((prev) => ({ ...prev, phoneNumber }))
                  }
                  onPhoneNumberSave={(phoneNumber) =>
                    setAppealDefender((prev) => ({ ...prev, phoneNumber }))
                  }
                />
              </BlueBox>
            </Box>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={overviewUrl}
              actions={[
                {
                  text: someFilesError ? 'Reyna aftur' : 'Skrá áfrýjun',
                  colorScheme: someFilesError ? 'destructive' : 'default',
                  onClick: () => setIsConfirming(true),
                  disabled:
                    declarationFiles.length === 0 ||
                    !appealDate ||
                    isCreatingAppealCase,
                  loading: !allFilesDoneOrError || isCreatingAppealCase,
                  testId: 'continueButton',
                },
              ]}
            />
          </FormContentContainer>
          {isConfirming && (
            <Modal
              title={
                isAfterDeadline
                  ? 'Áfrýjun eftir að fresti lauk'
                  : 'Viltu skrá áfrýjun?'
              }
              text={confirmationText}
              buttons={[
                {
                  text: 'Hætta við',
                  onClick: () => setIsConfirming(false),
                  variant: 'ghost',
                },
                {
                  text: 'Já, skrá áfrýjun',
                  onClick: handleRegister,
                  isLoading: isCreatingAppealCase,
                },
              ]}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default RegisterVerdictAppeal
