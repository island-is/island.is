import { gql, useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { FieldBaseProps, getErrorViaPath } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import * as kennitala from 'kennitala'
import React, { useState } from 'react'

export const NationalIdChecker = ({ application, errors }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const [name, setName] = useState('')

  const [getIdentity, { data, loading: queryLoading }] = useLazyQuery<Query>(
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
        console.log(error)
      },
    },
  )

  console.log(name, data)

  const requestDelegation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value.replace('-', '').trim()
    if (value.length === 10 && kennitala.isValid(value)) {
      if (kennitala.isCompany(value)) {
        setName(value)
      } else {
        getIdentity({ variables: { input: { nationalId: value } } })
      }
    } else {
      setName('')
    }
  }

  return (
    <Box>
      <InputController
        id="employer.correctedNationalId"
        name="employer.correctedNationalId"
        label="hello"
        error={
          errors && getErrorViaPath(errors, 'employer.correctedNationalId')
        }
        backgroundColor="blue"
        required
        format="######-####"
        onChange={(value) => requestDelegation(value)}
      />
    </Box>
  )
}
