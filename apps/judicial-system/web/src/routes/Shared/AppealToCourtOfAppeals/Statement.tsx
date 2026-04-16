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
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  getAppealActorText,
  getDefenceUserPartyIds,
  isUserCaseFile,
} from '@island.is/judicial-system-web/src/utils/utils'

const Statement = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { isUpdatingCase, updateCase } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { id } = router.query
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
  )

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
      defendantId,
      civilClaimantId,
    })
  }

  const appealStatementFiles = uploadFiles.filter(
    (file) =>
      file.category === appealStatementType &&
      (isProsecutionUser(user) || isUserCaseFile(workingCase, file, user)),
  )
  console.log(workingCase.defendants, appealStatementFiles, user)
  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.appealToCourtOfAppeals)} />
      <FormContentContainer>
        <PageTitle previousUrl={previousUrl}>Greinargerð</PageTitle>
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
              {getAppealActorText(workingCase)}
            </Text>
          )}
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
                files={uploadFiles.filter(
                  (file) =>
                    file.category === appealCaseFilesType &&
                    (isProsecutionUser(user) ||
                      isUserCaseFile(workingCase, file, user)),
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
          nextIsDisabled={appealStatementFiles.length === 0 || isUpdatingCase}
          nextIsLoading={!allFilesDoneOrError || isUpdatingCase}
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
