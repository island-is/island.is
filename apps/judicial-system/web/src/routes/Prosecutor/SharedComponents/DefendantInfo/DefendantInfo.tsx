import React from 'react'
import InputMask from 'react-input-mask'
import { Case, CaseGender } from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/shared-components'
import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  setAndSendToServer,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import * as styles from './DefendantInfo.treat'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  nationalIdErrorMessage?: string
  setNationalIdErrorMessage?: React.Dispatch<React.SetStateAction<string>>
}

const DefendantInfo: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    nationalIdErrorMessage,
    setNationalIdErrorMessage,
  } = props
  const { updateCase } = useCase()

  return (
    <>
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
            onChange={() =>
              setAndSendToServer(
                'accusedGender',
                CaseGender.MALE,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
            large
            backgroundColor="white"
          />
        </Box>
        <Box className={styles.genderColumn}>
          <RadioButton
            name="accusedGender"
            id="genderFemale"
            label="Kona"
            value={CaseGender.FEMALE}
            checked={workingCase.accusedGender === CaseGender.FEMALE}
            onChange={() =>
              setAndSendToServer(
                'accusedGender',
                CaseGender.FEMALE,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
            large
            backgroundColor="white"
          />
        </Box>
        <Box className={styles.genderColumn}>
          <RadioButton
            name="accusedGender"
            id="genderOther"
            label="Kynsegin/Annað"
            value={CaseGender.OTHER}
            checked={workingCase.accusedGender === CaseGender.OTHER}
            onChange={() =>
              setAndSendToServer(
                'accusedGender',
                CaseGender.OTHER,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
            large
            backgroundColor="white"
          />
        </Box>
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask="999999-9999"
          maskPlaceholder={null}
          onChange={(event) =>
            removeTabsValidateAndSet(
              'accusedNationalId',
              event,
              ['empty', 'national-id'],
              workingCase,
              setWorkingCase,
              nationalIdErrorMessage,
              setNationalIdErrorMessage,
            )
          }
          onBlur={(event) =>
            validateAndSendToServer(
              'accusedNationalId',
              event.target.value,
              ['empty', 'national-id'],
              workingCase,
              updateCase,
              setNationalIdErrorMessage,
            )
          }
        >
          <Input
            data-testid="nationalId"
            name="accusedNationalId"
            label="Kennitala"
            placeholder="Kennitala"
            defaultValue={workingCase.accusedNationalId}
            errorMessage={nationalIdErrorMessage}
            hasError={nationalIdErrorMessage !== ''}
            required
          />
        </InputMask>
      </Box>
    </>
  )
}

export default DefendantInfo
