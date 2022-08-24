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
import {
  Box,
  InputFileUpload,
  Tag,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseFile, CaseFileSubtype } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import * as strings from './CaseFiles.strings'

const CaseFiles: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()
  const { files, handleS3Upload, allFilesUploaded } = useS3Upload(workingCase)

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
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.coverLetter)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={files.filter(
              (file) => file.subtype === CaseFileSubtype.COVER_LETTER,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileSubtype.COVER_LETTER)
            }
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.indictment)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={files.filter(
              (file) => file.subtype === CaseFileSubtype.INDICTMENT,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileSubtype.INDICTMENT)
            }
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.criminalRecord)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={files.filter(
              (file) => file.subtype === CaseFileSubtype.CRIMINAL_RECORD,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileSubtype.CRIMINAL_RECORD)
            }
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.costBreakdown)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={files.filter(
              (file) => file.subtype === CaseFileSubtype.COST_BREAKDOWN,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileSubtype.COST_BREAKDOWN)
            }
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.caseFileContents)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={files.filter(
              (file) => file.subtype === CaseFileSubtype.CASE_FILE_CONTENTS,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileSubtype.CASE_FILE_CONTENTS)
            }
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.caseFile)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={files.filter(
              (file) => file.subtype === CaseFileSubtype.CASE_FILE,
            )}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileSubtype.CASE_FILE)
            }
            onRemove={() => ''}
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
