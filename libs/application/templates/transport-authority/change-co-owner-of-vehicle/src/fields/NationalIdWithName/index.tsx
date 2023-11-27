import { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import { information, error } from '../../lib/messages'
import debounce from 'lodash/debounce'
import { IDENTITY_QUERY } from '../../graphql/queries'

interface Props {
  customId?: string
  customNationalIdLabel?: string
  customNameLabel?: string
  onNationalIdChange?: (s: string) => void
  onNameChange?: (s: string) => void
  nationalIdDefaultValue?: string
  nameDefaultValue?: string
  errorMessage?: string
}

export const NationalIdWithName: FC<
  React.PropsWithChildren<Props & FieldBaseProps>
> = ({
  customId = '',
  customNationalIdLabel = '',
  customNameLabel = '',
  field,
  application,
  onNationalIdChange,
  onNameChange,
  nationalIdDefaultValue,
  nameDefaultValue,
  errorMessage,
}) => {
  const { id } = field
  const usedId = customId.length > 0 ? customId : id
  const { formatMessage } = useLocale()
  const {
    setValue,

    formState: { errors },
  } = useFormContext()
  const [nationalIdInput, setNationalIdInput] = useState('')
  const nameField = `${usedId}.name`
  const nationaIdField = `${usedId}.nationalId`
  const nameFieldErrors = errorMessage
    ? nameDefaultValue?.length === 0
      ? errorMessage
      : undefined
    : getErrorViaPath(errors, nameField)

  let nationalIdFieldErrors: string | undefined
  if (errorMessage && nationalIdDefaultValue?.length === 0) {
    nationalIdFieldErrors = errorMessage
  } else if (
    kennitala.isValid(nationalIdInput) &&
    !kennitala.isCompany(nationalIdInput) &&
    kennitala.info(nationalIdInput).age < 18
  ) {
    nationalIdFieldErrors = formatMessage(error.minAgeNotFulfilled)
  } else if (!errorMessage) {
    nationalIdFieldErrors = getErrorViaPath(errors, nationaIdField)
  }

  const defaultNationalId = nationalIdDefaultValue
    ? nationalIdDefaultValue
    : getValueViaPath(application.answers, `${usedId}.nationalId`, '')
  const defaultName = nameDefaultValue
    ? nameDefaultValue
    : getValueViaPath(application.answers, `${usedId}.name`, '')

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
    <Box>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nationaIdField}
            label={
              customNationalIdLabel.length > 0
                ? customNationalIdLabel
                : formatMessage(information.labels.coOwner.nationalId)
            }
            defaultValue={defaultNationalId}
            format="######-####"
            required
            backgroundColor="blue"
            onChange={debounce((v) => {
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
              onNationalIdChange &&
                onNationalIdChange(v.target.value.replace(/\W/g, ''))
            })}
            loading={queryLoading}
            error={nationalIdFieldErrors}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nameField}
            defaultValue={defaultName}
            label={
              customNameLabel.length > 0
                ? customNameLabel
                : formatMessage(information.labels.coOwner.name)
            }
            required
            error={
              queryError || data?.identity === null
                ? formatMessage(error.nameByNationalId)
                : nameFieldErrors && !data
                ? nameFieldErrors
                : undefined
            }
            disabled
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
