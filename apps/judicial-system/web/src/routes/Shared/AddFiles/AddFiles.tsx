import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import { useRouter } from 'next/router'

import { Box, Text, toast } from '@island.is/island-ui/core'
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
  const [visibleModal, setVisibleModal] = useState<'filesSent'>()
  const router = useRouter()
  const { user } = useContext(UserContext)
  const previousRoute = isDefenceUser(user)
    ? `${constants.DEFENDER_INDICTMENT_ROUTE}/${workingCase.id}`
    : `${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`

  const { uploadFiles, addUploadFiles, updateUploadFile, removeUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )
  const [updateFilesMutation] = useUpdateFilesMutation()

  const handleFileUpload = useCallback(
    (files: File[]) => {
      handleUpload(
        addUploadFiles(files, CaseFileCategory.PROSECUTOR_CASE_FILE),
        updateUploadFile,
      )
    },
    [addUploadFiles, handleUpload, updateUploadFile],
  )

  const handleRetryUpload = useCallback(
    (file: TUploadFile) => {
      handleRetry(file, updateUploadFile)
    },
    [handleRetry, updateUploadFile],
  )

  const handleRemoveFile = useCallback(
    (file: TUploadFile) => {
      handleRemove(file, removeUploadFile)
    },
    [handleRemove, removeUploadFile],
  )

  const handleRename = useCallback(
    async (fileId: string, newName?: string, newDisplayDate?: string) => {
      let newDate: Date | null = null
      const fileToUpdate = uploadFiles.findIndex((item) => item.id === fileId)

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
        uploadFiles[fileToUpdate].userGeneratedFilename = newName
      }

      if (newDate) {
        uploadFiles[fileToUpdate].displayDate = newDate.toISOString()
      }

      updateUploadFile(uploadFiles[fileToUpdate])

      const { errors } = await updateFilesMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            files: [
              {
                id: fileId,
                userGeneratedFilename: newName,
                ...(newDate && { displayDate: newDate.toISOString() }),
              },
            ],
          },
        },
      })

      if (errors) {
        toast.error(formatMessage(errorMessages.renameFailedErrorMessage))
      }
    },
    [
      formatMessage,
      updateFilesMutation,
      updateUploadFile,
      uploadFiles,
      workingCase.id,
    ],
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
          files={uploadFiles.filter(
            (file) => file.category === CaseFileCategory.PROSECUTOR_CASE_FILE,
          )}
          onChange={handleFileUpload}
          onRetry={handleRetryUpload}
          onDelete={handleRemoveFile}
          onRename={handleRename}
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousRoute}
          nextButtonText={formatMessage(strings.nextButtonText)}
          onNextButtonClick={() => setVisibleModal('filesSent')}
        />
      </FormContentContainer>
      {visibleModal === 'filesSent' && (
        <Modal
          title={formatMessage(strings.filesSentModalTitle)}
          text={formatMessage(strings.filesSentModalText)}
          primaryButtonText={formatMessage(
            strings.filesSentModalPrimaryButtonText,
          )}
          onPrimaryButtonClick={() => router.push(previousRoute)}
          secondaryButtonText={formatMessage(
            strings.filesSentModalSecondaryButtonText,
          )}
          onSecondaryButtonClick={() => setVisibleModal(undefined)}
        />
      )}
    </PageLayout>
  )
}

export default AddFiles
