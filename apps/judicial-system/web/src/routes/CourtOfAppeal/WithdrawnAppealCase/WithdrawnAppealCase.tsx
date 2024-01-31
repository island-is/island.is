import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, InputFileUpload, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import CaseNumbers from '../components/CaseNumbers/CaseNumbers'
import { strings } from './WithdrawnAppealCase.strings'

const WithdrawnAppealCase = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const {
    uploadFiles,
    allFilesUploaded,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )

  const previousUrl = `${constants.COURT_OF_APPEAL_CASES_ROUTE}`

  const isStepValid = allFilesUploaded

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.withdrawAppeal)} />
      <FormContentContainer>
        <Box marginBottom={2}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        <Box marginBottom={2}>
          <CaseNumbers />
        </Box>

        <Box component="section">
          <SectionHeading
            title={formatMessage(strings.courtRecordFileTitle)}
            marginBottom={1}
          />
          <Text marginBottom={3}>
            {formatMessage(strings.courtRecordFileSubtitle)}
            {'\n'}
          </Text>
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.APPEAL_COURT_RECORD,
            )}
            accept={'application/pdf'}
            header={formatMessage(strings.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(strings.uploadBoxButtonLabel)}
            onChange={(files) => 
              handleUpload(
                addUploadFiles(files, CaseFileCategory.APPEAL_COURT_RECORD),
                updateUploadFile,
              )
            }
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={previousUrl}
          onNextButtonClick={async () => {
            router.push(
              `${constants.COURT_OF_APPEAL_SUMMARY_ROUTE}/${workingCase.id}`,
            )
          }}
          nextButtonText={formatMessage(strings.continueButton)}
          nextIsDisabled={!isStepValid}
          nextButtonIcon="arrowForward"
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default WithdrawnAppealCase
