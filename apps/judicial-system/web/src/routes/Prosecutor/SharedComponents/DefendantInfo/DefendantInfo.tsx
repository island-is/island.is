import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import {
  Defendant,
  Gender,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import {
  Box,
  Checkbox,
  Column,
  ContentBlock,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Inline,
  Input,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  defendant as defendantMessages,
  core,
} from '@island.is/judicial-system-web/messages'

import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { ValueType } from 'react-select'

interface Props {
  defendant: Defendant
  onChange: (
    defendantId: string,
    updatedDefendant: UpdateDefendant,
  ) => Promise<void>
  updateDefendantState: (defendantId: string, update: UpdateDefendant) => void
  onDelete?: (defendant: Defendant) => Promise<void>
}

const DefendantInfo: React.FC<Props> = (props) => {
  const { defendant, onDelete, onChange, updateDefendantState } = props
  const { formatMessage } = useIntl()

  const genderOptions: ReactSelectOption[] = [
    { label: formatMessage(core.male), value: Gender.MALE },
    { label: formatMessage(core.female), value: Gender.FEMALE },
    { label: formatMessage(core.otherGender), value: Gender.OTHER },
  ]

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
    <BlueBox>
      <Box marginBottom={2} display="flex" justifyContent="spaceBetween">
        <Text as="h4" variant="h4">
          {formatMessage(core.gender)}{' '}
          <Text as="span" color="red600" fontWeight="semiBold">
            *
          </Text>
        </Text>
        {onDelete && (
          <button
            onClick={() => onDelete(defendant)}
            aria-label="Remove defendant"
          >
            <Icon icon="close" color="blue400" />
          </button>
        )}
      </Box>
      <Box marginBottom={2}>
        <Checkbox
          label={formatMessage(
            defendantMessages.sections.defendantInfo
              .doesNotHaveIcelandicNationalId,
          )}
          tooltip={formatMessage(
            defendantMessages.sections.defendantInfo
              .doesNotHaveIcelandicNationalIdTooltip,
          )}
          filled
          large
        />
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask="999999-9999"
          maskPlaceholder={null}
          value={defendant.nationalId ?? ''}
          onChange={(evt) => {
            removeErrorMessageIfValid(
              ['empty', 'national-id'] as Validation[],
              evt.target.value,
              nationalIdErrorMessage,
              setNationalIdErrorMessage,
            )

            updateDefendantState(defendant.id, {
              nationalId: evt.target.value,
            })
          }}
          onBlur={(evt) => {
            validateAndSetErrorMessage(
              ['empty', 'national-id'],
              evt.target.value,
              setNationalIdErrorMessage,
            )

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
          onChange={(evt) => {
            removeErrorMessageIfValid(
              ['empty'] as Validation[],
              evt.target.value,
              accusedNameErrorMessage,
              setAccusedNameErrorMessage,
            )

            updateDefendantState(defendant.id, {
              name: evt.target.value,
            })
          }}
          onBlur={(evt) => {
            validateAndSetErrorMessage(
              ['empty'] as Validation[],
              evt.target.value,
              setAccusedNameErrorMessage,
            )

            onChange(defendant.id, { name: evt.target.value })
          }}
          required
        />
      </Box>
      <Box marginBottom={2}>
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
          onChange={(evt) => {
            removeErrorMessageIfValid(
              ['empty'] as Validation[],
              evt.target.value,
              accusedAddressErrorMessage,
              setAccusedAddressErrorMessage,
            )

            updateDefendantState(defendant.id, {
              address: evt.target.value,
            })
          }}
          onBlur={(evt) => {
            validateAndSetErrorMessage(
              ['empty'] as Validation[],
              evt.target.value,
              setAccusedAddressErrorMessage,
            )

            onChange(defendant.id, { address: evt.target.value })
          }}
          required
        />
      </Box>
      <GridContainer>
        <GridRow>
          <GridColumn span="6/12">
            <Select
              name="defendantGender"
              placeholder={formatMessage(core.selectGender)}
              options={genderOptions}
              label={formatMessage(core.gender)}
              value={genderOptions.find(
                (option) => option.value === defendant.gender,
              )}
              onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                onChange(defendant.id, {
                  gender: (selectedOption as ReactSelectOption).value as Gender,
                })
              }
              required
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Input
              name="defendantCitizenship"
              label={formatMessage(core.citizenship)}
              placeholder={formatMessage(core.selectCitizenship)}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </BlueBox>
  )
}

export default DefendantInfo
