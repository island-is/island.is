import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import _isEqual from 'lodash/isEqual'
import router from 'next/router'

import { Box, InputFileUpload, UploadFile } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseFile,
  CaseFileCategory,
  CaseFileState,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import {
  errors as errorMessages,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentInfo,
  InfoBox,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { Item } from '@island.is/judicial-system-web/src/components/SelectableList/SelectableList'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'
import { mapCaseFileToUploadFile } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'

import {
  mapPoliceCaseFileToPoliceCaseFileCheck,
  PoliceCaseFileCheck,
  PoliceCaseFiles,
  PoliceCaseFilesData,
} from '../../components'
import { useGetIndictmentPoliceCaseFilesQuery } from './getIndictmentPoliceCaseFiles.generated'
import { policeCaseFiles as m } from './PoliceCaseFilesRoute.strings'

const UploadFilesToPoliceCase: React.FC<
  React.PropsWithChildren<{
    caseId: string
    policeCaseNumber: string
    setAllUploaded: (allUploaded: boolean) => void
    caseFiles: CaseFile[]
    caseOrigin: CaseOrigin
  }>
> = ({ caseId, policeCaseNumber, setAllUploaded, caseFiles, caseOrigin }) => {
  const { formatMessage } = useIntl()
  const {
    handleChange,
    handleRemove,
    handleRetry,
    uploadFromPolice,
    generateSingleFileUpdate,
  } = useS3Upload(caseId)
  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useGetIndictmentPoliceCaseFilesQuery({
    variables: { input: { caseId } },
    skip: caseOrigin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [displayFiles, setDisplayFiles] = useState<UploadFile[]>(
    caseFiles.map(mapCaseFileToUploadFile),
  )

  const [policeCaseFileList, setPoliceCaseFileList] =
    useState<PoliceCaseFileCheck[]>()

  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()

  const [isUploading, setIsUploading] = useState<boolean>(false)

  const errorMessage = useMemo(() => {
    if (displayFiles.some((file) => file.status === 'error')) {
      return formatMessage(errorMessages.general)
    } else {
      return undefined
    }
  }, [displayFiles, formatMessage])

  useEffect(() => {
    setDisplayFiles(caseFiles.map(mapCaseFileToUploadFile))
  }, [caseFiles, setDisplayFiles])

  useEffect(() => {
    const isUploading = displayFiles.some((file) => file.status === 'uploading')
    setAllUploaded(!isUploading)
  }, [setAllUploaded, displayFiles])

  useEffect(() => {
    if (caseOrigin !== CaseOrigin.LOKE) {
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
    caseOrigin,
    caseFiles,
  ])

  useEffect(() => {
    setPoliceCaseFileList(
      policeCaseFiles?.files
        .filter(
          (f) =>
            !caseFiles.some((caseFile) => caseFile.policeFileId === f.id) &&
            f.policeCaseNumber === policeCaseNumber,
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) || undefined,
    )

    setDisplayFiles(caseFiles.map(mapCaseFileToUploadFile) || [])
  }, [policeCaseFiles, caseFiles, policeCaseNumber])

  const handleUIUpdate = useCallback(
    (displayFile: UploadFile, newId?: string) => {
      setDisplayFiles((previous) =>
        generateSingleFileUpdate(previous, displayFile, newId),
      )
    },
    [generateSingleFileUpdate],
  )

  const uploadPoliceCaseFileCallback = useCallback(
    (file: UploadFile, id?: string) => {
      setPoliceCaseFileList((previous) =>
        previous?.filter((p) => p.id !== file.id),
      )

      setDisplayFiles((previous) => [
        ...previous,
        { ...file, id: id ?? file.id },
      ])
    },
    [],
  )

  const removeFileCB = useCallback(
    (file: UploadFile) => {
      const policeCaseFile = policeCaseFiles?.files.find(
        (f) => f.name === file.name,
      )

      if (policeCaseFile) {
        setPoliceCaseFileList((previous) => [
          mapPoliceCaseFileToPoliceCaseFileCheck(policeCaseFile),
          ...(previous || []),
        ])
      }

      setDisplayFiles((previous) => {
        return previous.filter((f) => f.id !== file.id)
      })
    },
    [policeCaseFiles?.files],
  )

  const onPoliceCaseFileUpload = async (selectedFiles: Item[]) => {
    const filesToUpload =
      policeCaseFileList &&
      policeCaseFileList
        .filter((p) => selectedFiles.some((f) => f.id === p.id))
        .sort((p1, p2) => (p1.chapter ?? -1) - (p2.chapter ?? -1))

    let currentChapter: number | undefined | null
    let currentOrderWithinChapter: number | undefined | null

    const fileUploadPromises = filesToUpload?.map(async (f) => {
      if (
        f.chapter !== undefined &&
        f.chapter !== null &&
        f.chapter !== currentChapter
      ) {
        currentChapter = f.chapter
        currentOrderWithinChapter = Math.max(
          -1,
          ...caseFiles
            .filter((p) => p.chapter === currentChapter)
            .map((p) => p.orderWithinChapter ?? -1),
        )
      }

      const fileToUpload = {
        id: f.id,
        type: 'application/pdf',
        name: f.name,
        status: 'done',
        state: CaseFileState.STORED_IN_RVG,
        policeCaseNumber: f.policeCaseNumber,
        category: CaseFileCategory.CASE_FILE,
        chapter: f.chapter,
        orderWithinChapter:
          currentOrderWithinChapter !== undefined &&
          currentOrderWithinChapter !== null
            ? ++currentOrderWithinChapter
            : undefined,
        displayDate: f.displayDate,
      } as UploadFile

      return uploadFromPolice(fileToUpload, uploadPoliceCaseFileCallback)
    })

    await Promise.all(fileUploadPromises || [])
  }
  return (
    <>
      <PoliceCaseFiles
        onUpload={onPoliceCaseFileUpload}
        isUploading={isUploading}
        policeCaseFileList={policeCaseFileList}
        policeCaseFiles={policeCaseFiles}
      />
      <InputFileUpload
        name="fileUpload"
        fileList={displayFiles}
        accept="application/pdf"
        header={formatMessage(m.inputFileUpload.header)}
        description={formatMessage(m.inputFileUpload.description)}
        buttonLabel={formatMessage(m.inputFileUpload.buttonLabel)}
        onChange={(files) =>
          handleChange(
            files,
            CaseFileCategory.CASE_FILE,
            setDisplayFiles,
            handleUIUpdate,
            policeCaseNumber,
          )
        }
        onRemove={(file) => handleRemove(file, removeFileCB)}
        onRetry={(file) =>
          handleRetry(
            file,
            handleUIUpdate,
            CaseFileCategory.CASE_FILE,
            policeCaseNumber,
          )
        }
        errorMessage={errorMessage}
        disabled={isUploading}
        showFileSize
      />
    </>
  )
}

type AllUploadedState = {
  [policeCaseNumber: string]: boolean
}

/* We need to make sure this list is not rerenderd unless the props are changing.
 * Since we passing `setAllUploaded` to the children and they are calling it within a useEffect
 * causing a endless rendering loop.
 */
const PoliceUploadListMemo: React.FC<
  React.PropsWithChildren<{
    caseId: string
    policeCaseNumbers: string[]
    subtypes?: IndictmentSubtypeMap
    crimeScenes?: CrimeSceneMap
    caseFiles?: CaseFile[]
    setAllUploaded: (policeCaseNumber: string) => (value: boolean) => void
    caseOrigin: CaseOrigin
  }>
> = memo(
  ({
    caseId,
    policeCaseNumbers,
    subtypes,
    crimeScenes,
    caseFiles,
    setAllUploaded,
    caseOrigin,
  }) => {
    const { formatMessage } = useIntl()
    return (
      <Box paddingBottom={4}>
        {policeCaseNumbers.map((policeCaseNumber, index) => (
          <Box key={index} marginBottom={6}>
            <SectionHeading
              title={formatMessage(m.policeCaseNumberSectionHeading, {
                policeCaseNumber,
              })}
              marginBottom={2}
            />
            <Box marginBottom={3}>
              <IndictmentInfo
                policeCaseNumber={policeCaseNumber}
                subtypes={subtypes}
                crimeScenes={crimeScenes}
              />
            </Box>
            <UploadFilesToPoliceCase
              caseId={caseId}
              caseFiles={
                caseFiles?.filter(
                  (file) => file.policeCaseNumber === policeCaseNumber,
                ) ?? []
              }
              policeCaseNumber={policeCaseNumber}
              setAllUploaded={setAllUploaded(policeCaseNumber)}
              caseOrigin={caseOrigin}
            />
          </Box>
        ))}
      </Box>
    )
  },
)

const PoliceCaseFilesRoute = () => {
  const { formatMessage } = useIntl()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const [allUploaded, setAllUploaded] = useState<AllUploadedState>(
    workingCase.policeCaseNumbers.reduce(
      (acc, policeCaseNumber) => ({ ...acc, [policeCaseNumber]: true }),
      {},
    ),
  )

  useEffect(() => {
    if (!_isEqual(workingCase.policeCaseNumbers, Object.keys(allUploaded))) {
      setAllUploaded(
        workingCase.policeCaseNumbers.reduce(
          (acc, policeCaseNumber) => ({
            ...acc,
            [policeCaseNumber]:
              allUploaded[policeCaseNumber] === undefined
                ? true
                : allUploaded[policeCaseNumber],
          }),
          {},
        ),
      )
    }
  }, [allUploaded, workingCase.policeCaseNumbers])

  const setAllUploadedForPoliceCaseNumber = useCallback(
    (number: string) => (value: boolean) => {
      setAllUploaded((previous) => ({ ...previous, [number]: value }))
    },
    [setAllUploaded],
  )

  const stepIsValid = !Object.values(allUploaded).some((v) => !v)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.policeCaseFiles)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.heading)}</PageTitle>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box marginBottom={5}>
          <InfoBox text={formatMessage(m.infoBox)} />
        </Box>
        <PoliceUploadListMemo
          caseId={workingCase.id}
          caseFiles={workingCase.caseFiles}
          subtypes={workingCase.indictmentSubtypes}
          crimeScenes={workingCase.crimeScenes}
          setAllUploaded={setAllUploadedForPoliceCaseNumber}
          policeCaseNumbers={workingCase.policeCaseNumbers}
          caseOrigin={workingCase.origin}
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_DEFENDANT_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_CASE_FILE_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceCaseFilesRoute
