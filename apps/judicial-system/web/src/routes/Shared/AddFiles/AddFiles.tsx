import { FC, useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
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

  const { uploadFiles, addUploadFiles, updateUploadFile, removeUploadFile } =
    useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )

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
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default AddFiles
