import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { CustomField, FieldBaseProps } from '@island.is/application/core'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  GetUserCompaniesQuery,
  GetUserCompaniesResponse,
} from './getUserCompaniesQuery'

interface Props extends FieldBaseProps {
  field: CustomField
}

export const UserCompaniesField: FC<Props> = ({ error, field }) => {
  const { clearErrors, register } = useFormContext()
  const { id, title } = field
  const { data, loading } = useQuery<GetUserCompaniesResponse>(
    GetUserCompaniesQuery,
  )
  console.log('the data', data)

  return (
    <>
      <Box paddingTop={2}>
        <Controller
          name={`${id}`}
          defaultValue=""
          render={({ value, onChange }) => {
            return (
              <Input
                key={title.toString()}
                value={value}
                onChange={onChange}
                name={id}
                label={title.toString()}
              />
            )
          }}
        />
        {(data?.rskGetCurrentUserCompanies ?? []).map((company) => (
          <Text>{company.Kennitala}</Text>
        ))}
      </Box>
      {error && (
        <Box color="red400" padding={2}>
          <Text color="red400">{error}</Text>
        </Box>
      )}
    </>
  )
}
