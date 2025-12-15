import { FC, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, FileUploadStatus } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { isDistrictCourtJudgeUser } from '@island.is/judicial-system/types'
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
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import UploadFiles, {
  FileWithPreviewURL,
} from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import {
  CaseFileCategory,
  NotificationType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  formatDateForServer,
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

const AddRulingOrder: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [editCount, setEditCount] = useState(0)
  const [visibleModal, setVisibleModal] = useState<'confirmation'>()
  const router = useRouter()
  const { user } = useContext(UserContext)

  const previousRoute = `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${workingCase.id}`

  const [confirmationDate, setConfirmationDate] = useState<Date>(new Date())

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
        submissionDate: formatDateForServer(confirmationDate),
        category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
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
      sendNotification(workingCase.id, NotificationType.RULING_ORDER_ADDED)
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

  if (!user || !isDistrictCourtJudgeUser(user)) {
    return null
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={'Úrskurðir - Réttarvörslugátt'} />
      <FormContentContainer>
        <PageTitle>Úrskurðir</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <SectionHeading title="Hlaða upp úrskurði" />
        <UploadFiles
          files={uploadFiles}
          onChange={addFiles}
          onDelete={removeUploadFile}
          onRename={handleRename}
          setEditCount={setEditCount}
        />
        <Box component="section" marginBottom={3}>
          <BlueBox>
            <Box>
              <DateTime
                name="rulingOrderDate"
                datepickerLabel="Dagsetning úrskurðar"
                maxDate={new Date()}
                selectedDate={confirmationDate}
                onChange={(date: Date | undefined, valid: boolean) => {
                  if (date && valid) {
                    setConfirmationDate(date)

                    uploadFiles.forEach((file) => {
                      updateUploadFile({
                        ...file,
                        submissionDate: formatDateForServer(date),
                      })
                    })
                  }
                }}
                blueBox={false}
                required
              />
            </Box>
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousRoute}
          nextButtonText="Staðfesta úrskurð"
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
          nextIsDisabled={
            uploadFiles.length === 0 || !allFilesDoneOrError || editCount > 0
          }
          onNextButtonClick={() => setVisibleModal('confirmation')}
        />
      </FormContentContainer>
      {visibleModal === 'confirmation' && (
        <Modal
          title="Viltu staðfesta úrskurð"
          text="Tilkynning verður send ákæranda og verjanda"
          primaryButton={{
            text: 'Staðfesta úrskurð',
            onClick: async () => {
              await handleNextButtonClick()
            },
            isDisabled: !allFilesDoneOrError,
          }}
          secondaryButton={{
            text: 'Hætta við',
            onClick: () => setVisibleModal(undefined),
          }}
          onClose={() => setVisibleModal(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default AddRulingOrder
