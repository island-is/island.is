import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React, { useState } from 'react'
import { employer, error as errorMessage } from '../../lib/messages'
import { gql, useQuery } from '@apollo/client'
import kennitala from 'kennitala'
import { useFormContext } from 'react-hook-form'
import { FieldErrors, FieldValues } from 'react-hook-form/dist/types/form'

const GET_COMPANY_BY_NATIONAL_ID = gql`
  query getCompanyByNationalId($input: RskCompanyInfoInput!) {
    companyRegistryCompany(input: $input) {
      nationalId
      name
    }
  }
`

interface EmployerIdFieldProps extends FieldBaseProps {
  errors: FieldErrors<FieldValues>
}

export const EmployerIdField = ({
  application,
  errors,
}: EmployerIdFieldProps) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const correctedNationalId = getValueViaPath(
    application.answers,
    'correctedNationalId.id',
    '',
  )
  const [nationalId, setNationalId] = useState<string>(
    correctedNationalId || '',
  )
  const [validNationalId, setValidNationalId] = useState<string>(
    correctedNationalId || '',
  )

  const { loading, data, error: companyError } = useQuery(
    GET_COMPANY_BY_NATIONAL_ID,
    {
      variables: {
        input: {
          nationalId: kennitala.clean(validNationalId),
        },
      },
    },
  )

  let error

  if (errors?.correctedNationalId?.id) {
    error = errors?.correctedNationalId?.id
  } else if (data) {
    error = undefined
  } else if (companyError && validNationalId.length !== 0) {
    error = formatMessage(errorMessage.nationalIdIsNotCompany)
  }

  return (
    <Box marginTop={5}>
      <InputController
        id="correctedNationalId.id"
        label={formatText(
          employer.labels.employerNationalId,
          application,
          formatMessage,
        )}
        placeholder={formatText(
          employer.labels.employerNationalIdPlaceholder,
          application,
          formatMessage,
        )}
        error={error}
        backgroundColor="blue"
        required
        format="######-####"
        onChange={(value) => {
          setNationalId(value.target.value)
          if (kennitala.isValid(value.target.value)) {
            setValidNationalId(value.target.value)
          }
        }}
      />
      {loading && kennitala.isValid(nationalId) ? (
        <Box marginTop={4}>
          <LoadingDots large color="gradient" />
        </Box>
      ) : (
        <Text variant="h2" marginTop={2}>
          {!data ? '' : data.companyRegistryCompany?.name}
        </Text>
      )}
      <input
        type="hidden"
        value={data ? data.companyRegistryCompany?.name : ''}
        ref={register({ required: true })}
        name="correctedNationalId.name"
      />
    </Box>
  )
}
