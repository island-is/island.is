import React, { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import { m } from '../../lib/messages'

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const NationalIdWithName: FC<
  React.PropsWithChildren<FieldBaseProps>
> = ({ field, application }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const {
    setValue,

    formState: { errors },
  } = useFormContext()
  const nameField = `${id}.name`
  const nationaIdField = `${id}.nationalId`
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [name, setName] = useState(
    getValueViaPath(application.answers, nameField) ?? '',
  )
  const nameFieldErrors = getErrorViaPath(errors, nameField)
  const nationalIdFieldErrors = getErrorViaPath(errors, nationaIdField)

  const [getIdentity, { data, loading: queryLoading, error: queryError }] =
    useLazyQuery<Query, { input: IdentityInput }>(IdentityQuery, {
      onCompleted: (data) => {
        setValue(nameField, data.identity?.name ?? undefined)
        setName(data.identity?.name ?? '')
      },
    })

  useEffect(() => {
    if (
      nationalIdInput.length === 10 &&
      kennitala.isValid(nationalIdInput) &&
      nationalIdInput !== application.applicant
    ) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdInput,
          },
        },
      })
    }
  }, [nationalIdInput])

  return (
    <Box>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingTop={2} paddingBottom={2}>
          <InputController
            id={nationaIdField}
            label={formatMessage(m.nationalId)}
            defaultValue={(application.answers[id] as any)?.nationalId ?? ''}
            format="######-####"
            required
            backgroundColor="blue"
            onChange={(v) => {
              setNationalIdInput(v.target.value.replace(/\W/g, ''))
              if (nationalIdInput.length === 0) {
                setValue(nameField, '')
                setName('')
              }
            }}
            loading={queryLoading}
            error={
              id === 'spouse.person' &&
              nationalIdInput === application.applicant
                ? formatMessage(m.nationalIdDuplicateError)
                : nationalIdFieldErrors
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingTop={2} paddingBottom={2}>
          <Input
            name={nameField}
            id={nameField}
            value={name}
            label={formatMessage(m.name)}
            errorMessage={
              queryError || data?.identity === null
                ? formatMessage(m.nameError)
                : nameFieldErrors && !data
                ? nameFieldErrors
                : undefined
            }
            readOnly
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
