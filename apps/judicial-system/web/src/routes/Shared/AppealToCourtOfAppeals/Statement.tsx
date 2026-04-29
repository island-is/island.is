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
import {
  AppealEventType,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useAppealCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  getAppealActorText,
  getDefenceUserPartyIds,
  isMatchingAppealCaseFile,
} from '@island.is/judicial-system-web/src/utils/utils'

const Statement = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { createAppealEventLog, isCreatingAppealEventLog } = useAppealCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id, rulingFileId: rulingFileIdQuery } = router.query
  const rulingFileId =
    typeof rulingFileIdQuery === 'string' ? rulingFileIdQuery : undefined
  const [visibleModal, setVisibleModal] = useState<'STATEMENT_SENT'>()
  const { defendantId, civilClaimantId } = getDefenceUserPartyIds(
    workingCase,
    user,
  )
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

  const { handleUpload, handleRemove } = useS3Upload(
    workingCase.id,
    defendantId,
    civilClaimantId,
    rulingFileId,
  )

  // Statement events target the specific appeal-case row. For ruling-order
  // appeals, look up the matching row by rulingFileId; otherwise use the
  // case-level appeal.
  const targetAppealCase = rulingFileId
    ? workingCase.rulingOrderAppealCases?.find(
        (a) => a.rulingFileId === rulingFileId,
      )
    : workingCase.appealCase
  const targetAppealCaseId = targetAppealCase?.id

  const appealStatementType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT

  const appealCaseFilesType = !isDefenceUser(user)
    ? CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE
    : CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE

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
  }/${id}`

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      return
    }

    if (!targetAppealCaseId) {
      return
    }

    const sent = await createAppealEventLog(
      workingCase.id,
      targetAppealCaseId,
      AppealEventType.APPEAL_STATEMENT_SENT,
    )

    if (sent) {
      setVisibleModal('STATEMENT_SENT')
    }
  }, [
    handleUpload,
    createAppealEventLog,
    updateUploadFile,
    uploadFiles,
    targetAppealCaseId,
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
  const appealStatementFiles = uploadFiles.filter((file) =>
    filter(file, appealStatementType),
  )

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <PageTitle>Greinargerð</PageTitle>
        <Box marginBottom={7}>
          {workingCase.courtCaseNumber && (
            <Text as="h2" variant="h2" fontWeight="semiBold" marginBottom={1}>
              Mál nr. {workingCase.courtCaseNumber}
            </Text>
          )}
          {workingCase.rulingDate && (
            <RulingDateLabel rulingDate={workingCase.rulingDate} />
          )}
          <RulingFileLabel
            caseFiles={workingCase.caseFiles}
            rulingFileId={rulingFileId}
          />
          <Text variant="h5" as="h5">
            {getAppealActorText(workingCase, targetAppealCase)}
          </Text>
        </Box>
        {user && (
          <>
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Greinargerð" required />

              <InputFileUpload
                name="appealStatement"
                files={appealStatementFiles}
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
              <SectionHeading title="Gögn" marginBottom={1} />
              <Text marginBottom={3} whiteSpace="pre">
                Ef ný gögn eiga að fylgja greinargerðinni er hægt að hlaða þeim
                upp hér að neðan.
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
          </>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={handleNextButtonClick}
          nextButtonText={someFilesError ? 'Reyna aftur' : 'Senda greinargerð'}
          nextIsDisabled={
            appealStatementFiles.length === 0 || isCreatingAppealEventLog
          }
          nextIsLoading={!allFilesDoneOrError || isCreatingAppealEventLog}
          nextButtonIcon={undefined}
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
        />
      </FormContentContainer>
      {visibleModal === 'STATEMENT_SENT' && (
        <Modal
          title="Greinargerð hefur verið send Landsrétti"
          text="Tilkynning um greinargerð hefur verið send Landsrétti og aðilum máls."
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
