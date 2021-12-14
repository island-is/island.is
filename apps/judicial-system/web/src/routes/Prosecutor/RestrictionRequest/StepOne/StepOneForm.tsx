import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import {
  Text,
  Input,
  Box,
  Tooltip,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { CaseState, CaseType } from '@island.is/judicial-system/types'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import { isAccusedStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'
import { accused as m } from '@island.is/judicial-system-web/messages'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'
import DefendantInfo from '../../SharedComponents/DefendantInfo/DefendantInfo'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  loading: boolean
  handleNextButtonClick: (theCase: Case) => void
}

export const StepOneForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, loading, handleNextButtonClick } = props

  const { formatMessage } = useIntl()

  const [
    leadInvestigatorErrorMessage,
    setLeadInvestigatorErrorMessage,
  ] = useState<string>('')

  const validations: FormSettings = {
    policeCaseNumber: {
      validations: ['empty', 'police-casenumber-format'],
    },
    accusedGender: {
      validations: ['empty'],
    },
    accusedNationalId: {
      validations: ['empty', 'national-id'],
    },
    accusedName: {
      validations: ['empty'],
    },
    accusedAddress: {
      validations: ['empty'],
    },
    defenderEmail: {
      validations: ['email-format'],
    },
    defenderPhoneNumber: {
      validations: ['phonenumber'],
    },
    sendRequestToDefender: {},
    leadInvestigator: {
      validations: workingCase.type === CaseType.CUSTODY ? ['empty'] : [],
      errorMessage: leadInvestigatorErrorMessage,
      setErrorMessage: setLeadInvestigatorErrorMessage,
    },
  }

  const {
    setField,
    validateAndSendToServer,
    setAndSendToServer,
  } = useCaseFormHelper(workingCase, setWorkingCase, validations)

  return (
    <>
      <FormContentContainer>
        {workingCase.state === CaseState.RECEIVED && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(m.receivedAlert.title)}
              message={formatMessage(m.receivedAlert.message)}
              type="warning"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <LokeCaseNumber
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.accusedInfo.heading)}
            </Text>
          </Box>
          <DefendantInfo
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
        <Box component="section" marginBottom={7}>
          <DefenderInfo
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            setAndSendToServer={setAndSendToServer}
          />
        </Box>
        {workingCase.type === CaseType.CUSTODY && (
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
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
                required
              />
            </Box>
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={Constants.REQUEST_LIST_ROUTE}
          onNextButtonClick={async () =>
            await handleNextButtonClick(workingCase)
          }
          nextIsLoading={loading}
          nextIsDisabled={!isAccusedStepValidRC(workingCase)}
          nextButtonText={
            workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
          }
        />
      </FormContentContainer>
    </>
  )
}
