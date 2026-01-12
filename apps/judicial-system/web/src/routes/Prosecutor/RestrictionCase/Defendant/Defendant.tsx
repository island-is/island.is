import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { getStandardUserDashboardRoute } from '@island.is/judicial-system/consts'
import {
  accused as m,
  core,
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
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseOrigin,
  CaseType,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDebouncedInput,
  useDefendants,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { isDefendantStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'

import {
  DefendantInfo,
  PoliceCaseNumbers,
  usePoliceCaseNumbers,
} from '../../components'

export const Defendant = () => {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { createCase, isCreatingCase } = useCase()
  const { updateDefendant } = useDefendants()
  const { loading: institutionLoading } = useInstitution()
  const { clientPoliceNumbers, setClientPoliceNumbers } =
    usePoliceCaseNumbers(workingCase)
  const leadInvestigator = useDebouncedInput('leadInvestigator', ['empty'])

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
        }

        return { ...prevWorkingCase, defendants: newDefendants }
      })
    },
    [setWorkingCase],
  )

  const handleUpdateDefendant = useCallback(
    async (updatedDefendant: UpdateDefendantInput) => {
      updateDefendantState(updatedDefendant)

      if (updatedDefendant.defendantId) {
        updateDefendant(updatedDefendant)
      }
    },
    [updateDefendantState, updateDefendant],
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
          await updateDefendant({
            caseId: createdCase.id,
            defendantId: createdCase.defendants[0].id,
            gender: workingCase.defendants[0].gender,
            name: workingCase.defendants[0].name,
            address: workingCase.defendants[0].address,
            nationalId: workingCase.defendants[0].nationalId || null,
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
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={!!workingCase.parentCase}
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.defendant)}
      />
      {!institutionLoading && (
        <>
          <FormContentContainer>
            <PageTitle>{formatMessage(m.heading)}</PageTitle>
            <div className={grid({ gap: 5, marginBottom: 10 })}>
              <Box component="section">
                <PoliceCaseNumbers
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  clientPoliceNumbers={clientPoliceNumbers}
                  setClientPoliceNumbers={setClientPoliceNumbers}
                />
              </Box>
              {workingCase.defendants && (
                <Box component="section">
                  <SectionHeading
                    title={formatMessage(m.sections.accusedInfo.heading)}
                  />
                  <DefendantInfo
                    defendant={workingCase.defendants[0]}
                    workingCase={workingCase}
                    setWorkingCase={setWorkingCase}
                    onChange={handleUpdateDefendant}
                    updateDefendantState={updateDefendantState}
                    nationalIdImmutable={workingCase.origin === CaseOrigin.LOKE}
                  />
                </Box>
              )}
              <Box component="section">
                <DefenderInfo
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                />
              </Box>
              {workingCase.type !== CaseType.TRAVEL_BAN && (
                <Box component="section">
                  <SectionHeading
                    title={formatMessage(m.sections.leadInvestigator.heading)}
                    tooltip={formatMessage(m.sections.leadInvestigator.tooltip)}
                  />
                  <Input
                    data-testid="leadInvestigator"
                    name="leadInvestigator"
                    autoComplete="off"
                    label={formatMessage(m.sections.leadInvestigator.label)}
                    placeholder={formatMessage(
                      m.sections.leadInvestigator.placeholder,
                    )}
                    value={leadInvestigator.value}
                    errorMessage={leadInvestigator.errorMessage}
                    hasError={leadInvestigator.hasError}
                    onChange={(evt) =>
                      leadInvestigator.onChange(evt.target.value)
                    }
                    onBlur={(evt) => leadInvestigator.onBlur(evt.target.value)}
                    required
                  />
                </Box>
              )}
            </div>
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              nextButtonIcon="arrowForward"
              previousUrl={getStandardUserDashboardRoute(user)}
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

export default Defendant
