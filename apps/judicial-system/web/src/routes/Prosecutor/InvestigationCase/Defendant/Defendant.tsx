import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, motion } from 'motion/react'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

import { Box, Button } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  core,
  defendant as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  DefenderInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  VictimInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseOrigin,
  Defendant as TDefendant,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useDefendants,
  useVictim,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isBusiness } from '@island.is/judicial-system-web/src/utils/utils'
import { isDefendantStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

import { DefendantInfo } from '../../components'

const Defendant = () => {
  const router = useRouter()
  const { updateDefendant, createDefendant, deleteDefendant } = useDefendants()

  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { createVictimAndSetState, deleteVictimAndSetState } = useVictim()
  const { formatMessage } = useIntl()

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      router.push(`${destination}/${workingCase.id}`)
    },
    [workingCase, router],
  )

  const updateDefendantState = useCallback(
    (update: UpdateDefendantInput) => {
      setWorkingCase((prevWorkingCase: Case) => {
        if (!prevWorkingCase.defendants) {
          return prevWorkingCase
        }

        const indexOfDefendantToUpdate = prevWorkingCase.defendants.findIndex(
          (defendant) => defendant.id === update.defendantId,
        )

        const newDefendants = [...prevWorkingCase.defendants]

        newDefendants[indexOfDefendantToUpdate] = {
          ...newDefendants[indexOfDefendantToUpdate],
          ...update,
        } as TDefendant
        return { ...prevWorkingCase, defendants: newDefendants }
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
    setWorkingCase((prevWorkingCase) => ({
      ...prevWorkingCase,
      defendants:
        prevWorkingCase.defendants &&
        [...prevWorkingCase.defendants].filter((d) => d.id !== defendant.id),
    }))
  }

  const addDefendantButtonId = 'addDefendantButton'

  const handleCreateDefendantClick = async () => {
    if (workingCase.id) {
      const defendantId = await createDefendant({ caseId: workingCase.id })
      createEmptyDefendant(defendantId)
    } else {
      createEmptyDefendant()
    }

    // Scroll to the new defendant
    setTimeout(() => {
      const element = document.getElementById(addDefendantButtonId)

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }, 50)
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

  const stepIsValid = isDefendantStepValidIC(workingCase)

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
          <PageTitle>{formatMessage(m.heading)}</PageTitle>

          <Box component="section" marginBottom={5}>
            <SectionHeading title="Varnaraðili" />
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
                data-testid={addDefendantButtonId}
                id={addDefendantButtonId}
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
          </AnimatePresence>
        </Box>
        {workingCase.id &&
          (workingCase.victims && workingCase.victims?.length === 0 ? (
            <Box
              component="section"
              marginBottom={5}
              display="flex"
              justifyContent="flexEnd"
            >
              <Button
                data-testid="addFirstVictimButton"
                icon="add"
                variant="ghost"
                onClick={() =>
                  createVictimAndSetState(workingCase.id, setWorkingCase)
                }
              >
                Skrá brotaþola
              </Button>
            </Box>
          ) : (
            <Box component="section" marginBottom={5}>
              <SectionHeading title="Brotaþoli" />
              <AnimatePresence>
                {workingCase.victims?.map((victim) => (
                  <motion.div
                    key={victim.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <VictimInfo
                      victim={victim}
                      workingCase={workingCase}
                      setWorkingCase={setWorkingCase}
                      onDelete={() =>
                        deleteVictimAndSetState(
                          workingCase.id,
                          victim,
                          setWorkingCase,
                        )
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              <Box display="flex" justifyContent="flexEnd" marginTop={2}>
                <Button
                  data-testid="addVictimButton"
                  variant="ghost"
                  icon="add"
                  onClick={() =>
                    createVictimAndSetState(workingCase.id, setWorkingCase)
                  }
                >
                  Bæta við brotaþola
                </Button>
              </Box>
            </Box>
          ))}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INVESTIGATION_CASE_REGISTRATION_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
            )
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
          nextButtonText={formatMessage(
            workingCase.id === '' ? core.createCase : core.continue,
          )}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Defendant
