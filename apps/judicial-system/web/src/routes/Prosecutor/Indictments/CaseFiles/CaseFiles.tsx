import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, InputFileUpload, Text } from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  PdfButton,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  generateSingleFileUpdate,
  mapCaseFileToUploadFile,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  TUploadFile,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isTrafficViolationCase } from '@island.is/judicial-system-web/src/utils/stepHelper'

import * as strings from './CaseFiles.strings'

const CaseFiles: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [displayFiles, setDisplayFiles] = useState<TUploadFile[]>([])
  const { formatMessage } = useIntl()
  const { handleChange, handleRemove, handleRetry } = useS3Upload(
    workingCase.id,
  )

  const isTrafficViolationCaseCheck = isTrafficViolationCase(workingCase)

  useEffect(() => {
    if (workingCase.caseFiles) {
      setDisplayFiles(workingCase.caseFiles.map(mapCaseFileToUploadFile))
    }
  }, [workingCase.caseFiles])

  const allFilesUploaded = useMemo(() => {
    return displayFiles.every(
      (file) => file.status === 'done' || file.status === 'error',
    )
  }, [displayFiles])

  const stepIsValid = allFilesUploaded
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const handleUIUpdate = (displayFile: TUploadFile, newId?: string) => {
    setDisplayFiles((previous) =>
      generateSingleFileUpdate(previous, displayFile, newId),
    )
  }

  const removeFileCB = useCallback((file: TUploadFile) => {
    setDisplayFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )
  }, [])

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
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.caseFiles.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.coverLetterSection)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.COVER_LETTER,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleChange(
                files,
                setDisplayFiles,
                handleUIUpdate,
                CaseFileCategory.COVER_LETTER,
              )
            }
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) =>
              handleRetry(file, handleUIUpdate, CaseFileCategory.COVER_LETTER)
            }
          />
        </Box>
        {!isTrafficViolationCaseCheck && (
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.caseFiles.indictmentSection)}
            />
            <InputFileUpload
              fileList={displayFiles.filter(
                (file) => file.category === CaseFileCategory.INDICTMENT,
              )}
              accept={Object.values(fileExtensionWhitelist)}
              header={formatMessage(strings.caseFiles.inputFieldLabel)}
              buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
              onChange={(files) =>
                handleChange(
                  files,
                  setDisplayFiles,
                  handleUIUpdate,
                  CaseFileCategory.INDICTMENT,
                )
              }
              onRemove={(file) => handleRemove(file, removeFileCB)}
              onRetry={(file) =>
                handleRetry(file, handleUIUpdate, CaseFileCategory.INDICTMENT)
              }
            />
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.criminalRecordSection)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleChange(
                files,
                setDisplayFiles,
                handleUIUpdate,
                CaseFileCategory.CRIMINAL_RECORD,
              )
            }
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) =>
              handleRetry(
                file,
                handleUIUpdate,
                CaseFileCategory.CRIMINAL_RECORD,
              )
            }
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.costBreakdownSection)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleChange(
                files,
                setDisplayFiles,
                handleUIUpdate,
                CaseFileCategory.COST_BREAKDOWN,
              )
            }
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) =>
              handleRetry(file, handleUIUpdate, CaseFileCategory.COST_BREAKDOWN)
            }
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.otherDocumentsSection)}
          />
          <InputFileUpload
            fileList={displayFiles.filter(
              (file) =>
                file.category === CaseFileCategory.CASE_FILE &&
                !file.policeCaseNumber,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleChange(
                files,
                setDisplayFiles,
                handleUIUpdate,
                CaseFileCategory.CASE_FILE,
              )
            }
            onRemove={(file) => handleRemove(file, removeFileCB)}
            onRetry={(file) =>
              handleRetry(file, handleUIUpdate, CaseFileCategory.CASE_FILE)
            }
          />
        </Box>
        {isTrafficViolationCaseCheck && (
          <Box marginBottom={10}>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(strings.caseFiles.pdfButtonIndictment)}
              pdfType="indictment"
            />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${
            isTrafficViolationCaseCheck
              ? constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE
              : constants.INDICTMENTS_PROCESSING_ROUTE
          }/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
