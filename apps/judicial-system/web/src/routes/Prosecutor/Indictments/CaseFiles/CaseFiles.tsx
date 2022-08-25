import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { core, titles } from '@island.is/judicial-system-web/messages'
import { Box, InputFileUpload, Tag, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
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
        <Box marginBottom={2}>
          <Tag>{workingCase.policeCaseNumber}</Tag>
        </Box>
        <Box marginBottom={5}>
          <Text fontWeight="semiBold">{`${formatMessage(core.court)}: ${
            workingCase.court?.name
          }`}</Text>
          <Text fontWeight="semiBold">{`${capitalize(
            formatMessage(core.indictmentDefendant),
          )}: ${workingCase.defendants
            ?.map((defendant) => defendant.name)
            .toString()
            .replace(/,/g, ', ')}`}</Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="inlineFlex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.coverLetter)}
            </Text>
          </Box>
          <Text color="red400" as="span" variant="h3">
            {` *`}
          </Text>
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
          <Box marginBottom={3} display="inlineFlex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.indictment)}
            </Text>
          </Box>
          <Text color="red400" as="span" variant="h3">
            {` *`}
          </Text>

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
          <Box marginBottom={3} display="inlineFlex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.criminalRecord)}
            </Text>
          </Box>
          <Text color="red400" as="span" variant="h3">
            {` *`}
          </Text>

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
          <Box marginBottom={3} display="inlineFlex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.costBreakdown)}
            </Text>
          </Box>
          <Text color="red400" as="span" variant="h3">
            {` *`}
          </Text>

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
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="inlineFlex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.caseFileContents)}
            </Text>
          </Box>
          <Text color="red400" as="span" variant="h3">
            {` *`}
          </Text>

          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.CASE_FILE_CONTENTS,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.CASE_FILE_CONTENTS)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3} display="inlineFlex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.caseFile)}
            </Text>
          </Box>
          <Text color="red400" as="span" variant="h3">
            {` *`}
          </Text>

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
