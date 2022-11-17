import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  ProsecutorCaseInfo,
  FormContentContainer,
  FormFooter,
  PageLayout,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages'
import { Box, InputFileUpload, Text } from '@island.is/island-ui/core'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import * as strings from './CaseFiles.strings'

const CaseFiles: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()
  const {
    files,
    handleS3Upload,
    handleRemoveFromS3,
    handleRetry,
    allFilesUploaded,
  } = useS3Upload(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.CASE_FILES}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
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
            title={formatMessage(strings.caseFiles.sections.coverLetter)}
          />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.COVER_LETTER,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.COVER_LETTER)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.indictment)}
          />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.INDICTMENT,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.INDICTMENT)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.criminalRecord)}
          />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.CRIMINAL_RECORD)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.costBreakdown)}
          />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.COST_BREAKDOWN)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.sections.otherDocuments)}
          />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.CASE_FILE,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.CASE_FILE)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_PROCESSING_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
