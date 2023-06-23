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
import { error, personal } from '../../lib/messages'
import debounce from 'lodash/debounce'
import { IDENTITY_QUERY } from '../../graphql/queries'

interface Props {
  customId?: string
  onNationalIdChange?: (s: string) => void
  onNameChange?: (s: string) => void
  nationalIdDefaultValue?: string
  nameDefaultValue?: string
  errorMessage?: string
  disabled?: boolean
}

export const NationalIdWithName: FC<Props & FieldBaseProps> = ({
  customId = '',
  field,
  application,
  onNationalIdChange,
  onNameChange,
  nationalIdDefaultValue,
  nameDefaultValue,
  errorMessage,
  disabled,
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
  } else if (!errorMessage) {
    nationalIdFieldErrors = getErrorViaPath(errors, nationaIdField)
  }

  const defaultNationalId = nationalIdDefaultValue
    ? nationalIdDefaultValue
    : getValueViaPath(application.answers, `${usedId}.nationalId`, '')
  const defaultName = nameDefaultValue
    ? nameDefaultValue
    : getValueViaPath(application.answers, `${usedId}.name`, '')

  const [
    getIdentity,
    { data, loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(
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
            label={formatMessage(personal.labels.userInformation.nationalId)}
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
            disabled={disabled}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nameField}
            defaultValue={defaultName}
            label={formatMessage(personal.labels.userInformation.name)}
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
