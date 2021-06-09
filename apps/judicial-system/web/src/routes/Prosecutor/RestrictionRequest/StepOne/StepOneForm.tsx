import React, { useState } from 'react'
import InputMask from 'react-input-mask'

import {
  Text,
  Input,
  Box,
  Checkbox,
  Tooltip,
  AlertMessage,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'

import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'

import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'
import DefendantInfo from '../../SharedComponents/DefendantInfo/DefendantInfo'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  loading: boolean
  handleNextButtonClick: (theCase: Case) => void
}

export const StepOneForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, loading, handleNextButtonClick } = props

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
    isValid,
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
              title="Athugið"
              message="Hægt er að breyta efni kröfunnar og bæta við rannsóknargögnum eftir að hún hefur verið send dómstól en til að breytingar skili sér í dómskjalið sem verður til hliðsjónar í þinghaldinu þarf að smella á Endursenda kröfu á skjánum Yfirlit kröfu."
              type="warning"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Sakborningur
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
              Sakborningur
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
              Verjandi sakbornings
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={2}>
              <Input
                data-testid="defenderName"
                name="defenderName"
                label="Nafn verjanda"
                placeholder="Fullt nafn"
                defaultValue={workingCase.defenderName}
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
              />
            </Box>
            <Box marginBottom={2}>
              <Input
                data-testid="defenderEmail"
                name="defenderEmail"
                label="Netfang verjanda"
                placeholder="Netfang"
                defaultValue={workingCase.defenderEmail}
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
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
              >
                <Input
                  data-testid="defenderPhoneNumber"
                  name="defenderPhoneNumber"
                  label="Símanúmer verjanda"
                  placeholder="Símanúmer"
                  defaultValue={workingCase.defenderPhoneNumber}
                  errorMessage={defenderPhoneNumberErrorMessage}
                  hasError={defenderPhoneNumberErrorMessage !== ''}
                />
              </InputMask>
            </Box>
            <Checkbox
              name="sendRequestToDefender"
              label="Senda kröfu sjálfvirkt í tölvupósti til verjanda við úthlutun fyrirtökutíma"
              tooltip={`Ef hakað er hér þá fær verjandi ${
                workingCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhaldskröfuna'
                  : 'farbannskröfuna'
              } senda þegar fyrirtökutíma hefur verið úthlutað`}
              checked={workingCase.sendRequestToDefender}
              onChange={(event) => setAndSendToServer(event.target)}
              large
              backgroundColor="white"
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
                Stjórnandi rannsóknar{' '}
                <Tooltip text="Upplýsingar um stjórnanda rannsóknar birtast á vistunarseðli sem berst til gæslufangelsis." />
              </Text>
            </Box>
            <Box marginBottom={2}>
              <Input
                data-testid="leadInvestigator"
                name="leadInvestigator"
                label="Sláðu inn stjórnanda rannsóknar"
                placeholder="Hver stýrir rannsókn málsins?"
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
          nextIsDisabled={!isValid}
          nextButtonText={
            workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
          }
        />
      </FormContentContainer>
    </>
  )
}
