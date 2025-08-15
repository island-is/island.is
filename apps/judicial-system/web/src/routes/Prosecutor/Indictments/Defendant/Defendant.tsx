import { useCallback, useContext, useMemo, useRef } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

import { Box, Button, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  CrimeScene,
  CrimeSceneMap,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseOrigin,
  Defendant as TDefendant,
  IndictmentSubtype,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
  useIndictmentCounts,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { getDefaultDefendantGender } from '@island.is/judicial-system-web/src/utils/utils'
import { isDefendantStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { DefendantInfo, ProsecutorSection } from '../../components'
import { getIndictmentIntroductionAutofill } from '../Indictment/Indictment'
import { getIncidentDescription } from '../Indictment/lib/getIncidentDescription'
import { LokeNumberList } from './LokeNumberList/LokeNumberList'
import { PoliceCaseInfo } from './PoliceCaseInfo/PoliceCaseInfo'
import { usePoliceCaseInfoQuery } from './policeCaseInfo.generated'
import { defendant } from './Defendant.strings'

export interface PoliceCase {
  number: string
  subtypes?: IndictmentSubtype[]
  place?: string
  date?: Date
}

const compareCrimeSceneDates = <T extends string | number>(
  a: T | undefined | null,
  b: T | undefined | null,
) => {
  // We want missing dates to be at the end of the list
  if (a === undefined || a === null) {
    return b === undefined || b === null ? 0 : 1
  }

  if (b === undefined || b === null) {
    return -1
  }

  return a !== b ? (a < b ? -1 : 1) : 0
}

const getPoliceCases = (theCase: Case): PoliceCase[] =>
  theCase.policeCaseNumbers && theCase.policeCaseNumbers.length > 0
    ? theCase.policeCaseNumbers.map((policeCaseNumber) => ({
        number: policeCaseNumber,
        subtypes:
          theCase.indictmentSubtypes &&
          theCase.indictmentSubtypes[policeCaseNumber],
        place:
          theCase.crimeScenes && theCase.crimeScenes[policeCaseNumber]?.place,
        date:
          theCase.crimeScenes &&
          theCase.crimeScenes[policeCaseNumber]?.date &&
          new Date(theCase.crimeScenes[policeCaseNumber].date),
      }))
    : [{ number: '' }]

const Defendant = () => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const { createCase, isCreatingCase, setAndSendCaseToServer } = useCase()
  const {
    createDefendant,
    updateDefendant,
    deleteDefendant,
    updateDefendantState,
  } = useDefendants()
  const { updateIndictmentCount, deleteIndictmentCount } = useIndictmentCounts()

  const policeCaseIds = useRef<{ [key: string]: string }>({})

  const gender = useMemo(
    () => getDefaultDefendantGender(workingCase.defendants),
    [workingCase.defendants],
  )
  const policeCases = useMemo(() => {
    const policeCases = getPoliceCases(workingCase)

    const current = policeCaseIds.current
    policeCaseIds.current = policeCases.reduce((acc, c) => {
      acc[c.number] = current[c.number] ?? uuid()

      return acc
    }, {} as { [key: string]: string })

    return policeCases
  }, [workingCase])

  const { data, loading, error } = usePoliceCaseInfoQuery({
    variables: { input: { caseId: workingCase.id } },
    skip: workingCase.origin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (!data.policeCaseInfo) {
        return
      }

      // Update place and date if not previously set
      data.policeCaseInfo.forEach((policeCaseInfo) => {
        const idx = policeCases.findIndex(
          (pc) => pc.number === policeCaseInfo.policeCaseNumber,
        )

        if (idx < 0) {
          return
        }

        const policeCase = policeCases[idx]

        let place: string | undefined = undefined
        let date: Date | undefined = undefined

        if (!policeCase.place && policeCaseInfo.place) {
          place = policeCaseInfo.place
        }

        if (!policeCase.date && policeCaseInfo.date) {
          date = new Date(policeCaseInfo.date)
        }

        if (place || date) {
          handleUpdatePoliceCase(idx, {
            crimeScene: {
              place: place ?? policeCase.place,
              date: date ?? policeCase.date,
            },
          })
        }
      })
    },
  })

  const policeCaseInfo = useMemo(() => {
    if (!data || !data.policeCaseInfo) {
      return []
    }

    // Sort modifies an array in place, so we create a copy first
    const sorted = [...data.policeCaseInfo].sort((a, b) =>
      compareCrimeSceneDates(a.date, b.date),
    )

    return sorted
  }, [data])

  const getPoliceCasesForUpdate = (
    policeCases: PoliceCase[],
    index?: number,
    update?: {
      policeCaseNumber?: string
      subtypes?: IndictmentSubtype[]
      crimeScene?: CrimeScene
    },
  ): [string[], IndictmentSubtypeMap, CrimeSceneMap] => {
    const policeCaseNumbers: string[] = []
    const indictmentSubtypes: IndictmentSubtypeMap = {}
    const crimeScenes: CrimeSceneMap = {}

    const compare = (a: string, b: string): number =>
      compareCrimeSceneDates(
        crimeScenes[a].date?.getTime(),
        crimeScenes[b].date?.getTime(),
      )

    policeCases.forEach((policeCase, idx) => {
      const isUpdated = idx === index
      const number =
        isUpdated && update?.policeCaseNumber !== undefined
          ? update.policeCaseNumber
          : policeCase.number
      const subtypes =
        isUpdated && update?.subtypes !== undefined
          ? update.subtypes
          : policeCase.subtypes ?? []
      const crimeScene =
        isUpdated && update?.crimeScene !== undefined
          ? update.crimeScene
          : { place: policeCase.place, date: policeCase.date }

      if (number !== policeCase.number) {
        // If the police case number has changed, we need to update the policeCaseIds ref
        policeCaseIds.current[number] = policeCaseIds.current[policeCase.number]
      }

      policeCaseNumbers.push(number)
      indictmentSubtypes[number] = subtypes
      crimeScenes[number] = crimeScene
    })

    const [first, ...rest] = policeCaseNumbers

    const sortedPoliceCaseNumbers =
      workingCase.origin === CaseOrigin.LOKE
        ? // If the case is a LÖKE case, we never change the first police case number
          [first, ...rest.sort(compare)]
        : policeCaseNumbers.sort(compare)

    return [sortedPoliceCaseNumbers, indictmentSubtypes, crimeScenes]
  }

  const handleCreatePoliceCase = () => {
    handleCreatePoliceCases([{ number: '' }])
  }

  const handleCreatePoliceCases = (policeCases: PoliceCase[]) => {
    const [policeCaseNumbers, indictmentSubtypes, crimeScenes] =
      getPoliceCasesForUpdate([...getPoliceCases(workingCase), ...policeCases])

    setAndSendCaseToServer(
      [{ policeCaseNumbers, indictmentSubtypes, crimeScenes, force: true }],
      workingCase,
      setWorkingCase,
    )
  }

  const handleSetPoliceCase = (
    index: number,
    update: {
      policeCaseNumber?: string
      subtypes?: IndictmentSubtype[]
      crimeScene?: CrimeScene
    },
  ) => {
    const [policeCaseNumbers, indictmentSubtypes, crimeScenes] =
      getPoliceCasesForUpdate(getPoliceCases(workingCase), index, update)

    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      policeCaseNumbers,
      indictmentSubtypes,
      crimeScenes,
    }))
  }

  const handleDeletePoliceCase = (index: number) => {
    const policeCases = getPoliceCases(workingCase)

    const [policeCaseNumbers, indictmentSubtypes, crimeScenes] =
      getPoliceCasesForUpdate(
        policeCases.slice(0, index).concat(policeCases.slice(index + 1)),
      )

    setAndSendCaseToServer(
      [
        {
          policeCaseNumbers,
          indictmentSubtypes,
          crimeScenes,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )

    const indictmentCountId = workingCase.indictmentCounts?.[index]?.id

    if (indictmentCountId) {
      deleteIndictmentCount(workingCase.id, indictmentCountId)
    }
  }

  const handleUpdatePoliceCase = (
    index?: number,
    update?: {
      policeCaseNumber?: string
      subtypes?: IndictmentSubtype[]
      crimeScene?: CrimeScene
    },
  ) => {
    const [policeCaseNumbers, indictmentSubtypes, crimeScenes] =
      getPoliceCasesForUpdate(getPoliceCases(workingCase), index, update)

    setAndSendCaseToServer(
      [
        {
          policeCaseNumbers,
          indictmentSubtypes,
          crimeScenes,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }

  const handleUpdateIndictmentCount = (
    policeCaseNumber: string,
    crimeScene: CrimeScene,
    subtypes?: Record<string, IndictmentSubtype[]>,
  ) => {
    if (workingCase.indictmentCounts) {
      workingCase.indictmentCounts
        .filter(
          (indictmentCount) =>
            indictmentCount.policeCaseNumber === policeCaseNumber,
        )
        .forEach((indictmentCount) => {
          const policeCaseNumberSubtypes = subtypes?.[policeCaseNumber] || []
          const indictmentCountSubtypes =
            indictmentCount.indictmentCountSubtypes || []

          // handle changes based on police case subtype changes
          const updatedIndictmentCountSubtypes = indictmentCountSubtypes.filter(
            (subtype) => policeCaseNumberSubtypes.includes(subtype),
          )
          const updatedIndictmentCount = {
            ...indictmentCount,
            indictmentCountSubtypes: updatedIndictmentCountSubtypes,
          }

          const incidentDescription = getIncidentDescription(
            updatedIndictmentCount,
            gender,
            crimeScene,
            formatMessage,
            subtypes,
          )

          updateIndictmentCount(workingCase.id, indictmentCount.id, {
            incidentDescription,
            indictmentCountSubtypes: updatedIndictmentCountSubtypes,
            policeCaseNumberSubtypes,
          })
        })
    }
  }

  const handleUpdateDefendant = useCallback(
    (updatedDefendant: UpdateDefendantInput) => {
      updateDefendantState(updatedDefendant, setWorkingCase)

      if (workingCase.id) {
        updateDefendant(updatedDefendant)

        if (workingCase.indictmentIntroduction) {
          setAndSendCaseToServer(
            [
              {
                indictmentIntroduction: getIndictmentIntroductionAutofill(
                  formatMessage,
                  workingCase.prosecutorsOffice,
                  workingCase.court,
                  workingCase.defendants,
                )?.join(''),
                force: true,
              },
            ],
            workingCase,
            setWorkingCase,
          )
        }
      }
    },
    [
      updateDefendantState,
      setWorkingCase,
      workingCase,
      updateDefendant,
      setAndSendCaseToServer,
      formatMessage,
    ],
  )

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (!workingCase.id) {
        const createdCase = await createCase(workingCase)

        if (createdCase) {
          workingCase.defendants?.forEach(async (defendant, index) => {
            if (
              index === 0 &&
              createdCase.defendants &&
              createdCase.defendants.length > 0
            ) {
              await updateDefendant({
                caseId: createdCase.id,
                defendantId: createdCase.defendants[0].id,
                gender: defendant.gender,
                name: defendant.name,
                address: defendant.address,
                nationalId: defendant.nationalId || null,
                noNationalId: defendant.noNationalId,
                citizenship: defendant.citizenship,
              })
            } else {
              await createDefendant({
                caseId: createdCase.id,
                gender: defendant.gender,
                name: defendant.name,
                address: defendant.address,
                nationalId: defendant.nationalId || null,
                noNationalId: defendant.noNationalId,
                citizenship: defendant.citizenship,
              })
            }
          })
          router.push(`${destination}/${createdCase.id}`)
        } else {
          toast.error(formatMessage(errors.createCase))
        }
      } else {
        router.push(`${destination}/${workingCase.id}`)
      }
    },
    [
      createCase,
      createDefendant,
      formatMessage,
      router,
      updateDefendant,
      workingCase,
    ],
  )

  const handleDeleteDefendant = async (defendant: TDefendant) => {
    if (workingCase.defendants && workingCase.defendants.length > 1) {
      if (workingCase.id) {
        const defendantDeleted = await deleteDefendant(
          workingCase.id,
          defendant.id,
        )

        if (defendantDeleted && workingCase.defendants) {
          removeDefendantFromState(defendant)
        } else {
          toast.error(formatMessage(errors.deleteDefendant))
        }
      } else {
        removeDefendantFromState(defendant)
      }
    }
  }

  const removeDefendantFromState = (defendant: TDefendant) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      defendants:
        prevWorkingCase.defendants &&
        [...prevWorkingCase.defendants].filter((d) => d.id !== defendant.id),
    }))
  }

  const handleCreateDefendantClick = async () => {
    if (workingCase.id) {
      const defendantId = await createDefendant({ caseId: workingCase.id })

      createEmptyDefendant(defendantId)
    } else {
      createEmptyDefendant()
    }

    window.scrollTo(0, document.body.scrollHeight)
  }

  const createEmptyDefendant = (defendantId?: string) => {
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      defendants: prevWorkingCase.defendants && [
        ...prevWorkingCase.defendants,
        { id: defendantId || uuid() },
      ],
    }))
  }

  const stepIsValid = isDefendantStepValidIndictments(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.defendant)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(defendant.heading)}</PageTitle>
        <Box component="section" marginBottom={5}>
          <ProsecutorSection />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(defendant.policeCaseNumbersHeading)}
            description={
              workingCase.origin === CaseOrigin.LOKE &&
              formatMessage(defendant.policeCaseNumbersDescription)
            }
          />
          {workingCase.origin === CaseOrigin.LOKE && (
            <LokeNumberList
              isLoading={loading}
              loadingError={Boolean(error)}
              policeCaseInfo={policeCaseInfo}
              addPoliceCaseNumbers={handleCreatePoliceCases}
            />
          )}
          <AnimatePresence>
            {policeCases.map((policeCase, index) => (
              <motion.div
                key={policeCaseIds.current[policeCase.number]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Box component="section" marginBottom={3}>
                  {workingCase.policeCaseNumbers && (
                    <PoliceCaseInfo
                      index={index}
                      policeCaseNumbers={workingCase.policeCaseNumbers}
                      policeCaseNumberPrefix={
                        workingCase.prosecutorsOffice?.policeCaseNumberPrefix
                      }
                      subtypes={
                        workingCase.indictmentSubtypes &&
                        workingCase.indictmentSubtypes[
                          workingCase.policeCaseNumbers[index]
                        ]
                      }
                      crimeScene={
                        workingCase.crimeScenes &&
                        ((c: { place?: string; date?: string }) => ({
                          place: c.place,
                          date: c.date ? new Date(c.date) : undefined,
                        }))(
                          workingCase.crimeScenes[
                            workingCase.policeCaseNumbers[index]
                          ],
                        )
                      }
                      setPoliceCase={handleSetPoliceCase}
                      deletePoliceCase={
                        workingCase.policeCaseNumbers.length > 1 &&
                        !(workingCase.origin === CaseOrigin.LOKE && index === 0)
                          ? handleDeletePoliceCase
                          : undefined
                      }
                      updatePoliceCase={handleUpdatePoliceCase}
                      policeCaseNumberImmutable={
                        workingCase.origin === CaseOrigin.LOKE && index === 0
                      }
                      updateIndictmentCount={handleUpdateIndictmentCount}
                      indictmentCount={workingCase.indictmentCounts?.find(
                        (indictmentCount) =>
                          indictmentCount.policeCaseNumber ===
                          workingCase.policeCaseNumbers?.[index],
                      )}
                    />
                  )}
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          <Box display="flex" justifyContent="flexEnd" marginTop={3}>
            <Button
              data-testid="addPoliceCaseInfoButton"
              variant="ghost"
              icon="add"
              onClick={handleCreatePoliceCase}
              disabled={policeCases.some(
                (policeCase) =>
                  !policeCase.number ||
                  !policeCase.subtypes ||
                  policeCase.subtypes.length === 0,
              )}
            >
              {formatMessage(defendant.addPoliceCaseButtonText)}
            </Button>
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(defendant.defendantsHeading)} />
          <AnimatePresence>
            {workingCase.defendants?.map((defendant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Box component="section" marginBottom={3}>
                  <DefendantInfo
                    defendant={defendant}
                    workingCase={workingCase}
                    setWorkingCase={setWorkingCase}
                    onDelete={
                      workingCase.defendants &&
                      workingCase.defendants.length > 1 &&
                      !(workingCase.origin === CaseOrigin.LOKE && index === 0)
                        ? handleDeleteDefendant
                        : undefined
                    }
                    onChange={handleUpdateDefendant}
                    updateDefendantState={updateDefendantState}
                    nationalIdImmutable={
                      workingCase.origin === CaseOrigin.LOKE && index === 0
                    }
                  />
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          <Box display="flex" justifyContent="flexEnd" marginTop={3}>
            <Button
              data-testid="addDefendantButton"
              variant="ghost"
              icon="add"
              onClick={handleCreateDefendantClick}
              disabled={workingCase.defendants?.some(
                (defendant) =>
                  !defendant.name ||
                  !defendant.address ||
                  (!defendant.noNationalId && !defendant.nationalId),
              )}
            >
              {formatMessage(defendant.addDefendantButtonText)}
            </Button>
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={getStandardUserDashboardRoute(user)}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_POLICE_CASE_FILES_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isCreatingCase}
          nextButtonText={formatMessage(
            workingCase.id === '' ? core.createCase : core.continue,
          )}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Defendant
