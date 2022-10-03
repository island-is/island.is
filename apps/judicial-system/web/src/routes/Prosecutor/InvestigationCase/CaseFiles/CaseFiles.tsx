import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  ProsecutorCaseInfo,
  FormContentContainer,
  FormFooter,
  PageLayout,
  ParentCaseFiles,
  FormContext,
  MarkdownWrapper,
} from '@island.is/judicial-system-web/src/components'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  icCaseFiles as m,
} from '@island.is/judicial-system-web/messages'
import {
  useCase,
  useDeb,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  Box,
  ContentBlock,
  Input,
  InputFileUpload,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import * as constants from '@island.is/judicial-system/consts'

import { PoliceCaseFileCheck, PoliceCaseFiles } from '../../components'

export const CaseFiles: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()

  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const {
    files,
    uploadErrorMessage,
    allFilesUploaded,
    handleS3Upload,
    handleRemoveFromS3,
    handleRetry,
  } = useS3Upload(workingCase)
  const { updateCase } = useCase()

  useDeb(workingCase, 'caseFilesComments')

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.STEP_FIVE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.caseFiles)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <ParentCaseFiles files={workingCase.parentCase?.caseFiles} />
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.description.heading)}
            </Text>
          </Box>
          <MarkdownWrapper
            markdown={formatMessage(m.sections.description.list)}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <PoliceCaseFiles
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          policeCaseFileList={policeCaseFileList}
          setPoliceCaseFileList={setPoliceCaseFileList}
        />
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.files.heading)}
          </Text>
          <Text marginTop={1}>
            {formatMessage(m.sections.files.introduction)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <ContentBlock>
            <InputFileUpload
              name="fileUpload"
              fileList={files}
              header={formatMessage(m.sections.files.label)}
              buttonLabel={formatMessage(m.sections.files.buttonLabel)}
              onChange={handleS3Upload}
              onRemove={(file) => handleRemoveFromS3(file)}
              onRetry={handleRetry}
              errorMessage={uploadErrorMessage}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              {formatMessage(m.sections.comments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(m.sections.comments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(m.sections.comments.label)}
              placeholder={formatMessage(m.sections.comments.placeholder)}
              value={workingCase.caseFilesComments || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event.target.value,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(workingCase.id, {
                  caseFilesComments: evt.target.value,
                })
              }
              textarea
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`}
          nextUrl={`${constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded || isUploading}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
