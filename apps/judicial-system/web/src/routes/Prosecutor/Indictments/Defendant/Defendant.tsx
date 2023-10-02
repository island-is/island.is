import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

import { Box, Button, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  CrimeScene,
  CrimeSceneMap,
  IndictmentSubtype,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  CaseOrigin,
  Defendant as TDefendant,
  PoliceCaseInfo as TPoliceCaseInfo,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import { isDefendantStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { DefendantInfo } from '../../components'
import { LokeNumberList } from './LokeNumberList/LokeNumberList'
import { PoliceCaseInfo } from './PoliceCaseInfo/PoliceCaseInfo'
import { useGetPoliceCaseInfoQuery } from './getPoliceCaseInfo.generated'
import { defendant } from './Defendant.strings'

export interface PoliceCase {
  number: string
  subtypes?: IndictmentSubtype[]
  place?: string
  date?: Date
}

const getPoliceCases: (theCase: Case) => PoliceCase[] = (theCase: Case) =>
  theCase.policeCaseNumbers.length > 0
    ? theCase.policeCaseNumbers.map((policeCaseNumber) => ({
        number: policeCaseNumber,
        subtypes:
          theCase.indictmentSubtypes &&
          theCase.indictmentSubtypes[policeCaseNumber],
        place:
          theCase.crimeScenes && theCase.crimeScenes[policeCaseNumber]?.place,
        date:
          theCase.crimeScenes && theCase.crimeScenes[policeCaseNumber]?.date,
      }))
    : [{ number: '' }]

const getPoliceCasesForUpdate = (
  policeCases: PoliceCase[],
  index?: number,
  update?: {
    policeCaseNumber?: string
    subtypes?: IndictmentSubtype[]
    crimeScene?: CrimeScene
  },
) =>
  policeCases.reduce<[string[], IndictmentSubtypeMap, CrimeSceneMap]>(
    (
      [prevPoliceCaseNumbers, prevIndictmentSubtypes, prevCrimeScenes],
      policeCase,
      idx,
    ) => {
      const policeCaseNumber =
        idx === index && update?.policeCaseNumber !== undefined
          ? update.policeCaseNumber
          : policeCase.number
      const subtypes =
        idx === index && update?.subtypes !== undefined
          ? update.subtypes
          : policeCase.subtypes
      const crimeScene =
        idx === index && update?.crimeScene !== undefined
          ? update.crimeScene
          : { place: policeCase.place, date: policeCase.date }
      return [
        [...prevPoliceCaseNumbers, policeCaseNumber],
        { ...prevIndictmentSubtypes, [policeCaseNumber]: subtypes ?? [] },
        { ...prevCrimeScenes, [policeCaseNumber]: crimeScene },
      ]
    },
    [[], {}, {}],
  )

const Defendant: React.FC<React.PropsWithChildren<unknown>> = () => {
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
  const router = useRouter()

  const [policeCases, setPoliceCases] = useState<PoliceCase[]>([])

  useEffect(() => {
    setPoliceCases(getPoliceCases(workingCase))
  }, [workingCase])

  const { data, loading, error } = useGetPoliceCaseInfoQuery({
    variables: {
      input: {
        caseId: workingCase.id,
      },
    },
    skip: !workingCase.id,
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (!data.policeCaseInfo) {
        return
      }

      if (
        policeCases.length > 0 &&
        (policeCases[0].place === undefined || policeCases[0].place === null) &&
        (policeCases[0].date === undefined || policeCases[0].date === null) &&
        (data.policeCaseInfo[0].place || data.policeCaseInfo[0].date)
      ) {
        handleUpdatePoliceCase(0, {
          crimeScene: {
            place: data.policeCaseInfo[0].place ?? '',
            date: data.policeCaseInfo[0].date
              ? new Date(data.policeCaseInfo[0].date)
              : undefined,
          },
        })
      }
    },
  })

  const handleCreatePoliceCase = async (policeCaseInfo?: PoliceCase) => {
    const newPoliceCase = policeCaseInfo ?? { number: '' }

    const [policeCaseNumbers, indictmentSubtypes, crimeScenes] =
      getPoliceCasesForUpdate([...getPoliceCases(workingCase), newPoliceCase])

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

  const handleCreatePoliceCases = (policeCases: PoliceCase[]) => {
    const cases = getPoliceCases(workingCase)
    const allCases = [...cases, ...policeCases]

    setAndSendCaseToServer(
      [
        {
          policeCaseNumbers: [
            ...allCases.map((policeCase) => policeCase.number),
          ],
          indictmentSubtypes: allCases.reduce<IndictmentSubtypeMap>(
            (acc, policeCase) => ({
              ...acc,
              [policeCase.number]: policeCase.subtypes ?? [],
            }),
            {},
          ),
          crimeScenes: allCases.reduce<CrimeSceneMap>(
            (acc, policeCase) => ({
              ...acc,
              [policeCase.number]: {
                place: policeCase.place,
                date: policeCase.date,
              },
            }),
            {},
          ),
          force: true,
        },
      ],
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

    setWorkingCase((theCase) => ({
      ...theCase,
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

  const handleUpdateDefendant = useCallback(
    (updatedDefendant: UpdateDefendantInput) => {
      updateDefendantState(updatedDefendant, setWorkingCase)

      if (workingCase.id) {
        updateDefendant(updatedDefendant)
      }
    },
    [updateDefendantState, setWorkingCase, workingCase.id, updateDefendant],
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
                nationalId: defendant.nationalId,
                noNationalId: defendant.noNationalId,
                citizenship: defendant.citizenship,
              })
            } else {
              await createDefendant({
                caseId: createdCase.id,
                gender: defendant.gender,
                name: defendant.name,
                address: defendant.address,
                nationalId: defendant.nationalId,
                noNationalId: defendant.noNationalId,
                citizenship: defendant.citizenship,
              })
            }
          })
          router.push(`${destination}/${createdCase.id}`)
        } else {
          toast.error(formatMessage(errors.createCase))
          return
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
    if (workingCase.defendants && workingCase.defendants?.length > 1) {
      setWorkingCase({
        ...workingCase,
        defendants: [...workingCase.defendants].filter(
          (d) => d.id !== defendant.id,
        ),
      })
    }
  }

  const handleCreateDefendantClick = async () => {
    if (workingCase.id) {
      const defendantId = await createDefendant({
        caseId: workingCase.id,
        gender: undefined,
        name: '',
        address: '',
        nationalId: '',
        citizenship: '',
      })

      createEmptyDefendant(defendantId)
    } else {
      createEmptyDefendant()
    }

    window.scrollTo(0, document.body.scrollHeight)
  }

  const createEmptyDefendant = (defendantId?: string) => {
    if (workingCase.defendants) {
      setWorkingCase({
        ...workingCase,
        defendants: [
          ...workingCase.defendants,
          {
            id: defendantId || uuid(),
            gender: undefined,
            name: '',
            nationalId: '',
            address: '',
            citizenship: '',
          } as TDefendant,
        ],
      })
    }
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
              policeCaseInfo={data?.policeCaseInfo as TPoliceCaseInfo[]}
              addPoliceCaseNumbers={handleCreatePoliceCases}
            />
          )}
          <AnimatePresence>
            {policeCases.map((_policeCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <Box component="section" marginBottom={3}>
                  <PoliceCaseInfo
                    index={index}
                    policeCaseNumbers={workingCase.policeCaseNumbers}
                    subtypes={
                      workingCase.indictmentSubtypes &&
                      workingCase.indictmentSubtypes[
                        workingCase.policeCaseNumbers[index]
                      ]
                    }
                    crimeScene={
                      workingCase.crimeScenes &&
                      workingCase.crimeScenes[
                        workingCase.policeCaseNumbers[index]
                      ]
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
                  />
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
          <Box display="flex" justifyContent="flexEnd" marginTop={3}>
            <Button
              data-testid="addPoliceCaseInfoButton"
              variant="ghost"
              icon="add"
              onClick={() => {
                handleCreatePoliceCase()
              }}
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
          previousUrl={constants.CASES_ROUTE}
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
