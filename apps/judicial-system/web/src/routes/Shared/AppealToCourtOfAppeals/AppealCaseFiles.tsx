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
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isDefenceUser,
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
  CaseAppealDecision,
  CaseFileCategory,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AppealCaseFiles.strings'

const AppealFiles = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles()
  const { handleUpload, handleRemove } = useS3Upload(workingCase.id)
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
      ? constants.DEFENDER_ROUTE
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
        <PageTitle previousUrl={previousUrl}>
          {formatMessage(strings.title)}
        </PageTitle>
        <Box marginBottom={7}>
          {workingCase.rulingDate && (
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          )}
          {(workingCase.prosecutorPostponedAppealDate ||
            workingCase.accusedPostponedAppealDate) && (
            <Text variant="h5" as="h5">
              {workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.APPEAL ||
              workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
                ? formatMessage(strings.appealActorInCourt, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                  })
                : formatMessage(strings.appealActorAndDate, {
                    appealedByProsecutor:
                      workingCase.appealedByRole === UserRole.PROSECUTOR,
                    date: formatDate(workingCase.appealedDate, 'PPPp'),
                  })}
            </Text>
          )}
        </Box>
        <Box
          component="section"
          marginBottom={isProsecutionUser(user) ? 5 : 10}
        >
          <SectionHeading
            title={formatMessage(strings.appealCaseFilesTitle)}
            marginBottom={1}
          />
          <Text marginBottom={3} whiteSpace="pre">
            {formatMessage(strings.appealCaseFilesSubtitle)}
            {'\n'}
            {!isDefenceUser(user) &&
              `${formatMessage(strings.appealCaseFilesCOASubtitle)}`}
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
        {isProsecutionUser(user) && (
          <Box component="section" marginBottom={10}>
            <RequestAppealRulingNotToBePublishedCheckbox />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={handleNextButtonClick}
          nextButtonText={formatMessage(
            someFilesError
              ? strings.uploadFailedNextButtonText
              : strings.nextButtonText,
          )}
          nextIsLoading={!allFilesDoneOrError}
          nextIsDisabled={uploadFiles.length === 0 || !allFilesDoneOrError}
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === true && (
        <Modal
          title={formatMessage(strings.appealCaseFilesUpdatedModalTitle)}
          text={formatMessage(strings.appealCaseFilesUpdatedModalText, {
            isDefenceUser: isDefenceUser(user),
          })}
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
