import React, { useCallback, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'
import { AnimatePresence, motion } from 'framer-motion'
import { uuid } from 'uuidv4'

import {
  BlueBox,
  DefenderInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import {
  RestrictionCaseProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  core,
  defendant as m,
  errors,
} from '@island.is/judicial-system-web/messages'
import {
  Defendant as TDefendant,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  Box,
  Button,
  Input,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { isDefendantStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import { theme } from '@island.is/island-ui/theme'
import { isBusiness } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import {
  DefendantInfo,
  PoliceCaseNumbers,
  usePoliceCaseNumbers,
} from '../../components'

const Defendant = () => {
  const router = useRouter()
  const { updateDefendant, createDefendant, deleteDefendant } = useDefendants()

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { createCase, isCreatingCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()
  // This state is needed because type is initially set to OHTER on the
  // workingCase and we need to validate that the user selects an option
  // from the case type list to allow the user to continue.
  const [caseType, setCaseType] = React.useState<CaseType>()

  useEffect(() => {
    if (workingCase.id) {
      setCaseType(workingCase.type)
    }
  }, [workingCase.id, workingCase.type])

  const { clientPoliceNumbers, setClientPoliceNumbers } = usePoliceCaseNumbers(
    workingCase,
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
              await updateDefendant(
                createdCase.id,
                createdCase.defendants[0].id,
                {
                  gender: defendant.gender,
                  name: defendant.name,
                  address: defendant.address,
                  nationalId: defendant.nationalId,
                  noNationalId: defendant.noNationalId,
                  citizenship: defendant.citizenship,
                },
              )
            } else {
              await createDefendant(createdCase.id, {
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
        }
      } else {
        router.push(`${destination}/${workingCase.id}`)
      }
    },
    [
      workingCase,
      createCase,
      router,
      updateDefendant,
      createDefendant,
      formatMessage,
    ],
  )

  const updateDefendantState = useCallback(
    (defendantId: string, update: UpdateDefendant) => {
      setWorkingCase((theCase: Case) => {
        if (!theCase.defendants) {
          return theCase
        }

        const indexOfDefendantToUpdate = theCase.defendants.findIndex(
          (defendant) => defendant.id === defendantId,
        )

        const newDefendants = [...theCase.defendants]

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          ...update,
        }
        return { ...theCase, defendants: newDefendants }
      })
    },
    [setWorkingCase],
  )

  const handleUpdateDefendant = useCallback(
    async (defendantId: string, updatedDefendant: UpdateDefendant) => {
      updateDefendantState(defendantId, updatedDefendant)

      if (workingCase.id) {
        updateDefendant(workingCase.id, defendantId, updatedDefendant)
      }
    },
    [updateDefendantState, workingCase.id, updateDefendant],
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
          // TODO: handle error
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
      const defendantId = await createDefendant(workingCase.id, {
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

  const stepIsValid = isDefendantStepValidIC(
    workingCase,
    caseType,
    clientPoliceNumbers,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.DEFENDANT}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.defendant)}
      />

      <FormContentContainer>
        <Box marginBottom={10}>
          <Box marginBottom={7}>
            <Text as="h1" variant="h1">
              {formatMessage(m.heading)}
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <PoliceCaseNumbers
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              clientPoliceNumbers={clientPoliceNumbers}
              setClientPoliceNumbers={setClientPoliceNumbers}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.investigationType.heading)}
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={3}>
                <Select
                  name="type"
                  options={
                    constants.InvestigationCaseTypes as ReactSelectOption[]
                  }
                  label={formatMessage(m.sections.investigationType.type.label)}
                  placeholder={formatMessage(
                    m.sections.investigationType.type.placeholder,
                  )}
                  onChange={(selectedOption: ValueType<ReactSelectOption>) => {
                    const type = (selectedOption as ReactSelectOption)
                      .value as CaseType

                    setCaseType(type)
                    setAndSendCaseToServer(
                      [
                        {
                          type,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  value={
                    workingCase.id
                      ? {
                          value: Object.keys(CaseType).indexOf(
                            workingCase.type,
                          ),
                          label: capitalize(caseTypes[workingCase.type]),
                        }
                      : undefined
                  }
                  formatGroupLabel={() => (
                    <div
                      style={{
                        width: 'calc(100% + 24px)',
                        height: '3px',
                        marginLeft: '-12px',
                        backgroundColor: theme.color.dark300,
                      }}
                    />
                  )}
                  required
                />
              </Box>
              <Input
                data-testid="description"
                name="description"
                label={formatMessage(
                  m.sections.investigationType.description.label,
                )}
                placeholder={formatMessage(
                  m.sections.investigationType.description.placeholder,
                )}
                value={workingCase.description || ''}
                autoComplete="off"
                onChange={(evt) => {
                  setWorkingCase({
                    ...workingCase,
                    description: evt.target.value,
                  })
                }}
                onBlur={(evt) =>
                  setAndSendCaseToServer(
                    [
                      {
                        description: evt.target.value.trim(),
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {formatMessage(m.sections.defendantInfo.heading)}
              </Text>
            </Box>
            <AnimatePresence>
              {workingCase.defendants &&
                workingCase.defendants.map((defendant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <Box
                      marginBottom={
                        index - 1 === workingCase.defendants?.length ? 0 : 3
                      }
                    >
                      <DefendantInfo
                        defendant={defendant}
                        workingCase={workingCase}
                        setWorkingCase={setWorkingCase}
                        onDelete={
                          workingCase.defendants &&
                          workingCase.defendants.length > 1
                            ? handleDeleteDefendant
                            : undefined
                        }
                        onChange={handleUpdateDefendant}
                        updateDefendantState={updateDefendantState}
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
                    (!isBusiness(defendant.nationalId) && !defendant.gender) ||
                    !defendant.name ||
                    !defendant.address ||
                    (!defendant.noNationalId && !defendant.nationalId),
                )}
              >
                {formatMessage(m.sections.defendantInfo.addDefendantButtonText)}
              </Button>
            </Box>
          </Box>
          <AnimatePresence>
            {[
              CaseType.ElectronicDataDiscoveryInvestigation,
              CaseType.ExpulsionFromHome,
              CaseType.PsychiatricExamination,
              CaseType.RestrainingOrder,
              CaseType.RestrainingOrderAndExpulsionFromHome,
              CaseType.Other,
            ].includes(workingCase.type) && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <DefenderInfo
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                />
              </motion.section>
            )}
          </AnimatePresence>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.CASES_ROUTE}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
            )
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
