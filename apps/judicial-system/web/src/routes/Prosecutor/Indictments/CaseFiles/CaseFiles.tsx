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
import * as constants from '@island.is/judicial-system/consts'

import * as strings from './CaseFiles.strings'

const CaseFiles: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { formatMessage } = useIntl()

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
              {formatMessage(strings.caseFiles.sections.indictmentLetter)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={[]}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
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
            fileList={[]}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            multiple={false}
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
            fileList={[]}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.bill)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={[]}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.caseFileRecord)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={[]}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onRemove={() => ''}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3} display="flex">
            <Text variant="h3" as="h3">
              {formatMessage(strings.caseFiles.sections.caseFiles)}
            </Text>
            <Text color="red400" as="span" variant="h3">
              *
            </Text>
          </Box>
          <InputFileUpload
            fileList={[]}
            header={formatMessage(strings.caseFiles.sections.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.sections.buttonLabel)}
            onRemove={() => ''}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_PROCESSING_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INDICTMENTS_OVERVIEW_ROUTE}/${workingCase.id}`}
          // nextIsDisabled={!allFilesUploaded || isUploading}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
