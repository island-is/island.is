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
  CaseAppealDecision,
  CaseFileCategory,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { UploadFileState } from '@island.is/judicial-system-web/src/utils/hooks/useS3Upload/useS3Upload'

import { statement as strings } from './Statement.strings'

const Statement = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { isUpdatingCase, updateCase } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<'STATEMENT_SENT'>()
  const [uploadState, setUploadState] = useState<UploadFileState>({
    isUploading: false,
    error: false,
  })
  const { uploadFiles, addUploadFiles, updateUploadFile, removeUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRemove } = useS3Upload(workingCase.id)

  const appealStatementType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT

  const appealCaseFilesType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE

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
  const isStepValid = newUploadFiles.length > 0 || uploadState.error

  const handleNextButtonClick = useCallback(
    async (isRetry: boolean) => {
      const update = isDefenceUser(user)
        ? { defendantStatementDate: new Date().toISOString() }
        : { prosecutorStatementDate: new Date().toISOString() }

      setUploadState({ isUploading: true, error: false })

      const uploadSuccess = await handleUpload(
        newUploadFiles.filter(
          (uf) => uf.status === (isRetry ? 'error' : 'uploading'),
        ),
        updateUploadFile,
      )

      if (uploadSuccess) {
        await updateCase(workingCase.id, update)
        setUploadState({ isUploading: false, error: false })
        setVisibleModal('STATEMENT_SENT')
      } else {
        setUploadState({ isUploading: false, error: true })
        return
      }
    },
    [
      handleUpload,
      newUploadFiles,
      updateCase,
      updateUploadFile,
      user,
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
        {user && (
          <>
            <Box component="section" marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.uploadStatementTitle)}
                required
              />
              <InputFileUpload
                fileList={newUploadFiles.filter(
                  (file) => file.category === appealStatementType,
                )}
                accept={'application/pdf'}
                header={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                onChange={(files) => handleChange(files, appealStatementType)}
                onRemove={(file) => handleRemoveFile(file)}
                hideIcons={newUploadFiles
                  .filter((file) => file.category === appealStatementType)
                  .every((file) => file.status === 'uploading')}
                disabled={uploadState.isUploading}
              />
            </Box>
            <Box
              component="section"
              marginBottom={isProsecutionUser(user) ? 5 : 10}
            >
              <SectionHeading
                title={formatMessage(strings.uploadStatementCaseFilesTitle)}
                marginBottom={1}
              />
              <Text marginBottom={3} whiteSpace="pre">
                {formatMessage(strings.uploadStatementCaseFilesSubtitle)}
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
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={() => {
            handleNextButtonClick(uploadState.error)
          }}
          nextButtonText={formatMessage(
            uploadState.error
              ? strings.uploadFailedNextButtonText
              : strings.nextButtonText,
          )}
          nextIsDisabled={!isStepValid || isUpdatingCase}
          nextIsLoading={uploadState.isUploading}
          nextButtonIcon={undefined}
          nextButtonColorScheme={uploadState.error ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === 'STATEMENT_SENT' && (
        <Modal
          title={formatMessage(strings.statementSentModalTitle)}
          text={formatMessage(strings.statementSentModalText, {
            isDefender: isDefenceUser(user),
          })}
          secondaryButtonText={formatMessage(core.closeModal)}
          onSecondaryButtonClick={() => router.push(previousUrl)}
        />
      )}
    </PageLayout>
  )
}

export default Statement
