import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import {
  Defendant,
  Gender,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import { Box, Icon, Input, RadioButton, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from './DefendantInfo.css'
import {
  validate,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'

interface Props {
  defendant: Defendant
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  onChange: (
    defendantId: string,
    updatedDefendant: UpdateDefendant,
  ) => Promise<void>
  updateDefendantState: (defendantId: string, update: UpdateDefendant) => void
  onDelete?: () => void
}

const DefendantInfo: React.FC<Props> = (props) => {
  const {
    defendant,
    workingCase,
    setWorkingCase,
    onDelete,
    onChange,
    updateDefendantState,
  } = props
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>(
    '',
  )

  const [
    accusedNameErrorMessage,
    setAccusedNameErrorMessage,
  ] = useState<string>('')

  const [
    accusedAddressErrorMessage,
    setAccusedAddressErrorMessage,
  ] = useState<string>('')

  return (
    // TDOO defendants: handle multiple defendants
    <BlueBox>
      <Box marginBottom={2} display="flex" justifyContent="spaceBetween">
        <Text as="h4" variant="h4">
          {formatMessage(core.gender)}{' '}
          <Text as="span" color="red600" fontWeight="semiBold">
            *
          </Text>
        </Text>
        {onDelete && (
          <button onClick={onDelete} aria-label="Remove defendant">
            <Icon icon="close" color="blue400" />
          </button>
        )}
      </Box>
      <Box marginBottom={2} className={styles.genderContainer}>
        <Box className={styles.genderColumn}>
          <RadioButton
            name={`accusedGender${defendant.id}`}
            id={`genderMale${defendant.id}`}
            label={formatMessage(core.male)}
            value={Gender.MALE}
            checked={defendant.gender === Gender.MALE}
            onChange={() => {
              onChange(defendant.id, {
                gender: Gender.MALE,
              })
            }}
            large
            backgroundColor="white"
          />
        </Box>
        <Box className={styles.genderColumn}>
          <RadioButton
            name={`accusedGender${defendant.id}`}
            id={`genderFemale${defendant.id}`}
            label={formatMessage(core.female)}
            value={Gender.FEMALE}
            checked={defendant.gender === Gender.FEMALE}
            onChange={async () => {
              onChange(defendant.id, {
                gender: Gender.FEMALE,
              })
            }}
            large
            backgroundColor="white"
          />
        </Box>
        <Box className={styles.genderColumn}>
          <RadioButton
            name={`accusedGender${defendant.id}`}
            id={`genderOther${defendant.id}`}
            label={formatMessage(core.otherGender)}
            value={Gender.OTHER}
            checked={defendant.gender === Gender.OTHER}
            onChange={async () => {
              onChange(defendant.id, {
                gender: Gender.OTHER,
              })
            }}
            large
            backgroundColor="white"
          />
        </Box>
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask="999999-9999"
          maskPlaceholder={null}
          value={defendant.nationalId ?? ''}
          onChange={(evt) => {
            // Validate
            const isValid = (['empty', 'national-id'] as Validation[]).some(
              (validation) =>
                validate(evt.target.value, validation).isValid === false,
            )

            // Set errormessage if invalid and remove error message if not
            if (nationalIdErrorMessage !== '' && isValid) {
              setNationalIdErrorMessage('')
            }

            // Set state
            updateDefendantState(defendant.id, {
              nationalId: evt.target.value,
            })
          }}
          onBlur={(evt) => {
            const error = (['empty', 'national-id'] as Validation[])
              .map((v) => validate(evt.target.value, v))
              .find((v) => v.isValid === false)

            if (error && setNationalIdErrorMessage) {
              setNationalIdErrorMessage(error.errorMessage)
              return
            }

            onChange(defendant.id, { nationalId: evt.target.value })
          }}
        >
          <Input
            data-testid="nationalId"
            name="accusedNationalId"
            autoComplete="off"
            label={formatMessage(core.nationalId)}
            placeholder={formatMessage(core.nationalId)}
            errorMessage={nationalIdErrorMessage}
            hasError={nationalIdErrorMessage !== ''}
            required
          />
        </InputMask>
      </Box>
      <Box marginBottom={2}>
        <Input
          data-testid="accusedName"
          name="accusedName"
          autoComplete="off"
          label={formatMessage(core.fullName)}
          placeholder={formatMessage(core.fullName)}
          value={defendant.name ?? ''}
          errorMessage={accusedNameErrorMessage}
          hasError={accusedNameErrorMessage !== ''}
          onChange={(event) =>
            removeTabsValidateAndSet(
              'accusedName',
              event,
              ['empty'],
              workingCase,
              setWorkingCase,
              accusedNameErrorMessage,
              setAccusedNameErrorMessage,
            )
          }
          onBlur={(event) =>
            validateAndSendToServer(
              'accusedName',
              event.target.value,
              ['empty'],
              workingCase,
              updateCase,
              setAccusedNameErrorMessage,
            )
          }
          required
        />
      </Box>
      <Input
        data-testid="accusedAddress"
        name="accusedAddress"
        autoComplete="off"
        label={formatMessage(core.addressOrResidence)}
        placeholder={formatMessage(core.addressOrResidence)}
        value={defendant.address ?? ''}
        errorMessage={accusedAddressErrorMessage}
        hasError={
          Boolean(accusedAddressErrorMessage) &&
          accusedAddressErrorMessage !== ''
        }
        onChange={(event) =>
          removeTabsValidateAndSet(
            'accusedAddress',
            event,
            ['empty'],
            workingCase,
            setWorkingCase,
            accusedAddressErrorMessage,
            setAccusedAddressErrorMessage,
          )
        }
        onBlur={(event) =>
          validateAndSendToServer(
            'accusedAddress',
            event.target.value,
            ['empty'],
            workingCase,
            updateCase,
            setAccusedAddressErrorMessage,
          )
        }
        required
      />
    </BlueBox>
  )
}

export default DefendantInfo
