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
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { statement as strings } from './Statement.strings'

const Statement = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { isUpdatingCase, updateCase } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
  const [visibleModal, setVisibleModal] = useState<'STATEMENT_SENT'>()
  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)

  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

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

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    const updated = await updateCase(
      workingCase.id,
      isDefenceUser(user)
        ? { defendantStatementDate: new Date().toISOString() } // TODO: Let the server override this date. It is already overriding prosecutorStatementDate.
        : { prosecutorStatementDate: new Date().toISOString() },
    )

    if (updated) {
      setVisibleModal('STATEMENT_SENT')
    }
  }, [
    handleUpload,
    updateCase,
    updateUploadFile,
    uploadFiles,
    user,
    workingCase.id,
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
          {workingCase.courtCaseNumber && (
            <Text as="h2" variant="h2" fontWeight="semiBold" marginBottom={1}>
              Mál nr. {workingCase.courtCaseNumber}
            </Text>
          )}
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
                name="appealStatement"
                files={uploadFiles.filter(
                  (file) => file.category === appealStatementType,
                )}
                accept={'application/pdf'}
                title={formatMessage(core.uploadBoxTitle)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
                onChange={(files) => handleChange(files, appealStatementType)}
                onRemove={(file) => handleRemoveFile(file)}
                onOpenFile={(file) => onOpenFile(file)}
                hideIcons={!allFilesDoneOrError}
                disabled={!allFilesDoneOrError}
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
                name="appealCaseFiles"
                files={uploadFiles.filter(
                  (file) => file.category === appealCaseFilesType,
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
          onNextButtonClick={handleNextButtonClick}
          nextButtonText={formatMessage(
            someFilesError
              ? strings.uploadFailedNextButtonText
              : strings.nextButtonText,
          )}
          nextIsDisabled={uploadFiles.length === 0 || isUpdatingCase}
          nextIsLoading={!allFilesDoneOrError || isUpdatingCase}
          nextButtonIcon={undefined}
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === 'STATEMENT_SENT' && (
        <Modal
          title={formatMessage(strings.statementSentModalTitle)}
          text={formatMessage(strings.statementSentModalText, {
            isDefender: isDefenceUser(user),
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

export default Statement
