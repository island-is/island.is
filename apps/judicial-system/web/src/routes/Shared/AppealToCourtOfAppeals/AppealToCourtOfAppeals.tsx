import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  FileUploadStatus,
  InputFileUpload,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isCompletedCase,
  isDefenceUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  RequestAppealRulingNotToBePublishedCheckbox,
  RulingDateLabel,
  RulingFileLabel,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useAppealCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  getDefenceUserPartyIds,
  isMatchingAppealCaseFile,
} from '@island.is/judicial-system-web/src/utils/utils'

const AppealToCourtOfAppeals = () => {
  const { workingCase, refreshCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const rulingFileId = router.query.rulingFileId?.toString()
  const [visibleModal, setVisibleModal] = useState<'APPEAL_SENT'>()
  const { defendantId, civilClaimantId } = getDefenceUserPartyIds(
    workingCase,
    user,
  )
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
    civilClaimantId,
    rulingFileId,
  )
  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })
  const { createAppealCase, isCreatingAppealCase } = useAppealCase()

  const appealBriefType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF
  const appealCaseFilesType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE
  const previousUrl = `${
    isDefenceUser(user)
      ? isIndictmentCase(workingCase.type)
        ? constants.DEFENDER_INDICTMENT_ROUTE
        : constants.DEFENDER_ROUTE
      : isIndictmentCase(workingCase.type)
      ? isCompletedCase(workingCase.state)
        ? constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE
        : constants.INDICTMENTS_OVERVIEW_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${workingCase.id}`

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    const appealCase = await createAppealCase(workingCase.id, rulingFileId)

    refreshCase()

    if (appealCase) {
      setVisibleModal('APPEAL_SENT')
    }
  }, [
    handleUpload,
    uploadFiles,
    updateUploadFile,
    createAppealCase,
    workingCase.id,
    rulingFileId,
    refreshCase,
  ])

  const handleRemoveFile = (file: UploadFile) => {
    if (file.key) {
      handleRemove(file, removeUploadFile)
    } else {
      removeUploadFile(file)
    }
  }

  const handleChange = (files: File[], category: CaseFileCategory) => {
    addUploadFiles(files, {
      category,
      status: FileUploadStatus.done,
      defendantId,
      civilClaimantId,
      rulingFileId,
    })
  }

  const filter = (file: TUploadFile, category: CaseFileCategory): boolean => {
    return isMatchingAppealCaseFile(
      workingCase,
      [category],
      file,
      user,
      rulingFileId,
    )
  }
  const appealBriefFiles = uploadFiles.filter((file) =>
    filter(file, appealBriefType),
  )

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <PageTitle>Kæra til Landsréttar</PageTitle>
        <Box component="section" marginBottom={5}>
          <Text variant="h2" as="h2">
            {`Mál nr. ${workingCase.courtCaseNumber}`}
          </Text>
          {workingCase.rulingDate && (
            <RulingDateLabel rulingDate={workingCase.rulingDate} as="h3" />
          )}
          <RulingFileLabel
            caseFiles={workingCase.caseFiles}
            rulingFileId={rulingFileId}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title="Kæra" required />
          <InputFileUpload
            name="appealBrief"
            files={appealBriefFiles}
            accept={'application/pdf'}
            title={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => handleChange(files, appealBriefType)}
            onRemove={(file) => {
              handleRemoveFile(file)
            }}
            onOpenFile={(file) => onOpenFile(file)}
            hideIcons={!allFilesDoneOrError}
            disabled={!allFilesDoneOrError}
          />
        </Box>
        <Box
          component="section"
          marginBottom={isProsecutionUser(user) ? 5 : 10}
        >
          <SectionHeading title="Gögn" marginBottom={1} />
          <Text marginBottom={3} whiteSpace="pre">
            Ef ný gögn eiga að fylgja kærunni er hægt að hlaða þeim upp hér að
            neðan.
            {'\n'}
            {!isIndictmentCase(workingCase.type) &&
              !isDefenceUser(user) &&
              'Athugið að gögn sem hér er hlaðið upp verða einungis sýnileg Landsrétti.'}
          </Text>
          <InputFileUpload
            name="appealCaseFiles"
            files={uploadFiles.filter((file) =>
              filter(file, appealCaseFilesType),
            )}
            accept={'application/pdf'}
            title={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => handleChange(files, appealCaseFilesType)}
            onRemove={(file) => handleRemoveFile(file)}
            onOpenFile={(file) => onOpenFile(file)}
            hideIcons={!allFilesDoneOrError}
            disabled={!allFilesDoneOrError}
          />
        </Box>
        {!isIndictmentCase(workingCase.type) && isProsecutionUser(user) && (
          <Box component="section" marginBottom={10}>
            <RequestAppealRulingNotToBePublishedCheckbox />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={handleNextButtonClick}
          nextButtonText={someFilesError ? 'Reyna aftur' : 'Senda kæru'}
          nextIsDisabled={appealBriefFiles.length === 0 || isCreatingAppealCase}
          nextIsLoading={!allFilesDoneOrError || isCreatingAppealCase}
          nextButtonIcon={undefined}
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === 'APPEAL_SENT' && (
        <Modal
          title="Kæra hefur verið send viðkomandi héraðsdómstól"
          text="Tilkynning um móttöku kæru verður send á aðila máls."
          secondaryButton={{
            text: formatMessage(core.closeModal),
            onClick: () => router.push(previousUrl),
          }}
        />
      )}
    </PageLayout>
  )
}

export default AppealToCourtOfAppeals
