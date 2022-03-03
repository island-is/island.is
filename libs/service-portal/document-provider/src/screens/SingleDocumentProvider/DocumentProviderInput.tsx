import React, { FC, useContext } from 'react'
import { Control,Controller } from 'react-hook-form'
import {
  Validate,
  ValidationRule,
  ValidationValueMessage,
} from 'react-hook-form/dist/types/form'

import { Box, Input, SkeletonLoader } from '@island.is/island-ui/core'

import { IsFetchingProviderOrganisationContext } from './SingleDocumentProvider'

type ControllerRules = Partial<{
  required: string | boolean | ValidationValueMessage<boolean>
  min: ValidationRule<React.ReactText>
  max: ValidationRule<React.ReactText>
  maxLength: ValidationRule<number>
  minLength: ValidationRule<number>
  pattern: ValidationRule<RegExp>
  validate: Validate
}>

interface Props {
  control: Control<Record<string, string>>
  name: string
  defaultValue: string
  hasError: boolean
  errorMessage: string
  label: string
  placeholder: string
  rules?: ControllerRules
}

export const DocumentProviderInput: FC<Props> = ({
  control,
  name,
  defaultValue,
  hasError,
  errorMessage,
  label,
  placeholder,
  rules,
}) => {
  const loading = useContext(IsFetchingProviderOrganisationContext)
  return (
    <Box marginBottom={2}>
      {loading ? (
        <SkeletonLoader borderRadius="large" height={62} />
      ) : (
        <Controller
          control={control}
          name={name}
          defaultValue={defaultValue}
          rules={rules}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              value={value}
              onChange={onChange}
              label={label}
              placeholder={placeholder}
              hasError={hasError}
              errorMessage={errorMessage}
              size="xs"
            />
          )}
        />
      )}
    </Box>
  )
}
