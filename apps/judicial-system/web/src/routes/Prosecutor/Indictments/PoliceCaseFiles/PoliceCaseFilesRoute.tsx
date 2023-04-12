import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import router from 'next/router'
import { useIntl } from 'react-intl'
import _isEqual from 'lodash/isEqual'
import { useQuery } from '@apollo/client'

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
import {
  titles,
  errors as errorMessages,
} from '@island.is/judicial-system-web/messages'
import { Box, InputFileUpload, UploadFile } from '@island.is/island-ui/core'
import {
  CaseFile,
  CaseFileCategory,
  CaseFileState,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import { mapCaseFileToUploadFile } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  GetPoliceCaseFilesQuery,
  CaseOrigin,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { PoliceCaseFilesQuery } from '@island.is/judicial-system-web/graphql'
import * as constants from '@island.is/judicial-system/consts'

import { PoliceCaseFileCheck, PoliceCaseFiles } from '../../components'
import {
  mapPoliceCaseFileToPoliceCaseFileCheck,
  PoliceCaseFilesData,
} from '../../components/CaseFiles/CaseFiles'
import { policeCaseFiles as m } from './PoliceCaseFilesRoute.strings'

const UploadFilesToPoliceCase: React.FC<{
  caseId: string
  policeCaseNumber: string
  setAllUploaded: (allUploaded: boolean) => void
  caseFiles: CaseFile[]
  caseOrigin: CaseOrigin
}> = ({ caseId, policeCaseNumber, setAllUploaded, caseFiles, caseOrigin }) => {
  const { formatMessage } = useIntl()
  const {
    handleChange,
    handleRemove,
    handleRetry,
    uploadPoliceCaseFile,
    generateSingleFileUpdate,
  } = useS3Upload(caseId)
  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useQuery<GetPoliceCaseFilesQuery>(PoliceCaseFilesQuery, {
    variables: { input: { caseId } },
    fetchPolicy: 'no-cache',
    skip: caseOrigin !== CaseOrigin.Loke,
  })

  const [displayFiles, setDisplayFiles] = useState<UploadFile[]>(
    caseFiles.map(mapCaseFileToUploadFile),
  )

  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])

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
    if (caseOrigin !== CaseOrigin.Loke) {
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
            !caseFiles.some((caseFile) => caseFile.name === f.name) &&
            f.policeCaseNumber === policeCaseNumber,
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) || [],
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
          ...previous,
        ])
      }

      setDisplayFiles((previous) => {
        return previous.filter((f) => f.id !== file.id)
      })
    },
    [policeCaseFiles?.files],
  )

  const onPoliceCaseFileUpload = useCallback(async () => {
    const filesToUpload = policeCaseFileList.filter((p) => p.checked)

    setIsUploading(true)

    filesToUpload.forEach(async (f, index) => {
      const fileToUpload = {
        id: f.id,
        type: 'application/pdf',
        name: f.name,
        status: 'done',
        state: CaseFileState.STORED_IN_RVG,
        policeCaseNumber: f.policeCaseNumber,
        category: CaseFileCategory.CASE_FILE,
      } as UploadFile

      await uploadPoliceCaseFile(fileToUpload, uploadPoliceCaseFileCallback)

      setPoliceCaseFileList((previous) => previous.filter((p) => p.id !== f.id))

      if (index === filesToUpload.length - 1) {
        setIsUploading(false)
      }
    })
  }, [policeCaseFileList, uploadPoliceCaseFile, uploadPoliceCaseFileCallback])

  return (
    <>
      <PoliceCaseFiles
        onUpload={onPoliceCaseFileUpload}
        isUploading={isUploading}
        policeCaseFileList={policeCaseFileList}
        setPoliceCaseFileList={setPoliceCaseFileList}
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
        onRetry={(file) => handleRetry(file, handleUIUpdate)}
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
const PoliceUploadListMemo: React.FC<{
  caseId: string
  policeCaseNumbers: string[]
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
  caseFiles?: CaseFile[]
  setAllUploaded: (policeCaseNumber: string) => (value: boolean) => void
  caseOrigin: CaseOrigin
}> = memo(
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
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

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
          <InfoBox text={formatMessage(m.infoBox)}></InfoBox>
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
