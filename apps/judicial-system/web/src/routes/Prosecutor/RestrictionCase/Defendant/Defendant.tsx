import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  DefenderInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  accused as m,
  core,
  titles,
} from '@island.is/judicial-system-web/messages'
import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  validateAndSendToServer,
  validateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { CaseType, UpdateDefendant } from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import * as constants from '@island.is/judicial-system/consts'

import {
  DefendantInfo,
  PoliceCaseNumbers,
  usePoliceCaseNumbers,
} from '../../components'
import { isDefendantStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'

export const StepOne: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [
    leadInvestigatorErrorMessage,
    setLeadInvestigatorErrorMessage,
  ] = useState<string>('')
  const { createCase, isCreatingCase, updateCase } = useCase()
  const { updateDefendant } = useDefendants()
  const { loading: institutionLoading } = useInstitution()
  const { formatMessage } = useIntl()
  const { clientPoliceNumbers, setClientPoliceNumbers } = usePoliceCaseNumbers(
    workingCase,
  )
  const router = useRouter()

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

      if (defendantId) {
        updateDefendant(workingCase.id, defendantId, updatedDefendant)
      }
    },
    [workingCase.id, updateDefendantState, updateDefendant],
  )

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (!workingCase.id) {
        const createdCase = await createCase(workingCase)

        if (
          createdCase &&
          createdCase.defendants &&
          createdCase.defendants.length > 0 &&
          workingCase.defendants &&
          workingCase.defendants.length > 0
        ) {
          await updateDefendant(createdCase.id, createdCase.defendants[0].id, {
            gender: workingCase.defendants[0].gender,
            name: workingCase.defendants[0].name,
            address: workingCase.defendants[0].address,
            nationalId: workingCase.defendants[0].nationalId,
            noNationalId: workingCase.defendants[0].noNationalId,
            citizenship: workingCase.defendants[0].citizenship,
          })

          router.push(`${destination}/${createdCase.id}`)
        }
      } else {
        router.push(`${destination}/${workingCase.id}`)
      }
    },
    [createCase, router, updateDefendant, workingCase],
  )

  const stepIsValid = isDefendantStepValidRC(workingCase, clientPoliceNumbers)

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
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.defendant)}
      />
      {!institutionLoading && (
        <>
          <FormContentContainer>
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
            {workingCase.defendants && (
              <Box component="section" marginBottom={5}>
                <Box marginBottom={2}>
                  <Text as="h3" variant="h3">
                    {formatMessage(m.sections.accusedInfo.heading)}
                  </Text>
                </Box>
                <DefendantInfo
                  defendant={workingCase.defendants[0]}
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  onChange={handleUpdateDefendant}
                  updateDefendantState={updateDefendantState}
                />
              </Box>
            )}
            <Box component="section" marginBottom={7}>
              <DefenderInfo
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
              />
            </Box>
            {workingCase.type !== CaseType.TRAVEL_BAN && (
              <Box component="section" marginBottom={10}>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="baseline"
                  marginBottom={2}
                >
                  <Text as="h3" variant="h3">
                    {formatMessage(m.sections.leadInvestigator.heading)}{' '}
                    <Tooltip
                      text={formatMessage(m.sections.leadInvestigator.tooltip)}
                    />
                  </Text>
                </Box>
                <Box marginBottom={2}>
                  <Input
                    data-testid="leadInvestigator"
                    name="leadInvestigator"
                    autoComplete="off"
                    label={formatMessage(m.sections.leadInvestigator.label)}
                    placeholder={formatMessage(
                      m.sections.leadInvestigator.placeholder,
                    )}
                    value={workingCase.leadInvestigator || ''}
                    errorMessage={leadInvestigatorErrorMessage}
                    hasError={leadInvestigatorErrorMessage !== ''}
                    onChange={(evt) => {
                      validateAndSet(
                        'leadInvestigator',
                        evt.target.value,
                        ['empty'],
                        workingCase,
                        setWorkingCase,
                        leadInvestigatorErrorMessage,
                        setLeadInvestigatorErrorMessage,
                      )
                    }}
                    onBlur={(evt) =>
                      validateAndSendToServer(
                        'leadInvestigator',
                        evt.target.value,
                        ['empty'],
                        workingCase,
                        updateCase,
                        setLeadInvestigatorErrorMessage,
                      )
                    }
                    required
                  />
                </Box>
              </Box>
            )}
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={constants.CASES_ROUTE}
              nextIsLoading={isCreatingCase}
              nextIsDisabled={!stepIsValid}
              onNextButtonClick={() =>
                handleNavigationTo(
                  constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
                )
              }
              nextButtonText={formatMessage(
                workingCase.id === '' ? core.createCase : core.continue,
              )}
            />
          </FormContentContainer>
        </>
      )}
    </PageLayout>
  )
}

export default StepOne
