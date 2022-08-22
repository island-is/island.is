import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PoliceCaseNumbers from '../SharedComponents/PoliceCaseNumbers/PoliceCaseNumbers'
import {
  IndictmentsProsecutorSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  indictmentsDefendant as m,
  core,
} from '@island.is/judicial-system-web/messages'
import { Box, Select, Text } from '@island.is/island-ui/core'
import { ValueType } from 'react-select'
import {
  Case,
  CaseType,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { capitalize, caseTypes } from '@island.is/judicial-system/formatters'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import { isDefendantStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'
import * as constants from '@island.is/judicial-system/consts'

import DefendantInfo from '../SharedComponents/DefendantInfo/DefendantInfo'

const Defendant: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { createCase, isCreatingCase, setAndSendToServer } = useCase()
  const { createDefendant, updateDefendant } = useDefendants()
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

      if (workingCase.id) {
        updateDefendant(workingCase.id, defendantId, updatedDefendant)
      }
    },
    [updateDefendantState, workingCase.id, updateDefendant],
  )

  const handleNextButtonClick = async (theCase: Case) => {
    if (!theCase.id) {
      const createdCase = await createCase(theCase)

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
        router.push(
          `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${createdCase.id}`,
        )
      } else {
        // TODO handle error
        return
      }
    } else {
      router.push(
        `${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${theCase.id}`,
      )
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={IndictmentsProsecutorSubsections.DEFENDANT}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.defendant)}
      />
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
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.indictmentType.heading)}
            </Text>
          </Box>
          <Select
            name="indictmentType"
            options={constants.IndictmentTypes}
            label={formatMessage(m.sections.indictmentType.label)}
            placeholder={formatMessage(m.sections.indictmentType.placeholder)}
            onChange={(selectedOption: ValueType<ReactSelectOption>) => {
              const type = (selectedOption as ReactSelectOption)
                .value as CaseType

              setAndSendToServer(
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
                    value: CaseType[workingCase.type],
                    label: capitalize(caseTypes[workingCase.type]),
                  }
                : undefined
            }
            required
          />
        </Box>
        {workingCase.defendants && workingCase.defendants.length > 0 && (
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                {capitalize(formatMessage(core.indictmentDefendant))}
              </Text>
            </Box>
            <DefendantInfo
              defendant={workingCase.defendants[0]}
              onChange={handleUpdateDefendant}
              updateDefendantState={updateDefendantState}
            />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={constants.CASES_ROUTE}
          onNextButtonClick={() => handleNextButtonClick(workingCase)}
          nextIsDisabled={!isDefendantStepValidIndictments(workingCase)}
          nextIsLoading={isCreatingCase}
          nextButtonText={
            workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Defendant
