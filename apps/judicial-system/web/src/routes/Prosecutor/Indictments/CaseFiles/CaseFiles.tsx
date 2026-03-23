import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Button, InputFileUpload } from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import * as strings from './CaseFiles.strings'

const CaseFiles = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFile,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)

  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

  const {
    handleUploadCriminalRecord,
    handleUpload,
    handleRetry,
    handleRemove,
  } = useS3Upload(workingCase.id)

  const stepIsValid = allFilesDoneOrError
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.caseFiles)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.caseFiles.heading)}</PageTitle>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.criminalRecordSection)}
            heading="h2"
          />
          <Box marginBottom={3}>
            <Button
              variant="text"
              onClick={() => {
                if (!workingCase.defendants) {
                  return
                }
                handleUploadCriminalRecord(
                  workingCase.defendants,
                  addUploadFile,
                  updateUploadFile,
                )
              }}
              size="small"
            >
              Sækja sakavottorð til sakaskrár
            </Button>
          </Box>
          <InputFileUpload
            name="criminalRecord"
            files={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            title={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, {
                  category: CaseFileCategory.CRIMINAL_RECORD,
                }),
                updateUploadFile,
              )
            }
            onOpenFile={(file) => onOpenFile(file)}
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.costBreakdownSection)}
            heading="h2"
          />
          <InputFileUpload
            name="costBreakdown"
            files={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            title={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, {
                  category: CaseFileCategory.COST_BREAKDOWN,
                }),
                updateUploadFile,
              )
            }
            onOpenFile={(file) => onOpenFile(file)}
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.otherDocumentsSection)}
            heading="h2"
          />
          <InputFileUpload
            name="caseFiles"
            files={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.CASE_FILE,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            title={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, { category: CaseFileCategory.CASE_FILE }),
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
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_CASE_FILE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_PROCESSING_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
