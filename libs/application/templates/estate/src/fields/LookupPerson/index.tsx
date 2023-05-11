import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import * as nationalId from 'kennitala'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql'

export const LookupPerson: FC<FieldBaseProps> = ({ field, error }) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { setValue, watch, clearErrors } = useFormContext()

  const personNationalId: string = watch(`${id}.nationalId`)
  const personName: string = watch(`${id}.name`)
  const e = error as Record<string, string> | undefined

  const [
    getIdentity,
    { loading: queryLoading, error: queryError },
  ] = useLazyQuery<Query, { input: IdentityInput }>(IDENTITY_QUERY, {
    onCompleted: (data) => {
      setValue(`${id}.name`, data.identity?.name ?? '')
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (personNationalId?.length === 10) {
      const isValidSSN = nationalId.isPerson(personNationalId)
      if (isValidSSN) {
        getIdentity({
          variables: {
            input: {
              nationalId: personNationalId,
            },
          },
        })
      }
    } else if (personNationalId?.length === 0) {
      clearErrors(`${id}.name`)
    }
  }, [personName, personNationalId, getIdentity, setValue])

  return (
    <Box>
      <GridRow>
        <GridColumn span="6/12">
          <InputController
            id={`${id}.nationalId`}
            name={`${id}.nationalId`}
            label={formatMessage(m.nationalId)}
            format="######-####"
            defaultValue=""
            backgroundColor="blue"
            loading={queryLoading}
            error={
              queryError ? e?.name : e?.nationalId ? e?.nationalId : undefined
            }
          />
        </GridColumn>
        <GridColumn span="6/12">
          <InputController
            id={`${id}.name`}
            name={`${id}.name`}
            label={formatMessage(m.name)}
            readOnly
            defaultValue=""
            error={e?.name ? e?.name : undefined}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
