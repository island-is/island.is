import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
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
import InputName from '@island.is/judicial-system-web/src/components/Inputs/InputName'
import InputNationalId from '@island.is/judicial-system-web/src/components/Inputs/InputNationalId'
import {
  Case,
  Defendant,
  Gender,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useNationalRegistry } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { isBusiness } from '@island.is/judicial-system-web/src/utils/utils'

import * as strings from './DefendantInfo.strings'

interface Props {
  defendant: Defendant
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  onChange: (updatedDefendant: UpdateDefendantInput) => void
  updateDefendantState: (
    update: UpdateDefendantInput,
    setWorkingCase: Dispatch<SetStateAction<Case>>,
  ) => void
  onDelete?: (defendant: Defendant) => Promise<void>
  nationalIdImmutable: boolean
}

const DefendantInfo: FC<Props> = (props) => {
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

  const [nationalIdNotFound, setNationalIdNotFound] = useState<boolean>(false)

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
      setAccusedAddressErrorMessage('')
      setNationalIdNotFound(false)
      setIsGenderAndCitizenshipDisabled(false)

      onChange({
        caseId: workingCase.id,
        defendantId: defendant.id,
        name: personData.items[0].name,
        gender: mapNationalRegistryGenderToGender(personData.items[0].gender),
        address: personData.items[0].permanent_address.street?.nominative,
      })
    }
    // We only want this to run when a lookup is done in the national registry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personData, personError])

  useEffect(() => {
    if (businessError || (businessData && businessData.items?.length === 0)) {
      setNationalIdNotFound(true)
      return
    }

    if (businessData && businessData.items && businessData.items.length > 0) {
      setAccusedAddressErrorMessage('')
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
    // We only want this to run when a lookup is done in the national registry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessData, businessError])

  return (
    <BlueBox className={grid({ gap: 2 })}>
      {onDelete && (
        <Box display="flex" justifyContent="flexEnd">
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

          updateDefendantState(
            {
              caseId: workingCase.id,
              defendantId: defendant.id,
              noNationalId: !defendant.noNationalId,
              nationalId: null,
            },
            setWorkingCase,
          )

          onChange({
            caseId: workingCase.id,
            defendantId: defendant.id,
            noNationalId: !defendant.noNationalId,
            nationalId: null,
          })
        }}
        filled
        large
        disabled={nationalIdImmutable}
      />
      <InputNationalId
        isDateOfBirth={Boolean(defendant.noNationalId)}
        value={defendant.nationalId ?? ''}
        onBlur={(value) =>
          onChange({
            caseId: workingCase.id,
            defendantId: defendant.id,
            nationalId: value || null,
          })
        }
        onChange={(value) =>
          updateDefendantState(
            {
              caseId: workingCase.id,
              defendantId: defendant.id,
              nationalId: value || null,
            },
            setWorkingCase,
          )
        }
        disabled={nationalIdImmutable}
        required={!defendant.noNationalId}
      />
      {defendant.nationalId?.length === 11 && nationalIdNotFound && (
        <Text color="red600" variant="eyebrow" marginTop={1}>
          {formatMessage(core.nationalIdNotFoundInNationalRegistry)}
        </Text>
      )}
      <InputName
        value={defendant.name ?? ''}
        onBlur={(value) =>
          onChange({
            caseId: workingCase.id,
            defendantId: defendant.id,
            name: value.trim(),
          })
        }
        onChange={(value) => {
          updateDefendantState(
            {
              caseId: workingCase.id,
              defendantId: defendant.id,
              name: value,
            },
            setWorkingCase,
          )
        }}
        required
      />
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
