import { useContext } from 'react'
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
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { CaseNumberInput } from '../components'
import { strings } from './WithdrawnAppealCase.strings'

const WithdrawnAppealCase = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )
  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

  const isStepValid = allFilesDoneOrError && workingCase.appealCaseNumber

  return (
    <PageLayout workingCase={workingCase} isLoading={false} notFound={false}>
      <PageHeader title={formatMessage(titles.shared.withdrawAppeal)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(core.appealCaseNumberHeading)} />
          <CaseNumberInput />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.courtRecordFileTitle)}
            marginBottom={1}
          />
          <Text marginBottom={3}>
            {formatMessage(strings.courtRecordFileSubtitle)}
            {'\n'}
          </Text>
          <InputFileUpload
            name="appealCourtRecord"
            files={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.APPEAL_COURT_RECORD,
            )}
            accept={'application/pdf'}
            title={formatMessage(strings.uploadBoxTitle)}
            description={formatMessage(core.uploadBoxDescription, {
              fileEndings: '.pdf',
            })}
            buttonLabel={formatMessage(strings.uploadBoxButtonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, {
                  category: CaseFileCategory.APPEAL_COURT_RECORD,
                }),
                updateUploadFile,
              )
            }
            onOpenFile={(file) => onOpenFile(file)}
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.COURT_OF_APPEAL_OVERVIEW_ROUTE}/${workingCase.id}`}
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
