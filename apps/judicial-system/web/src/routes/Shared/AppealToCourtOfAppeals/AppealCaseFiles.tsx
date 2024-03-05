import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  InputFileUpload,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseFileCategory,
  isDefenceUser,
  isProsecutionUser,
  NotificationType,
  UserRole,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import RequestAppealRulingNotToBePublishedCheckbox from '@island.is/judicial-system-web/src/components/RequestAppealRulingNotToBePublishedCheckbox/RequestAppealRulingNotToBePublishedCheckbox'
import RulingDateLabel from '@island.is/judicial-system-web/src/components/RulingDateLabel/RulingDateLabel'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { UploadFileState } from '@island.is/judicial-system-web/src/utils/hooks/useS3Upload/useS3Upload'

import { strings } from './AppealCaseFiles.strings'

const AppealFiles = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<boolean>(false)
  const { uploadFiles, addUploadFiles, removeUploadFile, updateUploadFile } =
    useUploadFiles(workingCase.caseFiles)

  const { handleUpload, handleRemove } = useS3Upload(workingCase.id)
  const { sendNotification } = useCase()
  const [uploadState, setUploadState] = useState<UploadFileState>({
    isUploading: false,
    error: false,
  })

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

  const newUploadFiles = uploadFiles.filter((file) => {
    return (
      workingCase.caseFiles?.find((caseFile) => caseFile.id === file.id) ===
      undefined
    )
  })

  const handleNextButtonClick = useCallback(
    async (isRetry: boolean) => {
      setUploadState({ isUploading: true, error: false })

      const uploadSuccess = await handleUpload(
        newUploadFiles.filter((uf) =>
          isRetry ? uf.status === 'error' : !uf.key,
        ),
        updateUploadFile,
      )

      if (!uploadSuccess) {
        setUploadState({ isUploading: false, error: true })
        return
      }

      await sendNotification(
        workingCase.id,
        NotificationType.APPEAL_CASE_FILES_UPDATED,
      )

      setVisibleModal(true)
      setUploadState({ isUploading: false, error: false })
    },
    [
      handleUpload,
      newUploadFiles,
      sendNotification,
      updateUploadFile,
      workingCase.id,
    ],
  )

  const handleRemoveFile = (file: UploadFile) => {
    if (file.key) {
      handleRemove(file, removeUploadFile)
    } else {
      removeUploadFile(file)
    }

    setUploadState({ isUploading: false, error: false })
  }

  const handleChange = (files: File[], type: CaseFileCategory) => {
    setUploadState({ isUploading: false, error: false })
    addUploadFiles(files, type, undefined, {
      status: 'done',
      percent: 0,
    })
  }

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <Box marginBottom={2}>
          <Button
            variant="text"
            preTextIcon="arrowBack"
            onClick={() => router.push(previousUrl)}
          >
            {formatMessage(core.back)}
          </Button>
        </Box>
        <Box marginBottom={1}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
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
            fileList={newUploadFiles.filter(
              (file) =>
                file.category &&
                caseFilesTypesToDisplay.includes(file.category),
            )}
            accept={'application/pdf'}
            header={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => {
              handleChange(files, appealCaseFilesType)
            }}
            onRemove={(file) => handleRemoveFile(file)}
            hideIcons={newUploadFiles
              .filter((file) => file.category === appealCaseFilesType)
              .every((file) => file.status === 'uploading')}
            disabled={uploadState.isUploading}
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
          onNextButtonClick={() => handleNextButtonClick(uploadState.error)}
          nextButtonText={formatMessage(
            uploadState.error
              ? strings.uploadFailedNextButtonText
              : strings.nextButtonText,
          )}
          nextButtonIcon={undefined}
          nextIsLoading={uploadState.isUploading}
          nextIsDisabled={newUploadFiles.length === 0}
          nextButtonColorScheme={uploadState.error ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === true && (
        <Modal
          title={formatMessage(strings.appealCaseFilesUpdatedModalTitle)}
          text={formatMessage(strings.appealCaseFilesUpdatedModalText, {
            isDefenceUser: isDefenceUser(user),
          })}
          secondaryButtonText={formatMessage(core.closeModal)}
          onSecondaryButtonClick={() => {
            router.push(previousUrl)
          }}
        />
      )}
    </PageLayout>
  )
}

export default AppealFiles
