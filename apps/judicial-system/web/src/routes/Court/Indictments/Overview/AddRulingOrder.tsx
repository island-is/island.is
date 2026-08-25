import type { FC } from 'react'
import { useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  Box,
  FileUploadStatus,
  Text,
} from '@island.is/island-ui/core'
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
import type { FileWithPreviewURL } from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import UploadFiles from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
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

  // Arriving from the "Hlaða upp úrskurði" action on a ruling order that was
  // pronounced orally: the document is written up for that ruling rather than
  // uploaded as a new one, so it fills in the file that already exists and
  // keeps the name the ruling was pronounced under.
  const rulingOrderId =
    typeof router.query.rulingFileId === 'string'
      ? router.query.rulingFileId
      : undefined
  const pronouncedRulingOrder = rulingOrderId
    ? workingCase.caseFiles?.find((file) => file.id === rulingOrderId)
    : undefined

  // Asked to write up a particular ruling that is not on the case. Uploading
  // anyway would create a new ruling and leave the court record and any appeal
  // pointing at the one that was asked for, so refuse instead.
  const pronouncedRulingOrderNotFound = Boolean(
    rulingOrderId && !isLoadingWorkingCase && !pronouncedRulingOrder,
  )

  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles()
  const { handleUpload, handleUploadRulingOrderDocument } = useS3Upload(
    workingCase.id,
  )

  const addFiles = (files: FileWithPreviewURL[]) => {
    // A ruling that was pronounced has exactly one document, so picking a file
    // replaces whatever was picked before rather than adding to it.
    if (pronouncedRulingOrder) {
      uploadFiles.forEach(removeUploadFile)
    }

    addUploadFiles(
      pronouncedRulingOrder ? files.slice(0, 1) : files,
      {
        status: FileUploadStatus.done,
        userGeneratedFilename:
          pronouncedRulingOrder?.userGeneratedFilename ??
          `${workingCase.courtCaseNumber} Úrskurður ${formatDate(new Date())}`,
        category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      },
      true,
    )
  }

  const handleRename = useCallback(
    async (fileId: string, newName: string) => {
      const fileToUpdate = uploadFiles.find((file) => file.id === fileId)

      if (!fileToUpdate) {
        return
      }

      updateUploadFile({
        ...fileToUpdate,
        userGeneratedFilename: newName,
      })
    },
    [updateUploadFile, uploadFiles],
  )

  const handleNextButtonClick = useCallback(async () => {
    const filesToUpload = uploadFiles.filter((file) => file.percent === 0)

    if (pronouncedRulingOrderNotFound) {
      return
    }

    const succeeded = pronouncedRulingOrder
      ? filesToUpload.length > 0 &&
        (await handleUploadRulingOrderDocument(
          filesToUpload[0],
          pronouncedRulingOrder.id,
          updateUploadFile,
        ))
      : (await handleUpload(filesToUpload, updateUploadFile)) ===
        'ALL_SUCCEEDED'

    setVisibleModal(undefined)

    if (succeeded) {
      router.push(previousRoute)
    }
  }, [
    handleUpload,
    handleUploadRulingOrderDocument,
    pronouncedRulingOrder,
    pronouncedRulingOrderNotFound,
    updateUploadFile,
    uploadFiles,
    router,
    previousRoute,
  ])

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
        {pronouncedRulingOrderNotFound && (
          <Box marginBottom={2}>
            <AlertMessage
              type="error"
              message="Úrskurðurinn sem á að hlaða upp fannst ekki í málinu. Farðu aftur á yfirlit málsins og reyndu aftur."
            />
          </Box>
        )}
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
          editableFileAttributes={['fileName']}
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousRoute}
          actions={[
            {
              text: 'Hlaða upp',
              colorScheme: someFilesError ? 'destructive' : 'default',
              onClick: () => setVisibleModal('confirmation'),
              disabled:
                uploadFiles.length === 0 ||
                !allFilesDoneOrError ||
                editCount > 0 ||
                pronouncedRulingOrderNotFound,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
      {visibleModal === 'confirmation' && (
        <Modal
          title="Viltu hlaða upp úrskurði?"
          text="Dómari þarf að staðfesta úrskurðinn eftir að honum hefur verið hlaðið upp."
          buttons={[
            {
              text: 'Hætta við',
              onClick: () => setVisibleModal(undefined),
              variant: 'ghost',
            },
            {
              text: 'Já, hlaða upp',
              onClick: async () => {
                await handleNextButtonClick()
              },
              isDisabled: !allFilesDoneOrError,
            },
          ]}
          onClose={() => setVisibleModal(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default AddRulingOrder
