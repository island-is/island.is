import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams, useRouter } from 'next/navigation'

import {
  Box,
  FileUploadStatus,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE } from '@island.is/judicial-system/consts'
import { core, errors } from '@island.is/judicial-system-web/messages'
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
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useDefendants,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './SendToPrisonAdmin.strings'

enum AvailableModal {
  SUCCESS = 'SUCCESS',
}

const SendToPrisonAdmin: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const [modalVisible, setModalVisible] = useState<AvailableModal>()
  const [uploadFileError, setUploadFileError] = useState<string>()
  const router = useRouter()
  const { defendantId } = useParams<{ caseId: string; defendantId: string }>()
  const { handleUpload, handleRemove } = useS3Upload(
    workingCase.id,
    defendantId,
  )
  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })
  const { updateDefendant, isUpdatingDefendant } = useDefendants()
  const { uploadFiles, removeUploadFile, addUploadFiles, updateUploadFile } =
    useUploadFiles()

  const defendant = workingCase.defendants?.find(
    (defendant) => defendant.id === defendantId,
  )

  const handleNextButtonClick = useCallback(async () => {
    setModalVisible(AvailableModal.SUCCESS)
  }, [])

  const handleSecondaryButtonClick = () => {
    setModalVisible(undefined)
  }

  const handlePrimaryButtonClick = async () => {
    if (!defendant) {
      return
    }

    await updateDefendant({
      defendantId: defendant.id,
      caseId: workingCase.id,
      isSentToPrisonAdmin: true,
    })

    const uploadResult = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (uploadResult !== 'ALL_SUCCEEDED') {
      setUploadFileError(formatMessage(errors.uploadFailed))
      return
    }

    router.push(
      `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE}/${workingCase.id}`,
    )
  }

  const handleFileUpload = useCallback(
    (files: File[]) => {
      addUploadFiles(files, {
        category: CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
        status: FileUploadStatus.done,
      })
    },
    [addUploadFiles],
  )

  const handleRemoveFile = useCallback(
    (file: UploadFile) => {
      if (file.key) {
        handleRemove(file, removeUploadFile)
      } else {
        removeUploadFile(file)
      }
    },
    [handleRemove, removeUploadFile],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <SectionHeading
          heading="h2"
          title={formatMessage(strings.fileUploadTitle)}
          description={formatMessage(strings.fileUploadDescription)}
        />
        <Box marginBottom={10}>
          <InputFileUpload
            name="sentToPrisonAdminFileUpload"
            files={uploadFiles.filter(
              (file) =>
                file.category === CaseFileCategory.SENT_TO_PRISON_ADMIN_FILE,
            )}
            accept="application/pdf"
            title={formatMessage(core.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(core.uploadBoxButtonLabel)}
            onChange={handleFileUpload}
            onRemove={handleRemoveFile}
            onOpenFile={(file) => onOpenFile(file)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_OVERVIEW_ROUTE}/${workingCase.id}`}
          nextButtonText={formatMessage(strings.nextButtonText)}
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
      {modalVisible === AvailableModal.SUCCESS && defendant && (
        <Modal
          title={formatMessage(strings.modalTitle)}
          text={formatMessage(strings.modalText, {
            courtCaseNumber: workingCase.courtCaseNumber,
            defendant: defendant.name,
          })}
          primaryButton={{
            text: formatMessage(strings.modalNextButtonText),
            onClick: handlePrimaryButtonClick,
            isLoading: isUpdatingDefendant,
          }}
          secondaryButton={{
            text: formatMessage(core.back),
            onClick: handleSecondaryButtonClick,
          }}
          onClose={handleSecondaryButtonClick}
          loading={isUpdatingDefendant}
          errorMessage={uploadFileError}
        />
      )}
    </PageLayout>
  )
}

export default SendToPrisonAdmin
