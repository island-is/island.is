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
import UploadFiles from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AddFiles.strings'

const AddFiles: FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const [visibleModal, setVisibleModal] = useState<'sendFiles'>()
  const router = useRouter()
  const { user } = useContext(UserContext)
  const previousRoute = isDefenceUser(user)
    ? `${constants.DEFENDER_INDICTMENT_ROUTE}/${workingCase.id}`
    : `${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`

  const {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
    addUploadFiles,
    removeUploadFile,
    updateUploadFile,
  } = useUploadFiles()
  const { handleUpload } = useS3Upload(workingCase.id)

  const caseFileCategory = isDefenceUser(user)
    ? CaseFileCategory.DEFENDANT_CASE_FILE
    : CaseFileCategory.PROSECUTOR_CASE_FILE

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
    async (fileId: string, newName?: string, newDisplayDate?: string) => {
      const fileToUpdate = uploadFiles.find((file) => file.id === fileId)

      if (!fileToUpdate) {
        return
      }

      let newDate: Date | undefined

      if (newDisplayDate) {
        const [day, month, year] = newDisplayDate.split('.')
        newDate = parseISO(`${year}-${month}-${day}`)

        if (!isValid(newDate)) {
          toast.error(formatMessage(errorMessages.invalidDateErrorMessage))
          return
        }
      }

      updateUploadFile({
        ...fileToUpdate,
        userGeneratedFilename: newName || fileToUpdate.userGeneratedFilename, // Do not allow the empty string
        displayDate: newDate?.toISOString() ?? fileToUpdate.displayDate,
      })
    },
    [formatMessage, updateUploadFile, uploadFiles],
  )

  const handleNextButtonClick = useCallback(async () => {
    const allSucceeded = await handleUpload(
      uploadFiles.filter((file) => file.percent === 0),
      updateUploadFile,
    )

    if (allSucceeded) {
      setVisibleModal('sendFiles')
    }
  }, [handleUpload, updateUploadFile, uploadFiles])

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
          files={uploadFiles}
          onChange={handleChange}
          onDelete={removeUploadFile}
          onRename={handleRename}
        />
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
          nextIsDisabled={uploadFiles.length === 0 || !allFilesDoneOrError}
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