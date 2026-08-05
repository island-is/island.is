import { useContext, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { validate as validateUuid } from 'uuid'

import { FileUploadStatus, Input, toast } from '@island.is/island-ui/core'
import {
  PROSECUTION_INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
  PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE,
  PROSECUTION_RESTRICTION_CASE_POLICE_REPORT_ROUTE,
} from '@island.is/judicial-system/consts'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { core, errors } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  Item,
  PageHeader,
  PageLayout,
  PageTitle,
  ParentCaseFiles,
  ProsecutorCaseInfo,
  ReorderableFileUpload,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { useUpdateFilesReorderableMutation } from '@island.is/judicial-system-web/src/components/ReorderableFileUpload/updateFiles.generated'
import {
  CaseOrigin,
  PoliceDigitalCaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useDebouncedInput,
  useFileList,
  usePoliceDigitalCaseFile,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import {
  mapPoliceCaseFileToPoliceCaseFileCheck,
  PoliceCaseFiles,
  PoliceCaseFilesData,
} from '../../components'
import { PoliceDigitalCaseFilesList } from '../PoliceCaseFiles/PoliceDigitalCaseFiles'
import { usePoliceCaseFilesQuery } from './policeCaseFiles.generated'
import { caseFiles as strings } from './CaseFiles.strings'

export const CaseFiles = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
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
  const [isUploadingPoliceCaseFiles, setIsUploadingPoliceCaseFiles] =
    useState<boolean>(false)
  const [editCount, setEditCount] = useState(0)
  const [updateFilesMutation] = useUpdateFilesReorderableMutation()
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFile,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleUploadFromPolice, handleRetry, handleRemove } =
    useS3Upload(workingCase.id)

  const { onOpenFile } = useFileList({
    caseId: workingCase.id,
  })

  const {
    digitalCaseFiles,
    digitalCaseFilesLoading,
    digitalCaseFilesError,
    deletePoliceDigitalCaseFile,
  } = usePoliceDigitalCaseFile()

  const caseFilesComments = useDebouncedInput('caseFilesComments', [])

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

  const policeCaseFileList = useMemo(
    () =>
      policeCaseFiles?.files
        .filter(
          (policeFile) =>
            !uploadFiles.some(
              (file) => !file.category && file.policeFileId === policeFile.id,
            ),
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) ?? [],
    [policeCaseFiles, uploadFiles],
  )

  const uploadErrorMessage = useMemo(() => {
    if (uploadFiles.some((file) => file.status === FileUploadStatus.error)) {
      return formatMessage(errors.general)
    }
    if (uploadFiles.some((file) => file.size === 0)) {
      return 'Villa kom upp. Tómt skjal.'
    } else {
      return undefined
    }
  }, [uploadFiles, formatMessage])

  const stepIsValid =
    !isUploadingPoliceCaseFiles && allFilesDoneOrError && editCount === 0

  const handleReorder = async (
    files: { id: string; orderWithinChapter: number }[],
  ) => {
    const persistedFiles = files.filter((file) => validateUuid(file.id))

    if (persistedFiles.length === 0) {
      return
    }

    files.forEach(({ id, orderWithinChapter }) => {
      const file = uploadFiles.find((f) => f.id === id)
      if (file) {
        updateUploadFile({ ...file, orderWithinChapter })
      }
    })

    try {
      const { errors: mutationErrors } = await updateFilesMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            files: persistedFiles.map((f) => ({
              id: f.id,
              orderWithinChapter: f.orderWithinChapter,
            })),
          },
        },
      })
      if (mutationErrors) {
        toast.error(formatMessage(errors.general))
      }
    } catch {
      toast.error(formatMessage(errors.general))
    }
  }

  const handleRename = async (fileId: string, newName: string) => {
    const fileToUpdate = uploadFiles.find((file) => file.id === fileId)
    if (fileToUpdate) {
      updateUploadFile({ ...fileToUpdate, userGeneratedFilename: newName })
    }

    if (!validateUuid(fileId)) {
      return
    }

    try {
      const { errors: mutationErrors } = await updateFilesMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            files: [{ id: fileId, userGeneratedFilename: newName }],
          },
        },
      })
      if (mutationErrors) {
        toast.error(formatMessage(errors.general))
      }
    } catch {
      toast.error(formatMessage(errors.general))
    }
  }
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  const uploadPoliceCaseFileCallback = (file: TUploadFile, newId?: string) => {
    if (newId) {
      addUploadFile({ ...file, id: newId })
    }
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

    setIsUploadingPoliceCaseFiles(true)

    await handleUploadFromPolice(filesToUpload, uploadPoliceCaseFileCallback)

    setIsUploadingPoliceCaseFiles(false)
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
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <ProsecutorCaseInfo workingCase={workingCase} />
          <ParentCaseFiles files={workingCase.parentCase?.caseFiles} />
          <section>
            <SectionHeading
              title={formatMessage(strings.policeCaseFilesHeading)}
              description={
                workingCase.origin === CaseOrigin.LOKE
                  ? formatMessage(strings.policeCaseFilesIntroduction)
                  : undefined
              }
            />
            <PoliceCaseFiles
              onUpload={handlePoliceCaseFileUpload}
              policeCaseFileList={policeCaseFileList}
              policeCaseFiles={policeCaseFiles}
            />
            {((digitalCaseFiles && digitalCaseFiles.length > 0) ||
              digitalCaseFilesError) && (
              <PoliceDigitalCaseFilesList
                digitalCaseFiles={digitalCaseFiles ?? []}
                onRemove={(file: PoliceDigitalCaseFile) => {
                  deletePoliceDigitalCaseFile(file.id)
                }}
                isLoading={digitalCaseFilesLoading}
                errorMessage={
                  digitalCaseFilesError
                    ? 'Ekki tókst að sækja rafræn skjöl í LÖKE.'
                    : undefined
                }
              />
            )}
          </section>
          <section>
            <SectionHeading
              title={formatMessage(strings.filesHeading)}
              description="Gögnin í pakkanum hér fyrir neðan munu liggja frammi í þinghaldinu. Samkvæmt reglum dómstólasýslunnar skulu skjöl hafa lýsandi heiti."
            />
            <ReorderableFileUpload
              files={uploadFiles.filter((file) => !file.category)}
              dropzoneTitle={formatMessage(strings.filesLabel)}
              dropzoneButtonLabel={formatMessage(strings.filesButtonLabel)}
              onFilesChange={(files) =>
                handleUpload(addUploadFiles(files), updateUploadFile)
              }
              onRemove={(file) => handleRemove(file, removeUploadFile)}
              onRetry={(file) => handleRetry(file, updateUploadFile)}
              onOpenFile={(file) => onOpenFile(file)}
              onReorder={handleReorder}
              onRename={handleRename}
              setEditCount={setEditCount}
              disabled={isUploadingPoliceCaseFiles}
              errorMessage={uploadErrorMessage}
            />
          </section>
          <section>
            <SectionHeading
              title={formatMessage(strings.commentsHeading)}
              tooltip={formatMessage(strings.commentsTooltip)}
            />
            <Input
              name="caseFilesComments"
              label={formatMessage(strings.commentsLabel)}
              placeholder={formatMessage(strings.commentsPlaceholder)}
              value={caseFilesComments.value}
              onChange={(evt) => caseFilesComments.onChange(evt.target.value)}
              textarea
              rows={7}
            />
          </section>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${
            isRestrictionCase(workingCase.type)
              ? PROSECUTION_RESTRICTION_CASE_POLICE_REPORT_ROUTE
              : PROSECUTION_INVESTIGATION_CASE_POLICE_REPORT_ROUTE
          }/${workingCase.id}`}
          actions={[
            {
              text: formatMessage(core.continue),
              icon: 'arrowForward',
              onClick: () =>
                handleNavigationTo(
                  isRestrictionCase(workingCase.type)
                    ? PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE
                    : PROSECUTION_INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
                ),
              disabled: !stepIsValid,
              testId: 'continueButton',
            },
          ]}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
