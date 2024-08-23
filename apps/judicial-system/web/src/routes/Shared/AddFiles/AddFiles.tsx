import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

import { Box, Text, toast, UploadFile } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { isDefenceUser } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import { errors as errorMessages } from '@island.is/judicial-system-web/messages/Core/errors'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useUpdateFilesMutation } from '@island.is/judicial-system-web/src/components/AccordionItems/IndictmentsCaseFilesAccordionItem/updateFiles.generated'
import { TEditableCaseFile } from '@island.is/judicial-system-web/src/components/EditableCaseFile/EditableCaseFile'
import UploadFiles from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AddFiles.strings'

const AddFiles: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const [visibleModal, setVisibleModal] = useState<'sendFiles'>()
  const [filesToUpload, setFilesToUpload] = useState<TEditableCaseFile[]>([])
  const router = useRouter()
  const { user } = useContext(UserContext)
  const previousRoute = isDefenceUser(user)
    ? `${constants.DEFENDER_INDICTMENT_ROUTE}/${workingCase.id}`
    : `${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`

  const { uploadFiles } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry } = useS3Upload(workingCase.id)

  const updateFileToUpload = useCallback((file: UploadFile, newId?: string) => {
    setFilesToUpload((previous) =>
      previous.map((f) => {
        return f.id === file.id ? { ...f, ...file, id: newId ?? file.id } : f
      }),
    )
  }, [])

  const handleFileUpload = useCallback(
    async (files: UploadFile[]) => {
      const filesUploaded = await handleUpload(files, updateFileToUpload)

      if (filesUploaded) {
        setVisibleModal('sendFiles')
      }
    },
    [handleUpload, updateFileToUpload],
  )

  const handleRetryUpload = useCallback(
    (file: TUploadFile) => {
      handleRetry(file, updateFileToUpload)
    },
    [handleRetry, updateFileToUpload],
  )

  const handleRemoveFile = useCallback((file: TUploadFile) => {
    setFilesToUpload((prev) => prev.filter((p) => p.id !== file.id))
  }, [])

  const handleRename = useCallback(
    async (fileId: string, newName?: string, newDisplayDate?: string) => {
      let newDate: Date | null = null
      const fileToUpdate = filesToUpload.findIndex((item) => item.id === fileId)

      if (fileToUpdate === -1) {
        return
      }

      if (newDisplayDate) {
        const [day, month, year] = newDisplayDate.split('.')
        newDate = parseISO(`${year}-${month}-${day}`)

        if (!isValid(newDate)) {
          toast.error(formatMessage(errorMessages.invalidDateErrorMessage))
          return
        }
      }

      if (newName) {
        filesToUpload[fileToUpdate].userGeneratedFilename = newName
      }

      if (newDate) {
        filesToUpload[fileToUpdate].displayDate = newDate.toISOString()
      }

      updateFileToUpload(uploadFiles[fileToUpdate])
    },
    [filesToUpload, formatMessage, updateFileToUpload, uploadFiles],
  )

  const mp = (files: UploadFile[]): TEditableCaseFile[] => {
    return files.map((file) => ({
      name: file.name,
      userGeneratedFilename: file.name,
      originalFileObj: file as File,
      displayDate: new Date().toISOString(),
      type: CaseFileCategory.PROSECUTOR_CASE_FILE,
      id: uuid(),
    }))
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
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <SectionHeading
          title={formatMessage(strings.uploadFilesHeading)}
          description={formatMessage(strings.uploadFilesDescription)}
        />
        <UploadFiles
          files={filesToUpload}
          onChange={(files) =>
            setFilesToUpload((prev) => [...mp(files), ...mp(prev)])
          }
          onRetry={handleRetryUpload}
          onDelete={handleRemoveFile}
          onRename={handleRename}
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousRoute}
          nextButtonText={formatMessage(strings.nextButtonText)}
          onNextButtonClick={() =>
            handleFileUpload(filesToUpload as UploadFile[])
          }
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
