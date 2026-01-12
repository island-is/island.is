import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, FileUploadStatus } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isDefenceUser,
  isDistrictCourtUser,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import UploadFiles, {
  FileWithPreviewURL,
} from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import {
  Case,
  CaseFileCategory,
  NotificationType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  isCaseCivilClaimantLegalSpokesperson,
  isCaseCivilClaimantSpokesperson,
  isCaseDefendantDefender,
} from '@island.is/judicial-system-web/src/utils/utils'

import { SelectCaseFileRepresentative } from './SelectCaseFileRepresentative'
import { strings } from './AddFiles.strings'

const getUserProps = (user: User | undefined, workingCase: Case) => {
  const getCaseInfoNode = (workingCase: Case) => (
    <Box marginBottom={5}>
      <ProsecutorCaseInfo workingCase={workingCase} />
    </Box>
  )
  if (isDefenceUser(user)) {
    const caseFileCategory = isCaseDefendantDefender(user, workingCase)
      ? CaseFileCategory.DEFENDANT_CASE_FILE
      : isCaseCivilClaimantLegalSpokesperson(user, workingCase)
      ? CaseFileCategory.CIVIL_CLAIMANT_LEGAL_SPOKESPERSON_CASE_FILE
      : isCaseCivilClaimantSpokesperson(user, workingCase)
      ? CaseFileCategory.CIVIL_CLAIMANT_SPOKESPERSON_CASE_FILE
      : CaseFileCategory.CASE_FILE // should never happen
    return {
      caseFileCategory: caseFileCategory,
      previousRoute: constants.DEFENDER_INDICTMENT_ROUTE,
      getCaseInfoNode,
      hasFileRepresentativeSelection: false,
    }
  } else if (isDistrictCourtUser(user)) {
    return {
      previousRoute: constants.INDICTMENTS_COURT_OVERVIEW_ROUTE,
      getCaseInfoNode: (workingCase: Case) => (
        <CourtCaseInfo workingCase={workingCase} />
      ),
      hasFileRepresentativeSelection: true,
    }
  }
  return {
    caseFileCategory: CaseFileCategory.PROSECUTOR_CASE_FILE,
    previousRoute: constants.INDICTMENTS_OVERVIEW_ROUTE,
    getCaseInfoNode,
    hasFileRepresentativeSelection: false,
  }
}

const AddFiles: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const [editCount, setEditCount] = useState(0)
  const [visibleModal, setVisibleModal] = useState<'confirmation'>()
  const router = useRouter()
  const { user } = useContext(UserContext)
  const {
    previousRoute: previousRouteType,
    caseFileCategory,
    getCaseInfoNode,
    hasFileRepresentativeSelection,
  } = getUserProps(user, workingCase)

  const previousRoute = `${previousRouteType}/${workingCase.id}`

  // states used when a user submits files on behalf of a case file representative
  const [submissionInfo, setSubmissionInfo] = useState<{
    submitterName?: string
    caseFileCategory?: CaseFileCategory
    submissionDate: Date
  }>({ submissionDate: new Date() })

  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles()
  const { handleUpload } = useS3Upload(workingCase.id)
  const { sendNotification } = useCase()

  const addFiles = (files: FileWithPreviewURL[]) => {
    addUploadFiles(
      files,
      {
        status: FileUploadStatus.done,
        submissionDate: formatDateForServer(submissionInfo.submissionDate),
        fileRepresentative: submissionInfo.submitterName,
        category: submissionInfo.caseFileCategory ?? caseFileCategory,
      },
      true,
    )
  }

  const handleCaseFileRepresentativeUpdate = (update: {
    submitterName?: string | null
    caseFileCategory?: CaseFileCategory | null
    submissionDate?: Date
  }) => {
    const currentSubmitterName =
      update.submitterName ?? submissionInfo.submitterName
    const currentSubmissionDate =
      update.submissionDate ?? submissionInfo.submissionDate
    const currentCaseFileCategory =
      update.caseFileCategory ?? submissionInfo.caseFileCategory

    setSubmissionInfo({
      submitterName: currentSubmitterName,
      caseFileCategory: currentCaseFileCategory,
      submissionDate: currentSubmissionDate,
    })

    uploadFiles.forEach((file) => {
      updateUploadFile({
        ...file,
        fileRepresentative: currentSubmitterName,
        submissionDate: formatDateForServer(currentSubmissionDate),
        category: currentCaseFileCategory ?? caseFileCategory,
      })
    })
  }

  const handleRename = useCallback(
    async (fileId: string, newName: string, newDisplayDate: string) => {
      const fileToUpdate = uploadFiles.find((file) => file.id === fileId)

      if (!fileToUpdate) {
        return
      }

      updateUploadFile({
        ...fileToUpdate,
        userGeneratedFilename: newName,
        displayDate: newDisplayDate,
      })
    },
    [updateUploadFile, uploadFiles],
  )

  const handleNextButtonClick = useCallback(async () => {
    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'NONE_SUCCEEDED') {
      // Some files were added successfully so we send a notification
      sendNotification(workingCase.id, NotificationType.CASE_FILES_UPDATED)
    }

    setVisibleModal(undefined)

    if (uploadResult === 'ALL_SUCCEEDED') {
      router.push(previousRoute)
    }
  }, [
    handleUpload,
    sendNotification,
    updateUploadFile,
    uploadFiles,
    workingCase.id,
    router,
    previousRoute,
  ])

  const CaseInfo = getCaseInfoNode(workingCase)
  const hasValidFileRepresentativeSelection =
    !hasFileRepresentativeSelection ||
    Boolean(
      submissionInfo.submitterName &&
        submissionInfo.caseFileCategory &&
        submissionInfo.submissionDate,
    )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.overview)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        {CaseInfo}
        <SectionHeading
          title={formatMessage(strings.uploadFilesHeading)}
          description={formatMessage(strings.uploadFilesDescription)}
        />
        <UploadFiles
          files={uploadFiles}
          onChange={addFiles}
          onDelete={removeUploadFile}
          onRename={handleRename}
          setEditCount={setEditCount}
          isBottomComponent={!hasFileRepresentativeSelection}
        />
        {hasFileRepresentativeSelection && (
          <SelectCaseFileRepresentative
            submitterName={submissionInfo.submitterName}
            caseFileCategory={submissionInfo.caseFileCategory}
            submissionDate={submissionInfo.submissionDate}
            handleCaseFileRepresentativeUpdate={
              handleCaseFileRepresentativeUpdate
            }
          />
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousRoute}
          nextButtonText={
            someFilesError
              ? formatMessage(strings.tryUploadAgain)
              : formatMessage(strings.nextButtonText)
          }
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
          nextIsDisabled={
            uploadFiles.length === 0 ||
            !allFilesDoneOrError ||
            editCount > 0 ||
            !hasValidFileRepresentativeSelection
          }
          onNextButtonClick={() => setVisibleModal('confirmation')}
        />
      </FormContentContainer>
      {visibleModal === 'confirmation' && (
        <Modal
          title={formatMessage(strings.filesSentModalTitle)}
          text={formatMessage(strings.filesSentModalText)}
          primaryButton={{
            text: formatMessage(strings.filesConfirmedModalButtonText),
            onClick: async () => {
              await handleNextButtonClick()
            },
            isDisabled: !allFilesDoneOrError,
          }}
          secondaryButton={{
            text: formatMessage(strings.filesDismissedModalButtonText),
            onClick: () => setVisibleModal(undefined),
          }}
          onClose={() => setVisibleModal(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default AddFiles
