import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

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
  useCase,
  useDeb,
  useS3Upload,
  useS3UploadV2,
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
import {
  CaseFile,
  CaseFileState,
  CaseOrigin,
  PoliceCaseFile,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import { PoliceCaseFileCheck, PoliceCaseFiles } from '../../components'
import { useQuery } from '@apollo/client'
import { PoliceCaseFilesQuery } from '@island.is/judicial-system-web/graphql'

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorCode?: string
}

const mapCaseFileToUploadFile = (file: CaseFile): UploadFile => ({
  name: file.name,
  type: file.type,
  id: file.id,
  key: file.key,
  status: 'done',
  percent: 100,
  size: file.size,
})

const mapToP = (file: PoliceCaseFile): PoliceCaseFileCheck => ({
  id: file.id,
  name: file.name,
  checked: false,
})

export const StepFive: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useQuery(PoliceCaseFilesQuery, {
    variables: { input: { caseId: workingCase.id } },
    fetchPolicy: 'no-cache',
    skip: workingCase.origin !== CaseOrigin.LOKE,
  })
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])
  const [filesInRVG, setFilesInRVG] = useState<UploadFile[]>(
    workingCase.caseFiles?.map(mapCaseFileToUploadFile) || [],
  )
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()

  const {
    uploadErrorMessage,
    allFilesUploaded,
    handleRemoveFromS3,
    handleRetry,
    addFileToCase,
  } = useS3Upload(workingCase)
  const { upload } = useS3UploadV2(workingCase.id)
  const { updateCase } = useCase()

  useDeb(workingCase, 'caseFilesComments')

  const stepIsValid = allFilesUploaded && !isUploading
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  const setSingleFile = useCallback(
    (displayFile: UploadFile, newId?: string) => {
      setFilesInRVG((previous) => {
        const index = previous.findIndex((f) => f.id === displayFile.id)
        if (index === -1) {
          return previous
        }
        const next = [...previous]
        next[index] = { ...displayFile, id: newId ?? displayFile.id }
        return next
      })
    },
    [setFilesInRVG],
  )

  const handleUpload = useCallback(
    (files: File[]) => {
      const filesWithId: Array<[File, string]> = files.map((file) => [
        file,
        uuid(),
      ])

      setFilesInRVG((previous) => [
        ...filesWithId.map(
          ([file, id]): UploadFile => ({
            status: 'uploading',
            percent: 1,
            name: file.name,
            id: id,
            type: file.type,
          }),
        ),
        ...(previous || []),
      ])

      upload(filesWithId, setSingleFile)
    },
    [setSingleFile, upload],
  )

  useEffect(() => {
    setFilesInRVG(workingCase.caseFiles?.map(mapCaseFileToUploadFile) || [])
  }, [workingCase.caseFiles])

  useEffect(() => {
    if (workingCase.origin !== CaseOrigin.LOKE) {
      setPoliceCaseFiles({
        files: [],
        isLoading: false,
        hasError: false,
      })
    } else if (policeData && policeData.policeCaseFiles) {
      setPoliceCaseFiles({
        files: policeData.policeCaseFiles,
        isLoading: false,
        hasError: false,
      })
    } else if (policeDataLoading) {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: false,
        hasError: true,
        errorCode: policeDataError?.graphQLErrors[0]?.extensions
          ?.code as string,
      })
    }
  }, [
    policeData,
    policeDataError,
    policeDataLoading,
    workingCase.origin,
    setPoliceCaseFiles,
  ])

  useEffect(() => {
    setPoliceCaseFileList(policeCaseFiles?.files.map(mapToP) || [])
  }, [policeCaseFiles])

  console.log('policeCaseFiles', policeCaseFileList)

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
          filesInRVG={filesInRVG}
          setFilesInRVG={setFilesInRVG}
          addFileToCase={addFileToCase}
          addFileToCaseCB={setSingleFile}
          policeCaseFiles={policeCaseFiles}
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
              onChange={handleUpload}
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
