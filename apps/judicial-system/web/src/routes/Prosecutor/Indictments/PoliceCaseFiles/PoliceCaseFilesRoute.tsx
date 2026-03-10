import { FC, memo, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import _isEqual from 'lodash/isEqual'
import router from 'next/router'

import { Box } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
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
  CaseFile,
  CaseOrigin,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'

import { PoliceCaseFilesData } from '../../components'
import {
  PoliceDigitalCaseFilesData,
  PoliceDigitalCaseFilesList,
} from '../../components/PoliceCaseFiles/PoliceDigitalCaseFiles'
import { useIndictmentPoliceCaseFilesQuery } from './indictmentPoliceCaseFiles.generated'
import { usePoliceDigitalCaseFilesQuery } from './policeDigitalCaseFiles.generated'
import UploadFilesToPoliceCase from './UploadFilesToPoliceCase'
import { strings } from './PoliceCaseFilesRoute.strings'

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

    const {
      data: digitalCaseFiles,
      loading: digitalCaseFilesLoading,
      error: digitalCaseFilesError,
    } = usePoliceDigitalCaseFilesQuery({
      variables: { input: { caseId } },
      skip: caseOrigin !== CaseOrigin.LOKE,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })

    const [policeCaseFilesData, setPoliceCaseFiles] =
      useState<PoliceCaseFilesData>()

    const [policeDigitalCaseFileData, setPoliceDigitalCaseFileData] =
      useState<PoliceDigitalCaseFilesData>()

    useEffect(() => {
      // get case files
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
          files: policeData?.policeCaseFiles ?? [],
          isLoading: false,
          hasError: false,
        })
      }

      // get digital case files
      if (caseOrigin !== CaseOrigin.LOKE) {
        setPoliceDigitalCaseFileData({
          files: [],
          isLoading: false,
          hasError: false,
        })
      } else if (digitalCaseFilesError) {
        setPoliceDigitalCaseFileData({
          files: [],
          isLoading: false,
          hasError: true,
        })
      } else if (digitalCaseFilesLoading) {
        setPoliceDigitalCaseFileData({
          files: [],
          isLoading: true,
          hasError: false,
        })
      } else {
        setPoliceDigitalCaseFileData({
          files: digitalCaseFiles?.policeDigitalCaseFiles ?? [],
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
      digitalCaseFilesError,
      digitalCaseFilesLoading,
      digitalCaseFiles?.policeDigitalCaseFiles,
    ])

    return (
      <Box className={grid({ gap: 4 })}>
        {policeCaseNumbers?.map((policeCaseNumber, index) => {
          const currentDigitalCaseFiles =
            policeDigitalCaseFileData?.files?.filter(
              (file) => file.policeCaseNumber === policeCaseNumber,
            ) ?? []
          const showDigitalCaseFiles =
            currentDigitalCaseFiles.length > 0 ||
            policeDigitalCaseFileData?.hasError
          return (
            <Box key={index}>
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
                policeCaseFilesData={{
                  files:
                    policeCaseFilesData?.files?.filter(
                      (file) => file.policeCaseNumber === policeCaseNumber,
                    ) ?? [],
                  isLoading: !!policeCaseFilesData?.isLoading,
                  hasError: !!policeCaseFilesData?.hasError,
                  errorCode: policeCaseFilesData?.errorCode,
                }}
                policeCaseNumber={policeCaseNumber}
                setAllUploaded={setAllUploaded(policeCaseNumber)}
              />
              {showDigitalCaseFiles && (
                <PoliceDigitalCaseFilesList
                  digitalCaseFiles={
                    digitalCaseFiles?.policeDigitalCaseFiles?.filter(
                      (file) => file.policeCaseNumber === policeCaseNumber,
                    ) ?? []
                  }
                  isLoading={!!policeDigitalCaseFileData?.isLoading}
                  errorMessage={
                    policeDigitalCaseFileData?.hasError
                      ? 'Ekki tókst að sækja rafræn skjöl í LÖKE.'
                      : undefined
                  }
                />
              )}
            </Box>
          )
        })}
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
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <ProsecutorCaseInfo workingCase={workingCase} />
          <InfoBox text={formatMessage(strings.infoBox)} />
          <PoliceUploadListMemo
            caseId={workingCase.id}
            caseFiles={workingCase.caseFiles}
            subtypes={workingCase.indictmentSubtypes}
            crimeScenes={workingCase.crimeScenes}
            setAllUploaded={setAllUploadedForPoliceCaseNumber}
            policeCaseNumbers={workingCase.policeCaseNumbers}
            caseOrigin={workingCase.origin}
          />
        </div>
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
