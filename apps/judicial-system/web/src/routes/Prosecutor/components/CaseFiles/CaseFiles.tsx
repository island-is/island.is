import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { uuid } from 'uuidv4'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

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
import { errors } from '@island.is/judicial-system-web/messages'
import {
  useCase,
  useDeb,
  useS3UploadV2,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  Box,
  ContentBlock,
  Input,
  InputFileUpload,
  Text,
  toast,
  Tooltip,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  mapCaseFileToUploadFile,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  CaseFileState,
  CaseOrigin,
  isRestrictionCase,
  PoliceCaseFile,
} from '@island.is/judicial-system/types'
import { PoliceCaseFilesQuery } from '@island.is/judicial-system-web/graphql'
import { GetPoliceCaseFilesQuery } from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import { PoliceCaseFileCheck, PoliceCaseFiles } from '../../components'
import { caseFiles as strings } from './CaseFiles.strings'

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorCode?: string
}

const mapPoliceCaseFileToPoliceCaseFileCheck = (
  file: PoliceCaseFile,
): PoliceCaseFileCheck => ({
  id: file.id,
  name: file.name,
  checked: false,
})

export const CaseFiles: React.FC = () => {
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
  } = useQuery<GetPoliceCaseFilesQuery>(PoliceCaseFilesQuery, {
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

  const { upload, uploadPoliceCaseFile, remove } = useS3UploadV2(workingCase.id)
  const { updateCase } = useCase()

  useDeb(workingCase, 'caseFilesComments')

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
        files:
          policeData && policeData.policeCaseFiles
            ? policeData.policeCaseFiles
            : [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files:
          policeData && policeData.policeCaseFiles
            ? policeData.policeCaseFiles
            : [],
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
    setPoliceCaseFiles,
    workingCase.origin,
    workingCase.caseFiles,
  ])

  useEffect(() => {
    setPoliceCaseFileList(
      policeCaseFiles?.files
        .filter(
          (f) =>
            !workingCase.caseFiles?.some(
              (caseFile) => caseFile.name === f.name,
            ),
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) || [],
    )

    setFilesInRVG(workingCase.caseFiles?.map(mapCaseFileToUploadFile) || [])
  }, [policeCaseFiles, workingCase.caseFiles])

  const uploadErrorMessage = useMemo(() => {
    if (filesInRVG.some((file) => file.status === 'error')) {
      return formatMessage(errors.general)
    } else {
      return undefined
    }
  }, [filesInRVG, formatMessage])

  const stepIsValid = !isUploading
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
    [],
  )

  const handleUpload = useCallback(
    async (files: File[]) => {
      const filesWithId: Array<[File, string]> = files.map((file) => [
        file,
        uuid(),
      ])

      setIsUploading(true)

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

      await upload(filesWithId, setSingleFile)

      setIsUploading(false)
    },
    [setSingleFile, upload],
  )

  const handlePoliceCaseFileUpload = useCallback(async () => {
    const filesToUpload = policeCaseFileList.filter((p) => p.checked)

    setIsUploading(true)

    filesToUpload.forEach(async (f, index) => {
      const fileToUpload = {
        id: f.id,
        type: 'application/pdf',
        name: f.name,
        status: 'done',
        state: CaseFileState.STORED_IN_RVG,
      } as UploadFile

      await uploadPoliceCaseFile(fileToUpload)

      setFilesInRVG([fileToUpload, ...filesInRVG])
      setPoliceCaseFileList((previous) => previous.filter((p) => p.id !== f.id))

      if (index === filesToUpload.length - 1) {
        setIsUploading(false)
      }
    })
  }, [filesInRVG, policeCaseFileList, uploadPoliceCaseFile])

  const handleRemove = useCallback(
    async (file: UploadFile) => {
      try {
        if (file.id) {
          const response = await remove(file.id)

          if (!response.data?.deleteFile.success) {
            throw new Error(`Failed to delete file: ${file.id}`)
          }

          const policeCaseFile = policeCaseFiles?.files.find(
            (f) => f.name === file.name,
          )

          if (policeCaseFile) {
            setPoliceCaseFileList((previous) => [
              mapPoliceCaseFileToPoliceCaseFileCheck(policeCaseFile),
              ...previous,
            ])
          }

          setFilesInRVG((previous) => previous.filter((f) => f.id !== file.id))
        }
      } catch (e) {
        toast.error(formatMessage(errors.failedDeleteFile))
      }
    },
    [formatMessage, policeCaseFiles?.files, remove],
  )

  const handleRetry = useCallback(
    (file: UploadFile) => {
      setSingleFile({
        name: file.name,
        id: file.id,
        percent: 1,
        status: 'uploading',
        type: file.type,
      })
      upload(
        [
          [
            { name: file.name, type: file.type ?? '' } as File,
            file.id ?? file.name,
          ],
        ],
        setSingleFile,
      )
    },
    [setSingleFile, upload],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.CASE_FILES}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <ParentCaseFiles files={workingCase.parentCase?.caseFiles} />
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.descriptionHeading)}
            </Text>
          </Box>
          <MarkdownWrapper
            markdown={formatMessage(strings.descriptionList)}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <PoliceCaseFiles
          onUpload={handlePoliceCaseFileUpload}
          isUploading={isUploading}
          policeCaseFileList={policeCaseFileList}
          setPoliceCaseFileList={setPoliceCaseFileList}
          policeCaseFiles={policeCaseFiles}
        />
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(strings.filesHeading)}
          </Text>
          <Text marginTop={1}>{formatMessage(strings.filesIntroduction)}</Text>
        </Box>
        <Box marginBottom={5}>
          <ContentBlock>
            <InputFileUpload
              name="fileUpload"
              fileList={filesInRVG}
              header={formatMessage(strings.filesLabel)}
              buttonLabel={formatMessage(strings.filesButtonLabel)}
              onChange={handleUpload}
              onRemove={handleRemove}
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
              {formatMessage(strings.commentsHeading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(strings.commentsTooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(strings.commentsLabel)}
              placeholder={formatMessage(strings.commentsPlaceholder)}
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
          previousUrl={`${
            isRestrictionCase(workingCase.type)
              ? constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE
              : constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE
          }/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              isRestrictionCase(workingCase.type)
                ? constants.RESTRICTION_CASE_OVERVIEW_ROUTE
                : constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
            )
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
