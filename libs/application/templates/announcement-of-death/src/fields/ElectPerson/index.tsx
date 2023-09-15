import React, { FC, useEffect } from 'react'
import { FieldErrors, FieldValues, useFormContext } from 'react-hook-form'
import * as kennitala from 'kennitala'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'
import { IDENTITY_QUERY } from '../../graphql'

interface ElectPersonFieldBaseProps extends FieldBaseProps {
  errors: FieldErrors<FieldValues>
}

const prefix = 'pickRole.electPerson'

const fieldNames = {
  roleConfirmation: `${prefix}.roleConfirmation`,
  electedPersonNationalId: `${prefix}.electedPersonNationalId`,
  lookupError: `${prefix}.lookupError`,
  electedPersonName: `${prefix}.electedPersonName`,
}

export const ElectPerson: FC<
  React.PropsWithChildren<ElectPersonFieldBaseProps>
> = ({ application }) => {
  const { formatMessage } = useLocale()
  const {
    setValue,
    watch,
    clearErrors,
    setError,

    formState: { errors },
  } = useFormContext()
  const [getIdentity, { loading: queryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IDENTITY_QUERY, {
    onError: (error: unknown) => {
      setError(fieldNames.lookupError, {
        type: 'serverError',
        message: m.errorNationalIdNoName.defaultMessage,
      })
      console.log('getIdentity error:', error)
    },
    onCompleted: (data) => {
      if (data.identity?.name) {
        clearErrors(fieldNames.lookupError)
        clearErrors(fieldNames.electedPersonName)
        setValue(fieldNames.electedPersonName, data.identity?.name ?? '')
      } else {
        setError(fieldNames.lookupError, {
          type: 'serverError',
          message: m.errorNationalIdNoName.defaultMessage,
        })
      }
    },
  })

  // Clear inital errors on mount
  useEffect(() => {
    clearErrors()
  }, [])

  const electedPersonNationalId: string = watch(
    fieldNames.electedPersonNationalId,
  )
  const electedPersonName: string = watch(fieldNames.electedPersonName)

  useEffect(() => {
    if (electedPersonNationalId?.length === 10) {
      const isValidSSN = kennitala.isPerson(electedPersonNationalId)
      if (isValidSSN) {
        getIdentity({
          variables: {
            input: {
              nationalId: electedPersonNationalId,
            },
          },
        })
      } else if (electedPersonName !== '') {
        setValue(fieldNames.electedPersonName, '')
      }
    } else if (electedPersonName !== '') {
      setValue(fieldNames.electedPersonName, '')
    }
  }, [electedPersonName, electedPersonNationalId, getIdentity, setValue])

  return (
    <Box marginTop={5}>
      <Text>
        {formatText(m.delegateRoleDisclaimer, application, formatMessage)}
      </Text>
      <GridRow marginBottom={2} marginTop={2}>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.electedPersonNationalId}
            name={fieldNames.electedPersonNationalId}
            label={formatText(m.delegateRoleSSN, application, formatMessage)}
            format="######-####"
            defaultValue=""
            backgroundColor="blue"
            icon={electedPersonName ? 'checkmarkCircle' : undefined}
            loading={queryLoading}
            error={
              getErrorViaPath(
                errors,
                'pickRole.electPerson.lookupError.message',
              ) ||
              getErrorViaPath(
                errors,
                'pickRole.electPerson.electedPersonNationalId',
              ) ||
              undefined
            }
          />
        </GridColumn>
        <GridColumn span="6/12">
          <InputController
            id={fieldNames.electedPersonName}
            name={fieldNames.electedPersonName}
            label={formatText(m.delegateRoleName, application, formatMessage)}
            readOnly
            defaultValue=""
          />
        </GridColumn>
      </GridRow>
    </Box>
  )
}
