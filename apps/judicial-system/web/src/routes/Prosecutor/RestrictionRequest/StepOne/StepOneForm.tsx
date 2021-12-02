import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'
import { ValueType } from 'react-select/src/types'

import {
  Text,
  Input,
  Box,
  Checkbox,
  Tooltip,
  AlertMessage,
  Select,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/components'
import { CaseState, CaseType } from '@island.is/judicial-system/types'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import { isAccusedStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import lawyers from '@island.is/judicial-system-web/src/utils/lawyerScraper/db.json'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
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
  const { updateCase } = useCase()

  const [
    defenderEmailErrorMessage,
    setDefenderEmailErrorMessage,
  ] = useState<string>('')

  const [
    defenderPhoneNumberErrorMessage,
    setDefenderPhoneNumberErrorMessage,
  ] = useState<string>('')

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
      errorMessage: defenderEmailErrorMessage,
      setErrorMessage: setDefenderEmailErrorMessage,
    },
    defenderPhoneNumber: {
      validations: ['phonenumber'],
      errorMessage: defenderPhoneNumberErrorMessage,
      setErrorMessage: setDefenderPhoneNumberErrorMessage,
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

  const handleDefenderChange = async (
    selectedOption: ValueType<ReactSelectOption>,
  ) => {
    let updatedLawyer = {
      defenderName: '',
      defenderEmail: '',
      defenderPhoneNumber: '',
    }

    if (selectedOption) {
      const { label, value } = selectedOption as ReactSelectOption
      const lawyer = lawyers.lawyers.find((l) => l.email === (value as string))

      updatedLawyer = {
        defenderName: lawyer ? lawyer.name : label,
        defenderEmail: lawyer ? lawyer.email : '',
        defenderPhoneNumber: lawyer ? lawyer.phoneNr : '',
      }
    }

    await updateCase(workingCase.id, updatedLawyer)
    setWorkingCase({ ...workingCase, ...updatedLawyer })
  }

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
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="baseline"
            marginBottom={2}
          >
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.defenderInfo.heading)}
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={2}>
              <Select
                name="defenderName"
                icon="search"
                options={lawyers.lawyers.map((l) => {
                  return { label: `${l.name} (${l.practice})`, value: l.email }
                })}
                label={formatMessage(m.sections.defenderInfo.name.label)}
                placeholder={formatMessage(
                  m.sections.defenderInfo.name.placeholder,
                )}
                defaultValue={
                  workingCase.defenderName
                    ? {
                        label: workingCase.defenderName ?? '',
                        value: workingCase.defenderEmail ?? '',
                      }
                    : undefined
                }
                onChange={handleDefenderChange}
                isCreatable
              />
            </Box>
            <Box marginBottom={2}>
              <Input
                data-testid="defenderEmail"
                name="defenderEmail"
                autoComplete="off"
                label={formatMessage(m.sections.defenderInfo.email.label)}
                placeholder={formatMessage(
                  m.sections.defenderInfo.email.placeholder,
                )}
                value={workingCase.defenderEmail}
                errorMessage={defenderEmailErrorMessage}
                hasError={defenderEmailErrorMessage !== ''}
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
              />
            </Box>
            <Box marginBottom={2}>
              <InputMask
                mask="999-9999"
                maskPlaceholder={null}
                value={workingCase.defenderPhoneNumber}
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
              >
                <Input
                  data-testid="defenderPhoneNumber"
                  name="defenderPhoneNumber"
                  autoComplete="off"
                  label={formatMessage(
                    m.sections.defenderInfo.phoneNumber.label,
                  )}
                  placeholder={formatMessage(
                    m.sections.defenderInfo.phoneNumber.placeholder,
                  )}
                  errorMessage={defenderPhoneNumberErrorMessage}
                  hasError={defenderPhoneNumberErrorMessage !== ''}
                />
              </InputMask>
            </Box>
            <Checkbox
              name="sendRequestToDefender"
              label={formatMessage(m.sections.defenderInfo.sendRequest.label)}
              tooltip={formatMessage(
                m.sections.defenderInfo.sendRequest.tooltip,
                {
                  caseType:
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhaldskröfuna'
                      : 'farbannskröfuna',
                },
              )}
              checked={workingCase.sendRequestToDefender}
              onChange={(event) => setAndSendToServer(event.target)}
              large
              filled
            />
          </BlueBox>
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
                defaultValue={workingCase.leadInvestigator}
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
