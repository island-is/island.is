import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Select } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  InstitutionUser,
  isDefenceUser,
  isDistrictCourtUser,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtCaseInfo,
  DateTime,
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
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase } from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AddFiles.strings'

const SelectCaseFileRepresentative = () => {
  const { formatMessage } = useIntl()

  // TODO: defender(s), prosectuor, defendant, civilrights
  const caseRepresentatives = []
  const defaultCaseRepresentative = null
  return (
    <>
      <SectionHeading
        title={formatMessage(strings.uploadFilesRepresentativeSelectionTitle)}
      />
      <BlueBox>
        <Box>
          <Select
            name="caseRepresentative"
            label={formatMessage(strings.caseRepresentativeLabel)}
            placeholder={formatMessage(strings.caseRepresentativePlaceholder)}
            value={defaultCaseRepresentative}
            options={caseRepresentatives}
            // onChange={(selectedOption) =>
            //   setJudge((selectedOption as JudgeSelectOption).judge.id)
            // }
            required
            // isDisabled={usersLoading}
          />
          <DateTime
            name="fileSubmittedDate"
            selectedDate={new Date()}
            onChange={() => {
              return new Date()
            }}
            blueBox={true}
            datepickerLabel="Dagsetning móttöku"
            dateOnly
            required
          />
        </Box>
      </BlueBox>
    </>
  )
}

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
      caseFileCategory: CaseFileCategory.COURT_RECORD,
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
  const [visibleModal, setVisibleModal] = useState<'sendFiles'>()
  const router = useRouter()
  const { user } = useContext(UserContext)
  const {
    previousRoute: previousRouteType,
    caseFileCategory,
    getCaseInfoNode,
    hasFileRepresentativeSelection,
  } = getUserProps(user)

  const previousRoute = `${previousRouteType}/${workingCase.id}`

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

  const handleChange = (files: File[]) => {
    addUploadFiles(
      files,
      {
        category: caseFileCategory,
        status: 'done',
        displayDate: new Date().toISOString(),
      },
      true,
    )
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

    if (uploadResult === 'ALL_SUCCEEDED') {
      setVisibleModal('sendFiles')
    }
  }, [
    handleUpload,
    sendNotification,
    updateUploadFile,
    uploadFiles,
    workingCase.id,
  ])

  const CaseInfo = getCaseInfoNode(workingCase)
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
          onChange={handleChange}
          onDelete={removeUploadFile}
          onRename={handleRename}
          setEditCount={setEditCount}
        />
        {hasFileRepresentativeSelection && <SelectCaseFileRepresentative />}
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
            uploadFiles.length === 0 || !allFilesDoneOrError || editCount > 0
          }
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
      {visibleModal === 'sendFiles' && (
        <Modal
          title={formatMessage(strings.filesSentModalTitle)}
          text={formatMessage(strings.filesSentModalText)}
          primaryButtonText={formatMessage(
            strings.filesSentModalPrimaryButtonText,
          )}
          onPrimaryButtonClick={() => router.push(previousRoute)}
        />
      )}
    </PageLayout>
  )
}

export default AddFiles
