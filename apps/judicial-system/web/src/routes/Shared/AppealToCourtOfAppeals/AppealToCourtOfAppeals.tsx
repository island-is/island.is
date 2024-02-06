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
  RulingDateLabel,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import RequestAppealRulingNotToBePublishedCheckbox from '@island.is/judicial-system-web/src/components/RequestAppealRulingNotToBePublishedCheckbox/RequestAppealRulingNotToBePublishedCheckbox'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { UploadFileState } from '@island.is/judicial-system-web/src/utils/hooks/useS3Upload/useS3Upload'

import { appealToCourtOfAppeals as strings } from './AppealToCourtOfAppeals.strings'

const AppealToCourtOfAppeals = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<'APPEAL_SENT'>()
  const [uploadState, setUploadState] = useState<UploadFileState>({
    isUploading: false,
    error: false,
  })

  const { uploadFiles, addUploadFiles, removeUploadFile, updateUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload } = useS3Upload(workingCase.id)
  const { transitionCase } = useCase()

  const appealBriefType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF
  const appealCaseFilesType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE
  const previousUrl = `${
    isDefenceUser(user)
      ? constants.DEFENDER_ROUTE
      : constants.SIGNED_VERDICT_OVERVIEW_ROUTE
  }/${id}`

  const newUploadFiles = uploadFiles.filter((file) => !file.key)
  const isStepValid = newUploadFiles.length > 0 || uploadState.error

  const handleNextButtonClick = useCallback(
    async (isRetry: boolean) => {
      setUploadState({ isUploading: true, error: false })

      const uploadSuccess = await handleUpload(
        newUploadFiles.filter(
          (uf) => uf.status === (isRetry ? 'error' : 'uploading'),
        ),
        updateUploadFile,
      )

      if (!uploadSuccess) {
        setUploadState({ isUploading: false, error: true })
        return
      }

      const caseTransitioned = await transitionCase(
        workingCase.id,
        CaseTransition.APPEAL,
      )

      if (caseTransitioned) {
        setVisibleModal('APPEAL_SENT')
      }

      setUploadState({ isUploading: false, error: false })
    },
    [
      handleUpload,
      newUploadFiles,
      transitionCase,
      updateUploadFile,
      workingCase.id,
    ],
  )

  const handleRemoveFile = (file: UploadFile) => {
    removeUploadFile(file)
    setUploadState({ isUploading: false, error: false })
  }

  const handleChange = (files: File[], type: CaseFileCategory) => {
    setUploadState({ isUploading: false, error: false })
    addUploadFiles(files, type, undefined, {
      percent: 100,
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
        {workingCase.rulingDate && (
          <Box marginBottom={7}>
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.appealBriefTitle)}
            required
          />
          <InputFileUpload
            fileList={newUploadFiles.filter(
              (file) => file.category === appealBriefType,
            )}
            accept={'application/pdf'}
            header={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => handleChange(files, appealBriefType)}
            onRemove={(file) => {
              handleRemoveFile(file)
            }}
            hideIcons={newUploadFiles
              .filter((file) => file.category === appealBriefType)
              .every((file) => file.status === 'uploading')}
            disabled={uploadState.isUploading}
          />
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
              (file) => file.category === appealCaseFilesType,
            )}
            accept={'application/pdf'}
            header={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={(files) => handleChange(files, appealCaseFilesType)}
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
          nextIsDisabled={!isStepValid}
          nextIsLoading={uploadState.isUploading}
          nextButtonIcon={undefined}
          nextButtonColorScheme={uploadState.error ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === 'APPEAL_SENT' && (
        <Modal
          title={formatMessage(strings.appealSentModalTitle)}
          text={formatMessage(strings.appealSentModalText)}
          secondaryButtonText={formatMessage(core.closeModal)}
          onSecondaryButtonClick={() => {
            router.push(previousUrl)
          }}
        />
      )}
    </PageLayout>
  )
}

export default AppealToCourtOfAppeals
