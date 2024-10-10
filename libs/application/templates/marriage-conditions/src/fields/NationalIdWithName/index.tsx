import React, { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn, Input } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { InputController } from '@island.is/shared/form-fields'
import { useFormContext } from 'react-hook-form'
import * as nationalId from 'kennitala'
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
  const { answers } = application
  const { formatMessage } = useLocale()
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const nameField = `${id}.name`
  const nationalIdField = `${id}.nationalId`
  const [nationalIdInput, setNationalIdInput] = useState('')
  const [name, setName] = useState(getValueViaPath(answers, nameField) ?? '')
  const nameFieldErrors = getErrorViaPath(errors, nameField)
  const nationalIdFieldErrors = getErrorViaPath(errors, nationalIdField)

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
      nationalId.info(nationalIdInput).age >= 18 &&
      nationalId.isValid(nationalIdInput) &&
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
        <GridColumn span={['1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nationalIdField}
            label={formatMessage(m.nationalId)}
            defaultValue={getValueViaPath(answers, 'nationalId')}
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
                : nationalId.info(nationalIdInput).age < 18
                ? formatMessage(m.nationalIdWitnessUnderageError)
                : nationalIdFieldErrors
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingTop={2}>
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
