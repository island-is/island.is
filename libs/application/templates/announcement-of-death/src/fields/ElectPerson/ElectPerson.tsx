import React, { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'
import * as kennitala from 'kennitala'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { gql, useLazyQuery } from '@apollo/client'
import { IdentityInput, Query } from '@island.is/api/schema'

const IdentityQuery = gql`
  query IdentityQuery($input: IdentityInput!) {
    identity(input: $input) {
      name
    }
  }
`
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

const ElectPerson: FC<ElectPersonFieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { setValue, watch, errors, clearErrors, setError } = useFormContext()

  const [getIdentity, { loading: queryLoading }] = useLazyQuery<
    Query,
    { input: IdentityInput }
  >(IdentityQuery, {
    onError: (error: unknown) => {
      setError(fieldNames.lookupError, {
        type: 'serverError',
        message:
          'Villa kom upp við að sækja nafn útfrá kennitölu. Vinsamlegast prófaðu aftur síðar',
      })
      console.log('getIdentity error:', error)
    },
    onCompleted: (data) => {
      if (data.identity?.name) {
        clearErrors(fieldNames.lookupError)
        setValue(fieldNames.electedPersonName, data.identity?.name ?? '')
      }
    },
  })

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
              errors?.pickRole?.electPerson?.lookupError?.message ||
              errors?.pickRole?.electPerson?.electedPersonNationalId ||
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

export { ElectPerson }
