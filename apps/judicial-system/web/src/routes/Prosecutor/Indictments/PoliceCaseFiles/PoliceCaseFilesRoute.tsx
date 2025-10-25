import {
  FC,
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

import {
  Box,
  FileUploadStatus,
  InputFileUpload,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
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
  Item,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFile,
  CaseFileCategory,
  CaseOrigin,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import {
  mapPoliceCaseFileToPoliceCaseFileCheck,
  PoliceCaseFileCheck,
  PoliceCaseFiles,
  PoliceCaseFilesData,
} from '../../components'
import { useIndictmentPoliceCaseFilesQuery } from './indictmentPoliceCaseFiles.generated'
import { strings } from './PoliceCaseFilesRoute.strings'

interface UploadFilesToPoliceCaseProps {
  caseId: string
  policeCaseNumber: string
  setAllUploaded: (allUploaded: boolean) => void
  caseFiles: CaseFile[]
  caseOrigin?: CaseOrigin | null
}

const UploadFilesToPoliceCase: FC<UploadFilesToPoliceCaseProps> = ({
  caseId,
  policeCaseNumber,
  setAllUploaded,
  caseFiles,
  caseOrigin,
}) => {
  const { formatMessage } = useIntl()
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFile,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(caseFiles)
  const { handleUpload, handleUploadFromPolice, handleRetry, handleRemove } =
    useS3Upload(caseId)
  const { onOpenFile } = useFileList({
    caseId,
  })
  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useIndictmentPoliceCaseFilesQuery({
    variables: { input: { caseId } },
    skip: caseOrigin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const [isUploadingPoliceCaseFiles, setIsUploadingPoliceCaseFiles] =
    useState<boolean>(false)
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])

  const errorMessage = useMemo(() => {
    if (uploadFiles.some((file) => file.status === FileUploadStatus.error)) {
      return formatMessage(errorMessages.general)
    }
    if (uploadFiles.some((file) => file.size === 0)) {
      return 'Villa kom upp. Tómt skjal.'
    } else {
      return undefined
    }
  }, [uploadFiles, formatMessage])

  useEffect(() => {
    setAllUploaded(allFilesDoneOrError && !isUploadingPoliceCaseFiles)
  }, [allFilesDoneOrError, isUploadingPoliceCaseFiles, setAllUploaded])

  useEffect(() => {
    if (caseOrigin !== CaseOrigin.LOKE) {
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
        files: [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files:
          policeData?.policeCaseFiles?.filter(
            (file) => file.policeCaseNumber === policeCaseNumber,
          ) ?? [],
        isLoading: false,
        hasError: false,
      })
    }
  }, [
    policeData,
    policeDataError,
    policeDataLoading,
    setPoliceCaseFiles,
    caseOrigin,
    caseFiles,
    policeCaseNumber,
  ])

  useEffect(() => {
    if (policeCaseFiles?.files.length === 0) {
      return
    }

    setPoliceCaseFileList(
      policeCaseFiles?.files
        .filter(
          (file) =>
            !caseFiles.some((caseFile) => caseFile.policeFileId === file.id),
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) ?? [],
    )
  }, [policeCaseFiles?.files, caseFiles, policeCaseNumber])

  const uploadPoliceCaseFileCallback = (file: TUploadFile, id?: string) => {
    if (id) {
      addUploadFile({ ...file, id: id ?? file.id })
    }

    setPoliceCaseFileList((previous) =>
      id
        ? previous.filter((p) => p.id !== file.id)
        : previous.map((p) =>
            p.id === file.id ? { ...p, checked: false } : p,
          ),
    )
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

  const onPoliceCaseFileUpload = async (selectedFiles: Item[]) => {
    let currentChapter: number | undefined | null
    let currentOrderWithinChapter: number | undefined | null

    const getCategory = (file: PoliceCaseFileCheck) => {
      switch (file.type) {
        case 'RVSK':
          return CaseFileCategory.COST_BREAKDOWN
        case 'REIKN':
          return CaseFileCategory.CASE_FILE
        default:
          return CaseFileCategory.CASE_FILE_RECORD
      }
    }

    const filesToUpload = policeCaseFileList
      .filter((p) => selectedFiles.some((f) => f.id === p.id))
      .sort((p1, p2) => (p1.chapter ?? -1) - (p2.chapter ?? -1))
      .map((f) => {
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

        return {
          id: f.id,
          name: f.name,
          type: 'application/pdf',
          category: getCategory(f),
          policeCaseNumber: f.policeCaseNumber,
          chapter: f.chapter ?? undefined,
          orderWithinChapter:
            currentOrderWithinChapter !== undefined &&
            currentOrderWithinChapter !== null
              ? ++currentOrderWithinChapter
              : undefined,
          displayDate: f.displayDate ?? undefined,
          policeFileId: f.id,
          policeType: f.type,
        }
      })

    setIsUploadingPoliceCaseFiles(true)

    await handleUploadFromPolice(filesToUpload, uploadPoliceCaseFileCallback)

    setIsUploadingPoliceCaseFiles(false)
  }

  return (
    <>
      <PoliceCaseFiles
        onUpload={onPoliceCaseFileUpload}
        policeCaseFileList={policeCaseFileList}
        policeCaseFiles={policeCaseFiles}
      />
      <InputFileUpload
        name="fileUpload"
        files={uploadFiles}
        accept="application/pdf"
        title={formatMessage(strings.inputFileUpload.header)}
        description={formatMessage(strings.inputFileUpload.description)}
        buttonLabel={formatMessage(strings.inputFileUpload.buttonLabel)}
        onChange={(files) =>
          handleUpload(
            addUploadFiles(files, {
              category: CaseFileCategory.CASE_FILE_RECORD,
              policeCaseNumber,
            }),
            updateUploadFile,
          )
        }
        onOpenFile={(file) => onOpenFile(file)}
        onRemove={(file) => handleRemove(file, removeFileCB)}
        onRetry={(file) => handleRetry(file, updateUploadFile)}
        errorMessage={errorMessage}
      />
    </>
  )
}

type AllUploadedState = {
  [policeCaseNumber: string]: boolean
}

interface PoliceUploadListMenuProps {
  caseId: string
  policeCaseNumbers?: string[] | null
  subtypes?: IndictmentSubtypeMap
  crimeScenes?: CrimeSceneMap
  caseFiles?: CaseFile[] | null
  setAllUploaded: (policeCaseNumber: string) => (value: boolean) => void
  caseOrigin?: CaseOrigin | null
}

/* We need to make sure this list is not rerenderd unless the props are changing.
 * Since we passing `setAllUploaded` to the children and they are calling it within a useEffect
 * causing a endless rendering loop.
 */
const PoliceUploadListMemo: FC<PoliceUploadListMenuProps> = memo(
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
        {policeCaseNumbers?.map((policeCaseNumber, index) => (
          <Box key={index} marginBottom={6}>
            <SectionHeading
              title={formatMessage(strings.policeCaseNumberSectionHeading, {
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
    workingCase.policeCaseNumbers?.reduce(
      (acc, policeCaseNumber) => ({ ...acc, [policeCaseNumber]: true }),
      {},
    ) ?? {},
  )

  useEffect(() => {
    if (!_isEqual(workingCase.policeCaseNumbers, Object.keys(allUploaded))) {
      setAllUploaded(
        workingCase.policeCaseNumbers?.reduce(
          (acc, policeCaseNumber) => ({
            ...acc,
            [policeCaseNumber]:
              allUploaded[policeCaseNumber] === undefined
                ? true
                : allUploaded[policeCaseNumber],
          }),
          {},
        ) ?? {},
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
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

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
        <PageTitle>{formatMessage(strings.heading)}</PageTitle>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
        <Box marginBottom={5}>
          <InfoBox text={formatMessage(strings.infoBox)} />
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
