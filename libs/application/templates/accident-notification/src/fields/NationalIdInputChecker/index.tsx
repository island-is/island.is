import { gql, useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import * as kennitala from 'kennitala'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { childInCustody, error as errorMessages } from '../../lib/messages'

interface NationalIdInputCheckerProps {
  field: {
    props: {
      inputId: string
      validationId: string
    }
  }
}

export const NationalIdInputChecker = ({
  errors,
  field,
}: FieldBaseProps & NationalIdInputCheckerProps) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const [nationIdError, setNationalIdError] = useState<string | undefined>(
    undefined,
  )

  const { inputId, validationId } = field.props

  const [getIdentity, { data, loading }] = useLazyQuery<Query>(
    gql`
      query Identity($input: IdentityInput!) {
        identity(input: $input) {
          nationalId
          type
          name
        }
      }
    `,
    {
      onError: (error) => {
        console.log('Did not manage to get identity. Error: ', error)
        // TODO: Uncomment if this works on prod
        // setNationalIdError(formatMessage(errorMessages.noPersonNationalId))
      },
      onCompleted: () => {
        console.log('Managed to get identity. Data: ', data)
        setNationalIdError(undefined)
      },
    },
  )

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (value.length === 10 && kennitala.isValid(value)) {
      if (kennitala.isCompany(value)) {
        setNationalIdError(formatMessage(errorMessages.companyHasNationalId))
      } else {
        getIdentity({ variables: { input: { nationalId: value } } })
      }
    }
  }

  return (
    <Box paddingTop={2}>
      <InputController
        id={inputId}
        name={inputId}
        label={formatMessage(childInCustody.labels.nationalId)}
        error={
          (errors &&
            getErrorViaPath(errors, inputId) &&
            formatMessage(errorMessages.validNationalId)) ||
          nationIdError
        }
        backgroundColor="blue"
        required
        format="######-####"
        onChange={(value) => requestDelegation(value)}
      />

      <input
        type="hidden"
        ref={register}
        name={validationId}
        value={nationIdError === undefined && !loading ? 'true' : ''}
      />
    </Box>
  )
}
