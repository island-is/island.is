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
import {
  IdentityInput,
  GetRegistryPersonInput,
  Query,
} from '@island.is/api/schema'
import { DECEASED_IDENITY_QUERY, IDENTITY_QUERY } from '../../graphql'
import { LookupProps } from '../../types'

export const LookupPerson: FC<React.PropsWithChildren<LookupProps>> = ({
  field,
  error,
  message,
  nested = false,
}) => {
  const { formatMessage } = useLocale()
  const { id, props } = field
  const { setValue, watch, clearErrors } = useFormContext()

  const personNationalId: string = watch(`${id}.nationalId`)
  const personName: string = watch(`${id}.name`)

  const [getDeceased, { loading: deceasedQueryLoading }] = useLazyQuery<
    Query,
    { input: GetRegistryPersonInput }
  >(DECEASED_IDENITY_QUERY, {
    onCompleted: (data) => {
      setValue(`${id}.name`, data.syslumennGetRegistryPerson?.name ?? '')
      clearErrors(`${id}.name`)
    },
    fetchPolicy: 'network-only',
  })

  const [getIdentity, { loading: identityQueryLoading }] = useLazyQuery<
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
        if (props?.useDeceasedRegistry) {
          getDeceased({
            variables: {
              input: {
                nationalId: personNationalId,
              },
            },
          })
        } else {
          getIdentity({
            variables: {
              input: {
                nationalId: personNationalId,
              },
            },
          })
        }
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
              message={
                message ? message : formatMessage(m.inheritanceUnder18Error)
              }
            />
          </GridColumn>
        )}
        <GridColumn span={nested ? ['1/1', '1/2'] : '6/12'}>
          <InputController
            id={`${id}.nationalId`}
            name={`${id}.nationalId`}
            label={formatMessage(m.nationalId)}
            format="######-####"
            backgroundColor="blue"
            loading={identityQueryLoading || deceasedQueryLoading}
            size={nested ? 'sm' : 'md'}
            required={props?.requiredNationalId ?? true}
            error={error?.nationalId || error?.name}
          />
        </GridColumn>
        <GridColumn span={nested ? ['1/1', '1/2'] : '6/12'}>
          <InputController
            id={`${id}.name`}
            name={`${id}.name`}
            label={formatMessage(m.name)}
            readOnly
            size={nested ? 'sm' : 'md'}
            error={error?.name ? error?.name : undefined}
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
