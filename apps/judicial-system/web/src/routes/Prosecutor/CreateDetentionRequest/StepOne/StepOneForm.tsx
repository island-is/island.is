import React, { useState } from 'react'
import InputMask from 'react-input-mask'

import {
  Text,
  Input,
  Box,
  RadioButton,
  Checkbox,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'

import {
  Case,
  CaseGender,
  CaseType,
  UpdateCase,
} from '@island.is/judicial-system/types'

import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  FormSettings,
  useCaseFormHelper,
} from '@island.is/judicial-system-web/src/utils/useFormHelper'
import * as styles from './StepOne.treat'

interface Props {
  case: Case
  loading: boolean
  updateCase: (id: string, updateCase: UpdateCase) => void
  handleNextButtonClick: (theCase: Case) => void
}

export const StepOneForm: React.FC<Props> = (props) => {
  const [workingCase, setWorkingCase] = useState(props.case)

  const [
    policeCaseNumberErrorMessage,
    setPoliceCaseNumberErrorMessage,
  ] = useState<string>()

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>()

  const [
    accusedNameErrorMessage,
    setAccusedNameErrorMessage,
  ] = useState<string>()

  const [
    accusedAddressErrorMessage,
    setAccusedAddressErrorMessage,
  ] = useState<string>()

  const [
    defenderEmailErrorMessage,
    setDefenderEmailErrorMessage,
  ] = useState<string>()

  const [
    defenderPhoneNumberErrorMessage,
    setDefenderPhoneNumberErrorMessage,
  ] = useState<string>()

  const validations: FormSettings = {
    policeCaseNumber: {
      validations: ['empty', 'police-casenumber-format'],
      errorMessage: policeCaseNumberErrorMessage,
      setErrorMessage: setPoliceCaseNumberErrorMessage,
    },
    accusedNationalId: {
      validations: ['empty', 'national-id'],
      errorMessage: nationalIdErrorMessage,
      setErrorMessage: setNationalIdErrorMessage,
    },
    accusedName: {
      validations: ['empty'],
      errorMessage: accusedNameErrorMessage,
      setErrorMessage: setAccusedNameErrorMessage,
    },
    accusedAddress: {
      validations: ['empty'],
      errorMessage: accusedAddressErrorMessage,
      setErrorMessage: setAccusedAddressErrorMessage,
    },
    defenderEmail: {
      validations: ['email-format'],
      errorMessage: defenderEmailErrorMessage,
      setErrorMessage: setDefenderEmailErrorMessage,
    },
    sendRequestToDefender: {},
  }

  const {
    isValid,
    setField,
    validateAndSendToServer,
    setAndSendToServer,
  } = useCaseFormHelper(
    workingCase,
    setWorkingCase,
    validations,
    props.updateCase,
  )

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Sakborningur
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Málsnúmer lögreglu
            </Text>
          </Box>
          <InputMask
            // This is temporary until we start reading LÖKE case numbers from LÖKE
            mask="999-9999-9999999"
            maskPlaceholder={null}
            onChange={(event) => setField(event.target)}
            onBlur={(event) => validateAndSendToServer(event.target)}
          >
            <Input
              data-testid="policeCaseNumber"
              name="policeCaseNumber"
              label="Slá inn LÖKE málsnúmer"
              placeholder="007-2020-X"
              defaultValue={workingCase.policeCaseNumber}
              errorMessage={policeCaseNumberErrorMessage}
              hasError={policeCaseNumberErrorMessage !== undefined}
              required
            />
          </InputMask>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Sakborningur
            </Text>
          </Box>
          <BlueBox>
            <Box marginBottom={2}>
              <Text as="h4" variant="h4">
                Kyn{' '}
                <Text as="span" color="red600" fontWeight="semiBold">
                  *
                </Text>
              </Text>
            </Box>
            <Box marginBottom={2} className={styles.genderContainer}>
              <Box className={styles.genderColumn}>
                <RadioButton
                  name="accusedGender"
                  id="genderMale"
                  label="Karl"
                  value={CaseGender.MALE}
                  checked={workingCase.accusedGender === CaseGender.MALE}
                  onChange={(event) => setAndSendToServer(event.target)}
                  large
                  filled
                />
              </Box>
              <Box className={styles.genderColumn}>
                <RadioButton
                  name="accusedGender"
                  id="genderFemale"
                  label="Kona"
                  value={CaseGender.FEMALE}
                  checked={workingCase.accusedGender === CaseGender.FEMALE}
                  onChange={(event) => setAndSendToServer(event.target)}
                  large
                  filled
                />
              </Box>
              <Box className={styles.genderColumn}>
                <RadioButton
                  name="accusedGender"
                  id="genderOther"
                  label="Kynsegin/Annað"
                  value={CaseGender.OTHER}
                  checked={workingCase.accusedGender === CaseGender.OTHER}
                  onChange={(event) => setAndSendToServer(event.target)}
                  large
                  filled
                />
              </Box>
            </Box>
            <Box marginBottom={2}>
              <InputMask
                mask="999999-9999"
                maskPlaceholder={null}
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
              >
                <Input
                  data-testid="nationalId"
                  name="accusedNationalId"
                  label="Kennitala"
                  placeholder="Kennitala"
                  defaultValue={workingCase.accusedNationalId}
                  errorMessage={nationalIdErrorMessage}
                  hasError={nationalIdErrorMessage !== undefined}
                  required
                />
              </InputMask>
            </Box>
            <Box marginBottom={2}>
              <Input
                data-testid="accusedName"
                name="accusedName"
                label="Fullt nafn"
                placeholder="Fullt nafn"
                defaultValue={workingCase.accusedName}
                errorMessage={accusedNameErrorMessage}
                hasError={accusedNameErrorMessage !== undefined}
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
                required
              />
            </Box>
            <Input
              data-testid="accusedAddress"
              name="accusedAddress"
              label="Lögheimili/dvalarstaður"
              placeholder="Lögheimili eða dvalarstaður"
              defaultValue={workingCase.accusedAddress}
              errorMessage={accusedAddressErrorMessage}
              hasError={accusedAddressErrorMessage !== undefined}
              onChange={(event) => setField(event.target)}
              onBlur={(event) => validateAndSendToServer(event.target)}
              required
            />
          </BlueBox>
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
                hasError={defenderEmailErrorMessage !== undefined}
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
              />
            </Box>
            <Box marginBottom={2}>
              <Input
                data-testid="defenderPhoneNumber"
                name="defenderPhoneNumber"
                label="Símanúmer verjanda"
                placeholder="Símanúmer"
                defaultValue={workingCase.defenderPhoneNumber}
                errorMessage={defenderEmailErrorMessage}
                hasError={defenderEmailErrorMessage !== undefined}
                onChange={(event) => setField(event.target)}
                onBlur={(event) => validateAndSendToServer(event.target)}
              />
            </Box>
            <Checkbox
              name={'sendRequestToDefender'}
              label={
                'Senda kröfu sjálfvirkt í tölvupósti til verjanda við úthlutun fyrirtökutíma'
              }
              checked={workingCase.sendRequestToDefender}
              tooltip={`Ef hakað er hér þá fær verjandi ${
                workingCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhaldskröfuna'
                  : 'farbannskröfuna'
              } senda þegar fyrirtökutíma hefur verið úthlutað`}
              onChange={(event) => setAndSendToServer(event.target)}
              large
              filled
            />
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={Constants.REQUEST_LIST_ROUTE}
          onNextButtonClick={async () =>
            await props.handleNextButtonClick(workingCase)
          }
          nextIsLoading={props.loading}
          nextIsDisabled={!isValid}
          nextButtonText={
            workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
          }
        />
      </FormContentContainer>
    </>
  )
}
