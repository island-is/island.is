import React, { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

import {
  Box,
  Button,
  Input,
  Select,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import {
  core,
  defendant as m,
  errors,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  DefenderInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  CaseOrigin,
  CaseType,
  Defendant as TDefendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import { isBusiness } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { isDefendantStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

import {
  DefendantInfo,
  PoliceCaseNumbers,
  usePoliceCaseNumbers,
} from '../../components'

const Defendant = () => {
  const router = useRouter()
  const { updateDefendant, createDefendant, deleteDefendant } = useDefendants()

  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
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

  const { clientPoliceNumbers, setClientPoliceNumbers } =
    usePoliceCaseNumbers(workingCase)

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
    (update: UpdateDefendantInput) => {
      setWorkingCase((theCase: Case) => {
        if (!theCase.defendants) {
          return theCase
        }

        const indexOfDefendantToUpdate = theCase.defendants.findIndex(
          (defendant) => defendant.id === update.defendantId,
        )

        const newDefendants = [...theCase.defendants]

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          ...update,
        } as TDefendant
        return { ...theCase, defendants: newDefendants }
      })
    },
    [setWorkingCase],
  )

  const handleUpdateDefendant = useCallback(
    async (updatedDefendant: UpdateDefendantInput) => {
      updateDefendantState(updatedDefendant)

      if (workingCase.id) {
        updateDefendant(updatedDefendant)
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

  const stepIsValid = isDefendantStepValidIC(
    workingCase,
    caseType,
    clientPoliceNumbers,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={!!workingCase.parentCase}
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
                  options={constants.InvestigationCaseTypes}
                  label={formatMessage(m.sections.investigationType.type.label)}
                  placeholder={formatMessage(
                    m.sections.investigationType.type.placeholder,
                  )}
                  onChange={(selectedOption) => {
                    const type = selectedOption?.value

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
                          value: workingCase.type,
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
                          workingCase.defendants.length > 1 &&
                          !(
                            workingCase.origin === CaseOrigin.LOKE &&
                            index === 0
                          )
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
              CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
              CaseType.EXPULSION_FROM_HOME,
              CaseType.PAROLE_REVOCATION,
              CaseType.PSYCHIATRIC_EXAMINATION,
              CaseType.RESTRAINING_ORDER,
              CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME,
              CaseType.OTHER,
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
          nextButtonIcon="arrowForward"
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
