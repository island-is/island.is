import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

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
  rcCaseFiles as m,
} from '@island.is/judicial-system-web/messages'
import {
  TUploadFile,
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
  UploadFile,
} from '@island.is/island-ui/core'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import { CaseFile, CaseFileState } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import { PoliceCaseFileCheck, PoliceCaseFiles } from '../../components'

export const StepFive: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    refreshCase,
  } = useContext(FormContext)
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])
  const [filesInRVG, setFilesInRVG] = useState<UploadFile[]>()

  const {
    uploadErrorMessage,
    allFilesUploaded,
    handleRemoveFromS3,
    handleRetry,
    handleS3Upload,
    createFileMutation,
  } = useS3Upload(workingCase)
  const { updateCase } = useCase()

  useDeb(workingCase, 'caseFilesComments')

  const stepIsValid = allFilesUploaded && !isUploading
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  const addFileToCase = async (file: TUploadFile) => {
    if (workingCase && file.size && file.key) {
      await createFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            type: file.type,
            key: file.key,
            size: file.size,
            category: file.category,
            policeCaseNumber: file.policeCaseNumber,
          },
        },
      })
        .then((res) => {
          file.id = res.data.createFile.id
          file.status = 'done'
          setWorkingCase({
            ...workingCase,
            caseFiles: [
              {
                ...file,
                id: file.id || '',
                type: file.type || '',
                size: file.size || 0,
                caseId: workingCase.id,
                state: CaseFileState.STORED_IN_RVG,
                modified: new Date().toISOString(),
                created: new Date().toISOString(),
              },
              ...(workingCase.caseFiles || []),
            ],
          })
        })
        .catch(() => {
          // TODO: handle error
          console.log('TODO!!!!')
        })
    }
  }

  useEffect(() => {
    setFilesInRVG(workingCase.caseFiles)
  }, [workingCase.caseFiles])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.STEP_FIVE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.caseFiles)}
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
          setFilesInRVG={setFilesInRVG}
          refreshCase={refreshCase}
          addFileToCase={addFileToCase}
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
              fileList={filesInRVG || []}
              header={formatMessage(m.sections.files.label)}
              buttonLabel={formatMessage(m.sections.files.buttonLabel)}
              onChange={handleS3Upload}
              onRemove={(file) => {
                handleRemoveFromS3(file)
                setPoliceCaseFileList([
                  ...policeCaseFileList,
                  (file as unknown) as PoliceCaseFileCheck,
                ])
                setWorkingCase({
                  ...workingCase,
                  caseFiles: workingCase.caseFiles?.filter(
                    (f) => f.id !== file.id,
                  ),
                })
              }}
              onRetry={handleRetry}
              errorMessage={uploadErrorMessage}
              disabled={isUploading}
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
          previousUrl={`${constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.RESTRICTION_CASE_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default StepFive
