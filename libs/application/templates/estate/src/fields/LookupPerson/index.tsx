import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import * as nationalId from 'kennitala'
import {
  AlertMessage,
  Box,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql'

type LookupProps = {
  field: {
    id: string
    props?: {
      requiredNationalId?: boolean
      alertWhenUnder18?: boolean
    }
  }
  error: Record<string, string> | any
}

export const LookupPerson: FC<React.PropsWithChildren<LookupProps>> = ({
  field,
  error,
}) => {
  const { formatMessage } = useLocale()
  const { id, props } = field
  const { setValue, watch, clearErrors } = useFormContext()

  const personNationalId: string = watch(`${id}.nationalId`)
  const personName: string = watch(`${id}.name`)

  const [getIdentity, { loading: queryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IDENTITY_QUERY, {
    onCompleted: (data) => {
      setValue(`${id}.name`, data.identity?.name ?? '')
      clearErrors(`${id}.name`)
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
      clearErrors(`${id}.nationalId`)
      setValue(`${id}.name`, '')
    }
  }, [personName, personNationalId, getIdentity, setValue, clearErrors, id])

  return (
    <Box>
      <GridRow>
        {props?.alertWhenUnder18 && nationalId.info(personNationalId).age < 18 && (
          <GridColumn span={['1/1']} paddingBottom={3}>
            <AlertMessage
              type="warning"
              message={formatMessage(m.inheritanceUnder18Error)}
            />
          </GridColumn>
        )}
        <GridColumn span="6/12">
          <InputController
            id={`${id}.nationalId`}
            name={`${id}.nationalId`}
            label={formatMessage(m.nationalId)}
            format="######-####"
            backgroundColor="blue"
            loading={queryLoading}
            required={props?.requiredNationalId ?? true}
            error={error?.nationalId || error?.name}
          />
        </GridColumn>
        <GridColumn span="6/12">
          <InputController
            id={`${id}.name`}
            name={`${id}.name`}
            label={formatMessage(m.name)}
            readOnly
            error={error?.name ? error?.name : undefined}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
