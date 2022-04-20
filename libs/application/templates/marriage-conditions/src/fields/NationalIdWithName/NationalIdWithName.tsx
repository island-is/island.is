import React, { FC, useEffect, useState } from 'react'
import { Box, GridRow, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { FieldBaseProps } from '@island.is/application/core'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import {
  InputController,
} from '@island.is/shared/form-fields'
import {
  useFormContext,
} from 'react-hook-form'
import * as kennitala from 'kennitala'

export type Individual = {
  name: string
  nationalId: string
  phone: string
  email: string
}

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
      nationalId
    }
  }
`

export const NationalIdWithName: FC<FieldBaseProps> = ({ field }) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { setValue } = useFormContext()
  const [nationalIdField, setNationalIdField] = useState('')

  const [
    getIdentity,
    { loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IdentityQuery, {
    onCompleted: (data) => {
      setValue('spouse.name', data.identity?.name ?? '')
    },
  })

  useEffect(() => {
    if (nationalIdField.length === 10 && kennitala.isValid(nationalIdField)) {
      getIdentity({
        variables: {
          input: {
            nationalId: nationalIdField,
          },
        },
      })
    }
  }, [nationalIdField])

  return (
    <Box>
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={id}
            label="Kennitala"
            defaultValue={''}
            format="######-####"
            required
            backgroundColor="blue"
            onChange={(v) => setNationalIdField((v.target.value).replace(/\W/g, ''))}
            loading={queryLoading}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <InputController
            id={'spouse.name'}
            label="Nafn"
            error={
              queryError
                ? 'Villa kom upp við að sækja nafn út frá kennitölu.'
                : undefined
            }
            readOnly
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
