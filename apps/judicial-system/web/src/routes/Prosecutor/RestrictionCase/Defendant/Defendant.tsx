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
import { isDefendantStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import {
  validateAndSendToServer,
  validateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  Case,
  CaseType,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import {
  DefendantInfo,
  PoliceCaseNumbers,
  usePoliceCaseNumbers,
} from '../../components'

export const StepOne: React.FC = () => {
  const router = useRouter()
  const [
    leadInvestigatorErrorMessage,
    setLeadInvestigatorErrorMessage,
  ] = useState<string>('')

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { createCase, isCreatingCase, updateCase } = useCase()
  const { updateDefendant } = useDefendants()
  const { loading: institutionLoading } = useInstitution()
  const { formatMessage } = useIntl()
  const { clientPoliceNumbers, setClientPoliceNumbers } = usePoliceCaseNumbers(
    workingCase,
  )

  const handleNextButtonClick = async (theCase: Case) => {
    if (!theCase.id) {
      const createdCase = await createCase(theCase)

      if (
        createdCase &&
        createdCase.defendants &&
        createdCase.defendants.length > 0 &&
        theCase.defendants &&
        theCase.defendants.length > 0
      ) {
        await updateDefendant(createdCase.id, createdCase.defendants[0].id, {
          gender: theCase.defendants[0].gender,
          name: theCase.defendants[0].name,
          address: theCase.defendants[0].address,
          nationalId: theCase.defendants[0].nationalId,
          noNationalId: theCase.defendants[0].noNationalId,
          citizenship: theCase.defendants[0].citizenship,
        })

        router.push(
          `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${createdCase.id}`,
        )
      }
    } else {
      router.push(
        `${constants.RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${theCase.id}`,
      )
    }
  }

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

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
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
              onNextButtonClick={() => handleNextButtonClick(workingCase)}
              nextIsLoading={isCreatingCase}
              nextIsDisabled={
                !isDefendantStepValidRC(workingCase, clientPoliceNumbers)
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
