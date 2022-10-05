import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { titles } from '@island.is/judicial-system-web/messages'
import { Box, InputFileUpload, Text } from '@island.is/island-ui/core'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { policeCaseFiles as m } from './PoliceCaseFilesRoute.strings'
import { PoliceCaseFileCheck, PoliceCaseFiles } from '../../components'

const PoliceCaseFilesRoute = () => {
  const { formatMessage } = useIntl()
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const {
    files,
    uploadErrorMessage,
    allFilesUploaded,
    handleS3Upload,
    handleRemoveFromS3,
    handleRetry,
  } = useS3Upload(workingCase)

  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.POLICE_CASE_FILES}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.policeCaseFiles)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        {workingCase.policeCaseNumbers.map((policeCaseNumber, index) => (
          <Box key={index} marginBottom={6}>
            <Box marginBottom={5}>
              <PoliceCaseFiles
                isUploading={false}
                setIsUploading={() => false}
                policeCaseFileList={policeCaseFileList}
                setPoliceCaseFileList={() => false}
                policeCaseNumber={policeCaseNumber}
              />
            </Box>
            <InputFileUpload
              name="fileUpload"
              fileList={files}
              header={'Dragðu gögn hingað til að hlaða upp'}
              buttonLabel={'Velja gögn til að hlaða upp'}
              onChange={handleS3Upload}
              onRemove={(file) => handleRemoveFromS3(file)}
              onRetry={handleRetry}
              errorMessage={uploadErrorMessage}
              showFileSize
            />
          </Box>
        ))}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceCaseFilesRoute
