import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  ContentBlock,
  Input,
  InputFileUpload,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  MarkdownWrapper,
  PageLayout,
  ParentCaseFiles,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { Item } from '@island.is/judicial-system-web/src/components/SelectableList/SelectableList'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  TUploadFile,
  useCase,
  useDeb,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import {
  mapPoliceCaseFileToPoliceCaseFileCheck,
  PoliceCaseFileCheck,
  PoliceCaseFiles,
  PoliceCaseFilesData,
} from '../../components'
import { usePoliceCaseFilesQuery } from './policeCaseFiles.generated'
import { caseFiles as strings } from './CaseFiles.strings'

export const CaseFiles: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = usePoliceCaseFilesQuery({
    variables: { input: { caseId: workingCase.id } },
    skip: workingCase.origin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()
  const {
    uploadFiles,
    allFilesUploaded,
    addUploadFile,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleUploadFromPolice, handleRetry, handleRemove } =
    useS3Upload(workingCase.id)
  const { updateCase } = useCase()

  useDeb(workingCase, 'caseFilesComments')

  useEffect(() => {
    if (workingCase.origin !== CaseOrigin.LOKE) {
      setPoliceCaseFiles({
        files: [],
        isLoading: false,
        hasError: false,
      })
    } else if (policeDataError) {
      setPoliceCaseFiles({
        files: [],
        isLoading: false,
        hasError: true,
        errorCode: policeDataError?.graphQLErrors[0]?.extensions
          ?.code as string,
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
        files: policeData?.policeCaseFiles ?? [],
        isLoading: false,
        hasError: false,
      })
    }
  }, [policeData, policeDataError, policeDataLoading, workingCase.origin])

  useEffect(() => {
    setPoliceCaseFileList(
      policeCaseFiles?.files
        .filter(
          (policeFile) =>
            !workingCase.caseFiles?.some(
              (file) => !file.category && file.policeFileId === policeFile.id,
            ),
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) || [],
    )
  }, [policeCaseFiles, workingCase.caseFiles])

  const uploadErrorMessage = useMemo(() => {
    if (uploadFiles.some((file) => file.status === 'error')) {
      return formatMessage(errors.general)
    } else {
      return undefined
    }
  }, [uploadFiles, formatMessage])

  const stepIsValid = !isUploading && allFilesUploaded
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  const uploadPoliceCaseFileCallback = (file: TUploadFile, newId?: string) => {
    if (newId) {
      addUploadFile({ ...file, id: newId })
    }

    setPoliceCaseFileList((previous) =>
      newId
        ? previous.filter((p) => p.id !== file.id)
        : previous.map((p) =>
            p.id === file.id ? { ...p, checked: false } : p,
          ),
    )
  }

  const handlePoliceCaseFileUpload = async (selectedFiles: Item[]) => {
    const filesToUpload = policeCaseFileList
      .filter((p) => selectedFiles.some((f) => f.id === p.id))
      .map((f) => ({
        id: f.id,
        name: f.name,
        type: 'application/pdf',
        policeFileId: f.id,
      }))

    if (filesToUpload.length === 0) {
      return
    }

    setIsUploading(true)

    await handleUploadFromPolice(filesToUpload, uploadPoliceCaseFileCallback)

    setIsUploading(false)
  }

  const removeFileCB = (file: TUploadFile) => {
    const policeCaseFile = policeCaseFiles?.files.find(
      (f) => f.id === file.policeFileId,
    )

    if (policeCaseFile) {
      setPoliceCaseFileList((previous) => [
        mapPoliceCaseFileToPoliceCaseFileCheck(policeCaseFile),
        ...previous,
      ])
    }

    removeUploadFile(file)
  }

  return (
    <PageLayout
      workingCase={workingCase}
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
        <SectionHeading
          title={formatMessage(strings.policeCaseFilesHeading)}
          description={formatMessage(strings.policeCaseFilesIntroduction)}
        />
        <PoliceCaseFiles
          onUpload={handlePoliceCaseFileUpload}
          policeCaseFileList={policeCaseFileList}
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
              accept={Object.values(fileExtensionWhitelist)}
              fileList={uploadFiles.filter((file) => !file.category)}
              header={formatMessage(strings.filesLabel)}
              buttonLabel={formatMessage(strings.filesButtonLabel)}
              onChange={(files) =>
                handleUpload(addUploadFiles(files), updateUploadFile)
              }
              onRemove={(file) => handleRemove(file, removeFileCB)}
              onRetry={(file) => handleRetry(file, updateUploadFile)}
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
          nextButtonIcon="arrowForward"
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
