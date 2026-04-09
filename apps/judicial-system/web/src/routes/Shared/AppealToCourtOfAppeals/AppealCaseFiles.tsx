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
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  getAppealActorText,
  getDefenceUserPartyIds,
} from '@island.is/judicial-system-web/src/utils/utils'

const AppealFiles = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const { defendantId, civilClaimantId } = getDefenceUserPartyIds(
    user,
    workingCase,
  )
  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles()
  const { handleUpload, handleRemove } = useS3Upload(
    workingCase.id,
    defendantId,
    civilClaimantId,
  )
  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })
  const { sendNotification } = useCase()

  const appealCaseFilesType = isDefenceUser(user)
    ? CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE
    : CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE

  const caseFilesTypesToDisplay = isDefenceUser(user)
    ? [
        CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
      ]
    : [
        CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
      ]

  const previousUrl = `${
    isDefenceUser(user)
      ? isIndictmentCase(workingCase.type)
        ? constants.DEFENDER_INDICTMENT_ROUTE
        : constants.DEFENDER_ROUTE
      : isIndictmentCase(workingCase.type)
      ? constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${id}`

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    sendNotification(workingCase.id, NotificationType.APPEAL_CASE_FILES_UPDATED)

    setVisibleModal(true)
  }, [
    handleUpload,
    uploadFiles,
    sendNotification,
    updateUploadFile,
    workingCase.id,
  ])

  const handleRemoveFile = (file: UploadFile) => {
    if (file.key) {
      handleRemove(file, removeUploadFile)
    } else {
      removeUploadFile(file)
    }
  }

  const handleChange = (files: File[]) => {
    addUploadFiles(files, {
      category: appealCaseFilesType,
      status: FileUploadStatus.done,
    })
  }

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <PageTitle previousUrl={previousUrl}>Gögn</PageTitle>
        <Box marginBottom={7}>
          {workingCase.rulingDate && (
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          )}
          {(workingCase.prosecutorPostponedAppealDate ||
            workingCase.accusedPostponedAppealDate) && (
            <Text variant="h5" as="h5">
              {getAppealActorText(workingCase)}
            </Text>
          )}
        </Box>
        <Box
          component="section"
          marginBottom={isProsecutionUser(user) ? 5 : 10}
        >
          <SectionHeading title="Gögn" marginBottom={1} />
          <Text marginBottom={3} whiteSpace="pre">
            {
              'Ef ný gögn eiga að fylgja kærunni er hægt að hlaða þeim upp hér að neðan.'
            }
            {'\n'}
            {!isDefenceUser(user) &&
              'Athugið að gögn sem hér er hlaðið upp verða einungis sýnileg Landsrétti.'}
          </Text>
          <InputFileUpload
            name="appealCaseFiles"
            files={uploadFiles.filter(
              (file) =>
                file.category &&
                caseFilesTypesToDisplay.includes(file.category),
            )}
            accept={'application/pdf'}
            title={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={handleChange}
            onRemove={handleRemoveFile}
            hideIcons={!allFilesDoneOrError}
            disabled={!allFilesDoneOrError}
            onOpenFile={(file) => onOpenFile(file)}
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
          nextButtonText={someFilesError ? 'Reyna aftur' : 'Senda gögn'}
          nextIsLoading={!allFilesDoneOrError}
          nextIsDisabled={uploadFiles.length === 0 || !allFilesDoneOrError}
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === true && (
        <Modal
          title="Gögn hafa verið send Landsrétti"
          text="Tilkynning hefur verið send Landsrétti og aðilum máls."
          secondaryButton={{
            text: formatMessage(core.closeModal),
            onClick: () => router.push(previousUrl),
          }}
        />
      )}
    </PageLayout>
  )
}

export default AppealFiles
