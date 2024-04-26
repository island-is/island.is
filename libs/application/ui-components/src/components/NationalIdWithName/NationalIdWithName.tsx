import { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  coreErrorMessages,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, StaticText } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import debounce from 'lodash/debounce'
import { IDENTITY_QUERY } from './graphql/queries'

interface NationalIdWithNameProps {
  id: string
  application: Application
  disabled?: boolean
  required?: boolean
  customId?: string
  customNationalIdLabel?: StaticText
  customNameLabel?: StaticText
  onNationalIdChange?: (s: string) => void
  onNameChange?: (s: string) => void
  nationalIdDefaultValue?: string
  nameDefaultValue?: string
  errorMessage?: string
  minAgePerson?: number
}

export const NationalIdWithName: FC<
  React.PropsWithChildren<NationalIdWithNameProps>
> = ({
  id,
  application,
  disabled,
  required,
  customId = '',
  customNationalIdLabel = '',
  customNameLabel = '',
  onNationalIdChange,
  onNameChange,
  nationalIdDefaultValue,
  nameDefaultValue,
  errorMessage,
  minAgePerson,
}) => {
  const fieldId = customId.length > 0 ? customId : id
  const nameField = `${fieldId}.name`
  const nationaIdField = `${fieldId}.nationalId`

  const { formatMessage } = useLocale()
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')

  // get name validation errors
  const nameFieldErrors = errorMessage
    ? nameDefaultValue?.length === 0
      ? errorMessage
      : undefined
    : getErrorViaPath(errors, nameField)

  // get national id validation errors
  let nationalIdFieldErrors: string | undefined
  if (errorMessage && nationalIdDefaultValue?.length === 0) {
    nationalIdFieldErrors = errorMessage
  } else if (
    minAgePerson &&
    kennitala.isValid(nationalIdInput) &&
    !kennitala.isCompany(nationalIdInput) &&
    kennitala.info(nationalIdInput).age < minAgePerson
  ) {
    nationalIdFieldErrors = formatMessage(
      coreErrorMessages.nationalRegistryMinAgeNotFulfilled,
      { minAge: minAgePerson },
    )
  } else if (!errorMessage) {
    nationalIdFieldErrors = getErrorViaPath(errors, nationaIdField)
  }

  // get default values
  const defaultNationalId = nationalIdDefaultValue
    ? nationalIdDefaultValue
    : getValueViaPath(application.answers, nationaIdField, '')
  const defaultName = nameDefaultValue
    ? nameDefaultValue
    : getValueViaPath(application.answers, nameField, '')

  // query to get name by national id
  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(
      gql`
        ${IDENTITY_QUERY}
      `,
      {
        onCompleted: (data) => {
          onNameChange && onNameChange(data.identity?.name ?? '')
          setValue(nameField, data.identity?.name ?? undefined)
        },
      },
    )

  // fetch and update name when user has entered a valid national id
  useEffect(() => {
    if (nationalIdInput.length === 10 && kennitala.isValid(nationalIdInput)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
  }, [nationalIdInput, getIdentity])

  return (
    <GridRow>
      <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
        <InputController
          id={nationaIdField}
          label={
            customNationalIdLabel
              ? formatMessage(customNationalIdLabel)
              : formatMessage(coreErrorMessages.nationalRegistryNationalId)
          }
          defaultValue={defaultNationalId}
          format="######-####"
          required={required}
          backgroundColor="blue"
          onChange={debounce((v) => {
            setNationalIdInput(v.target.value.replace(/\W/g, ''))
            onNationalIdChange &&
              onNationalIdChange(v.target.value.replace(/\W/g, ''))
          })}
          loading={queryLoading}
          error={nationalIdFieldErrors}
          disabled={disabled}
        />
      </GridColumn>
      <GridColumn span={['1/1', '1/1', '1/1', '1/2']} paddingTop={2}>
        <InputController
          id={nameField}
          defaultValue={defaultName}
          label={
            customNameLabel
              ? formatMessage(customNameLabel)
              : formatMessage(coreErrorMessages.nationalRegistryName)
          }
          required={required}
          error={
            queryError || data?.identity === null
              ? formatMessage(
                  coreErrorMessages.nationalRegistryNameNotFoundForNationalId,
                )
              : nameFieldErrors && !data
              ? nameFieldErrors
              : undefined
          }
          disabled
        />
      </GridColumn>
    </GridRow>
  )
}
