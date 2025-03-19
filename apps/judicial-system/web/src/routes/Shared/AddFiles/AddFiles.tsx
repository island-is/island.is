import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import isEmpty from 'lodash/isEmpty'
import { useRouter } from 'next/router'

import * as constants from '@island.is/judicial-system/consts'
import {
  InstitutionUser,
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
import UploadFiles from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import {
  CaseFileCategory,
  CaseRepresentative,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ReactSelectOption,
  TempCase,
} from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import {
  RepresentativeSelectOption,
  SelectCaseFileRepresentative,
} from './SelectCaseFileRepresentative'
import { strings } from './AddFiles.strings'

const getUserProps = (user: InstitutionUser | undefined) => {
  const getCaseInfoNode = (workingCase: TempCase) => (
    <ProsecutorCaseInfo workingCase={workingCase} />
  )
  if (isDefenceUser(user)) {
    return {
      caseFileCategory: CaseFileCategory.DEFENDANT_CASE_FILE,
      previousRoute: constants.DEFENDER_INDICTMENT_ROUTE,
      getCaseInfoNode,
      hasFileRepresentativeSelection: false,
    }
  } else if (isDistrictCourtUser(user)) {
    return {
      previousRoute: constants.INDICTMENTS_COURT_OVERVIEW_ROUTE,
      getCaseInfoNode: (workingCase: TempCase) => (
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
  } = getUserProps(user)

  const previousRoute = `${previousRouteType}/${workingCase.id}`

  // states used when a user submits files on behalf of a case file representative
  const [fileRepresentative, setFileRepresentative] = useState(
    {} as RepresentativeSelectOption,
  )
  const [submittedDate, setSubmittedDate] = useState(new Date())

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

  const addFiles = (files: File[]) => {
    addUploadFiles(
      files,
      {
        status: 'done',
        fileRepresentative: fileRepresentative?.caseRepresentative?.name,
        // TODO
        category: fileRepresentative?.caseFileCategory || caseFileCategory,
        displayDate: submittedDate.toISOString(),
      },
      true,
    )
  }

  const handleCaseFileRepresentativeUpdate = (
    updatedFileRepresentative?: RepresentativeSelectOption,
    updatedSubmittedDate?: Date,
  ) => {
    const representative = updatedFileRepresentative || fileRepresentative
    const date = updatedSubmittedDate || submittedDate
    uploadFiles.forEach((file) => {
      updateUploadFile({
        ...file,
        fileRepresentative: representative?.caseRepresentative?.name,
        displayDate: date.toISOString(),
        // TODO
        category: !!representative?.caseFileCategory,
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
  }, [
    handleUpload,
    sendNotification,
    updateUploadFile,
    uploadFiles,
    workingCase.id,
  ])

  const CaseInfo = getCaseInfoNode(workingCase)
  const hasValidFileRepresentativeSelection = () => {
    if (!hasFileRepresentativeSelection) {
      return true
    }

    return !isEmpty(fileRepresentative) && !!submittedDate
  }
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
            fileRepresentative={fileRepresentative}
            setFileRepresentative={setFileRepresentative}
            submittedDate={submittedDate}
            setSubmittedDate={setSubmittedDate}
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
            !hasValidFileRepresentativeSelection()
          }
          onNextButtonClick={() => setVisibleModal('confirmation')}
        />
      </FormContentContainer>
      {visibleModal === 'confirmation' && (
        <Modal
          title={formatMessage(strings.filesSentModalTitle)}
          text={formatMessage(strings.filesSentModalText)}
          primaryButtonText={formatMessage(
            strings.filesConfirmedModalButtonText,
          )}
          secondaryButtonText={formatMessage(
            strings.filesDismissedModalButtonText,
          )}
          onClose={() => setVisibleModal(undefined)}
          onSecondaryButtonClick={() => setVisibleModal(undefined)}
          onPrimaryButtonClick={() => {
            handleNextButtonClick()
            router.push(previousRoute)
          }}
        />
      )}
    </PageLayout>
  )
}

export default AddFiles
