import { FC, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { Box, FileUploadStatus, Text } from '@island.is/island-ui/core'
import { DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import UploadFiles, {
  FileWithPreviewURL,
} from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

const AddRulingOrder: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [editCount, setEditCount] = useState(0)
  const [visibleModal, setVisibleModal] = useState<'confirmation'>()
  const router = useRouter()

  const previousRoute = `${DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE}/${workingCase.id}`

  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles()
  const { handleUpload } = useS3Upload(workingCase.id)

  const addFiles = (files: FileWithPreviewURL[]) => {
    addUploadFiles(
      files,
      {
        status: FileUploadStatus.done,
        userGeneratedFilename: `${
          workingCase.courtCaseNumber
        } Úrskurður ${formatDate(new Date())}`,
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

    setVisibleModal(undefined)

    if (uploadResult === 'ALL_SUCCEEDED') {
      router.push(previousRoute)
    }
  }, [handleUpload, updateUploadFile, uploadFiles, router, previousRoute])

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
        <SectionHeading title="Hlaða upp úrskurði" required />
        <Box marginBottom={2}>
          <Text>
            Athugið að dómari þarf að staðfesta úrskurðinn á yfirliti máls eftir
            að honum hefur verið hlaðið upp.
          </Text>
        </Box>
        <UploadFiles
          files={uploadFiles}
          onChange={addFiles}
          onDelete={removeUploadFile}
          onRename={handleRename}
          setEditCount={setEditCount}
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousRoute}
          nextButtonText="Hlaða upp"
          nextButtonColorScheme={someFilesError ? 'destructive' : 'default'}
          nextIsDisabled={
            uploadFiles.length === 0 || !allFilesDoneOrError || editCount > 0
          }
          onNextButtonClick={() => setVisibleModal('confirmation')}
        />
      </FormContentContainer>
      {visibleModal === 'confirmation' && (
        <Modal
          title="Viltu hlaða upp úrskurði?"
          text="Dómari þarf að staðfesta úrskurðinn eftir að honum hefur verið hlaðið upp."
          primaryButton={{
            text: 'Já, hlaða upp',
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
