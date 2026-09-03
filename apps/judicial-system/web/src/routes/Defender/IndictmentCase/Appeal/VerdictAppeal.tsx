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
import { DEFENDER_INDICTMENT_CASE_ROUTE } from '@island.is/judicial-system/consts'
import { Feature } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  FeatureContext,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import DateLabel from '@island.is/judicial-system-web/src/components/DateLabel/DateLabel'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  useAppealCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isMatchingAppealCaseFile } from '@island.is/judicial-system-web/src/utils/utils'

import { canDefenderAppealVerdictOf } from '../verdictAppealActions.logic'

/**
 * A defender files an áfrýjun - the appeal of an indictment verdict - to
 * Landsréttur for one of their defendants, selected by the defendantId query
 * parameter. The declaration (áfrýjunaryfirlýsing) is required; further files
 * may come with it. Filing is confirmed in a modal before anything is sent,
 * since the declaration is the legal act itself.
 *
 * The page guards itself: while the feature flags load it shows the loading
 * state, and when the feature is hidden, or the defendant is not one this user
 * may appeal for, it sends the user back to the overview. The backend enforces
 * the same rules again.
 */
const VerdictAppeal = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound, refreshCase } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const { features, isLoading: isLoadingFeatures } = useContext(FeatureContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const [isConfirming, setIsConfirming] = useState<boolean>(false)

  const defendantId = router.query.defendantId?.toString()
  const defendant = workingCase.defendants?.find(
    (candidate) => candidate.id === defendantId,
  )
  const overviewUrl = `${DEFENDER_INDICTMENT_CASE_ROUTE}/${workingCase.id}`

  const isFeatureEnabled = features.includes(Feature.INDICTMENT_APPEAL)
  const mayAppeal =
    defendant !== undefined &&
    canDefenderAppealVerdictOf(workingCase, defendant, user)

  useEffect(() => {
    if (isLoadingWorkingCase || isLoadingFeatures || caseNotFound) {
      return
    }

    if (!isFeatureEnabled || !mayAppeal) {
      router.replace(overviewUrl)
    }
  }, [
    isLoadingWorkingCase,
    isLoadingFeatures,
    caseNotFound,
    isFeatureEnabled,
    mayAppeal,
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
  const { createVerdictAppeal, isCreatingAppealCase } = useAppealCase()

  // Only this defendant's files of the category: a defender with several
  // defendants on the case appeals for each of them separately.
  const filesOf = (category: CaseFileCategory): TUploadFile[] =>
    uploadFiles.filter(
      (file) =>
        file.defendantId === defendantId &&
        isMatchingAppealCaseFile(workingCase, [category], file, user),
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

  const handleAppeal = useCallback(async () => {
    setIsConfirming(false)

    if (!defendantId) {
      return
    }

    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    const appealCase = await createVerdictAppeal(workingCase.id, defendantId)

    if (!appealCase) {
      return
    }

    // The overview reads the appeal off the verdict and the new appeal case,
    // neither of which the mutation result carries, so the case is reloaded.
    refreshCase()
    router.push(overviewUrl)
  }, [
    defendantId,
    handleUpload,
    uploadFiles,
    updateUploadFile,
    createVerdictAppeal,
    workingCase.id,
    refreshCase,
    router,
    overviewUrl,
  ])

  const isReady = !isLoadingWorkingCase && !isLoadingFeatures

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={!isReady}
      notFound={caseNotFound}
    >
      <PageHeader title="Áfrýjun til Landsréttar - Réttarvörslugátt" />
      {isReady && isFeatureEnabled && mayAppeal && (
        <>
          <FormContentContainer>
            <PageTitle>Áfrýjun til Landsréttar</PageTitle>
            <Box component="section" marginBottom={5}>
              <Text variant="h2" as="h2">
                {`Mál nr. ${workingCase.courtCaseNumber}`}
              </Text>
              {workingCase.rulingDate && (
                <DateLabel
                  text="Máli lokið"
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
            <Box component="section" marginBottom={10}>
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
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={overviewUrl}
              actions={[
                {
                  text: someFilesError ? 'Reyna aftur' : 'Áfrýja dómi',
                  colorScheme: someFilesError ? 'destructive' : 'default',
                  onClick: () => setIsConfirming(true),
                  disabled:
                    declarationFiles.length === 0 || isCreatingAppealCase,
                  loading: !allFilesDoneOrError || isCreatingAppealCase,
                  testId: 'continueButton',
                },
              ]}
            />
          </FormContentContainer>
          {isConfirming && (
            <Modal
              title="Viltu áfrýja dómi?"
              text="Ríkissaksóknari fær tilkynningu um áfrýjun."
              buttons={[
                {
                  text: 'Hætta við',
                  onClick: () => setIsConfirming(false),
                  variant: 'ghost',
                },
                {
                  text: 'Já, áfrýja',
                  onClick: handleAppeal,
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

export default VerdictAppeal
