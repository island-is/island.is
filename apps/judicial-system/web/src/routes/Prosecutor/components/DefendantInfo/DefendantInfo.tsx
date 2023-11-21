import React, { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import {
  Box,
  Button,
  Checkbox,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import {
  Defendant,
  Gender,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ReactSelectOption,
  TempCase as Case,
} from '@island.is/judicial-system-web/src/types'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useNationalRegistry from '@island.is/judicial-system-web/src/utils/hooks/useNationalRegistry'
import { isBusiness } from '@island.is/judicial-system-web/src/utils/stepHelper'

import * as strings from './DefendantInfo.strings'

interface Props {
  defendant: Defendant
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  onChange: (updatedDefendant: UpdateDefendantInput) => void
  updateDefendantState: (
    update: UpdateDefendantInput,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  ) => void
  onDelete?: (defendant: Defendant) => Promise<void>
  nationalIdImmutable: boolean
}

const DefendantInfo: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const {
    defendant,
    workingCase,
    setWorkingCase,
    onDelete,
    onChange,
    updateDefendantState,
    nationalIdImmutable = false,
  } = props
  const { formatMessage } = useIntl()
  const { personData, businessData, personError, businessError } =
    useNationalRegistry(defendant.nationalId)

  const genderOptions: ReactSelectOption[] = [
    { label: formatMessage(core.male), value: Gender.MALE },
    { label: formatMessage(core.female), value: Gender.FEMALE },
    { label: formatMessage(core.otherGender), value: Gender.OTHER },
  ]

  const [nationalIdErrorMessage, setNationalIdErrorMessage] =
    useState<string>('')
  const [nationalIdNotFound, setNationalIdNotFound] = useState<boolean>(false)

  const [accusedNameErrorMessage, setAccusedNameErrorMessage] =
    useState<string>('')

  const [accusedAddressErrorMessage, setAccusedAddressErrorMessage] =
    useState<string>('')

  const [isGenderAndCitizenshipDisabled, setIsGenderAndCitizenshipDisabled] =
    useState<boolean>(
      !!defendant.nationalId && isBusiness(defendant.nationalId),
    )

  const mapNationalRegistryGenderToGender = (gender: string) => {
    return gender === 'male'
      ? Gender.MALE
      : gender === 'female'
      ? Gender.FEMALE
      : Gender.OTHER
  }

  useEffect(() => {
    if (personError || (personData && personData.items?.length === 0)) {
      setNationalIdNotFound(true)
      return
    }

    if (personData && personData.items && personData.items.length > 0) {
      setAccusedNameErrorMessage('')
      setAccusedAddressErrorMessage('')
      setNationalIdErrorMessage('')
      setIsGenderAndCitizenshipDisabled(false)

      onChange({
        caseId: workingCase.id,
        defendantId: defendant.id,
        name: personData.items[0].name,
        gender: mapNationalRegistryGenderToGender(personData.items[0].gender),
        address: personData.items[0].permanent_address.street?.nominative,
      })
    }
  }, [defendant.id, onChange, personData, personError, workingCase.id])

  useEffect(() => {
    if (businessError || (businessData && businessData.items?.length === 0)) {
      setNationalIdNotFound(true)
      return
    }

    if (businessData && businessData.items && businessData.items.length > 0) {
      setAccusedNameErrorMessage('')
      setAccusedAddressErrorMessage('')
      setNationalIdErrorMessage('')
      setIsGenderAndCitizenshipDisabled(true)

      onChange({
        caseId: workingCase.id,
        defendantId: defendant.id,
        name: businessData.items[0].full_name,
        address: businessData.items[0].legal_address.street?.nominative,
        gender: undefined,
        citizenship: undefined,
      })
    }
  }, [businessData, businessError, defendant.id, onChange, workingCase.id])

  return (
    <BlueBox>
      {onDelete && (
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button
            onClick={() => onDelete(defendant)}
            colorScheme="destructive"
            variant="text"
            size="small"
            data-testid="deleteDefendantButton"
          >
            {formatMessage(strings.defendantInfo.delete)}
          </Button>
        </Box>
      )}
      <Box marginBottom={2}>
        <Checkbox
          name={`noNationalId-${defendant.id}`}
          label={formatMessage(
            strings.defendantInfo.doesNotHaveIcelandicNationalId,
            {
              isIndictment: isIndictmentCase(workingCase.type),
            },
          )}
          checked={Boolean(defendant.noNationalId)}
          onChange={() => {
            setNationalIdNotFound(false)
            setNationalIdErrorMessage('')

            updateDefendantState(
              {
                caseId: workingCase.id,
                defendantId: defendant.id,
                noNationalId: !defendant.noNationalId,
                nationalId: undefined,
              },
              setWorkingCase,
            )

            onChange({
              caseId: workingCase.id,
              defendantId: defendant.id,
              noNationalId: !defendant.noNationalId,
              nationalId: undefined,
            })
          }}
          filled
          large
          disabled={nationalIdImmutable}
        />
      </Box>
      <Box marginBottom={2}>
        <InputMask
          // eslint-disable-next-line local-rules/disallow-kennitalas
          mask={defendant.noNationalId ? '99.99.9999' : '999999-9999'}
          maskPlaceholder={null}
          value={defendant.nationalId ?? ''}
          onChange={(evt) => {
            setNationalIdNotFound(false)
            removeErrorMessageIfValid(
              defendant.noNationalId
                ? ['date-of-birth']
                : ['empty', 'national-id'],
              evt.target.value,
              nationalIdErrorMessage,
              setNationalIdErrorMessage,
            )

            updateDefendantState(
              {
                caseId: workingCase.id,
                defendantId: defendant.id,
                nationalId: evt.target.value,
              },
              setWorkingCase,
            )
          }}
          onBlur={async (evt) => {
            validateAndSetErrorMessage(
              defendant.noNationalId
                ? ['date-of-birth']
                : ['empty', 'national-id'],
              evt.target.value,
              setNationalIdErrorMessage,
            )

            onChange({
              caseId: workingCase.id,
              defendantId: defendant.id,
              nationalId: evt.target.value,
            })
          }}
          disabled={nationalIdImmutable}
        >
          <Input
            data-testid="nationalId"
            name="accusedNationalId"
            autoComplete="off"
            label={formatMessage(
              defendant.noNationalId ? core.dateOfBirth : core.nationalId,
            )}
            placeholder={formatMessage(
              defendant.noNationalId
                ? core.dateOfBirthPlaceholder
                : core.nationalId,
            )}
            errorMessage={nationalIdErrorMessage}
            hasError={nationalIdErrorMessage !== ''}
            required={!defendant.noNationalId}
          />
        </InputMask>
        {defendant.nationalId?.length === 11 && nationalIdNotFound && (
          <Text color="red600" variant="eyebrow" marginTop={1}>
            {formatMessage(core.nationalIdNotFoundInNationalRegistry)}
          </Text>
        )}
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
              ['empty'],
              evt.target.value,
              accusedNameErrorMessage,
              setAccusedNameErrorMessage,
            )

            updateDefendantState(
              {
                caseId: workingCase.id,
                defendantId: defendant.id,
                name: evt.target.value,
              },
              setWorkingCase,
            )
          }}
          onBlur={(evt) => {
            validateAndSetErrorMessage(
              ['empty'],
              evt.target.value,
              setAccusedNameErrorMessage,
            )

            onChange({
              caseId: workingCase.id,
              defendantId: defendant.id,
              name: evt.target.value.trim(),
            })
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
              ['empty'],
              evt.target.value,
              accusedAddressErrorMessage,
              setAccusedAddressErrorMessage,
            )

            updateDefendantState(
              {
                caseId: workingCase.id,
                defendantId: defendant.id,
                address: evt.target.value,
              },
              setWorkingCase,
            )
          }}
          onBlur={(evt) => {
            validateAndSetErrorMessage(
              ['empty'],
              evt.target.value,
              setAccusedAddressErrorMessage,
            )

            onChange({
              caseId: workingCase.id,
              defendantId: defendant.id,
              address: evt.target.value.trim(),
            })
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
              value={
                genderOptions.find(
                  (option) => option.value === defendant.gender,
                ) ?? null
              }
              onChange={(selectedOption) =>
                onChange({
                  caseId: workingCase.id,
                  defendantId: defendant.id,
                  gender: (selectedOption as ReactSelectOption).value as Gender,
                })
              }
              isDisabled={isGenderAndCitizenshipDisabled}
              required
            />
          </GridColumn>
          <GridColumn span="6/12">
            <Input
              name="defendantCitizenship"
              autoComplete="off"
              label={formatMessage(core.citizenship)}
              placeholder={formatMessage(core.selectCitizenship)}
              value={defendant.citizenship ?? ''}
              onChange={(evt) => {
                updateDefendantState(
                  {
                    caseId: workingCase.id,
                    defendantId: defendant.id,
                    citizenship: evt.target.value,
                  },
                  setWorkingCase,
                )
              }}
              onBlur={(evt) => {
                onChange({
                  caseId: workingCase.id,
                  defendantId: defendant.id,
                  citizenship: evt.target.value.trim(),
                })
              }}
              disabled={isGenderAndCitizenshipDisabled}
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </BlueBox>
  )
}

export default DefendantInfo
