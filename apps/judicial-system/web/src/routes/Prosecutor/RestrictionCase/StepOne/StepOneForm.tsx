import React, { useCallback, useState } from 'react'
import { useIntl } from 'react-intl'

import { Text, Input, Box, Tooltip } from '@island.is/island-ui/core'
import {
  DefenderInfo,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { CaseType, UpdateDefendant } from '@island.is/judicial-system/types'
import { isDefendantStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { accused as m, core } from '@island.is/judicial-system-web/messages'
import useDefendants from '@island.is/judicial-system-web/src/utils/hooks/useDefendants'
import {
  validateAndSendToServer,
  validateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import type { Case } from '@island.is/judicial-system/types'
import * as constants from '@island.is/judicial-system/consts'

import {
  DefendantInfo,
  PoliceCaseNumbers,
  usePoliceCaseNumbers,
} from '../../components'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  loading: boolean
  handleNextButtonClick: (theCase: Case) => void
  updateDefendantState: (defendantId: string, update: UpdateDefendant) => void
}

export const StepOneForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    loading,
    handleNextButtonClick,
    updateDefendantState,
  } = props

  const { formatMessage } = useIntl()

  const [
    leadInvestigatorErrorMessage,
    setLeadInvestigatorErrorMessage,
  ] = useState<string>('')

  const { updateDefendant } = useDefendants()
  const { updateCase } = useCase()

  const handleUpdateDefendant = useCallback(
    async (defendantId: string, updatedDefendant: UpdateDefendant) => {
      updateDefendantState(defendantId, updatedDefendant)

      if (defendantId) {
        updateDefendant(workingCase.id, defendantId, updatedDefendant)
      }
    },
    [workingCase.id, updateDefendantState, updateDefendant],
  )
  const { clientPoliceNumbers, setClientPoliceNumbers } = usePoliceCaseNumbers(
    workingCase,
  )

  return (
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
          nextIsLoading={loading}
          nextIsDisabled={
            !isDefendantStepValidRC(workingCase, clientPoliceNumbers)
          }
          nextButtonText={formatMessage(
            workingCase.id === '' ? core.createCase : core.continue,
          )}
        />
      </FormContentContainer>
    </>
  )
}
