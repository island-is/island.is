import React from 'react'
import { Box, Input, SkeletonLoader } from '@island.is/island-ui/core'
import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form'
import {
  Validate,
  ValidationRule,
  ValidationValueMessage,
} from 'react-hook-form/dist/types/validator'

type ControllerRules = Partial<{
  required: string | boolean | ValidationValueMessage<boolean>
  min: ValidationRule<React.ReactText>
  max: ValidationRule<React.ReactText>
  maxLength: ValidationRule<number>
  minLength: ValidationRule<number>
  pattern: ValidationRule<RegExp>
  validate: Validate<string, FieldValues>
}>

interface Props<T extends FieldValues> {
  control: Control<T, string>
  name: Path<T>
  defaultValue: PathValue<T, Path<T>>
  hasError: boolean
  errorMessage: string
  label: string
  placeholder: string
  rules?: ControllerRules
}

export const DocumentProviderInput = <T extends FieldValues = FieldValues>({
  control,
  name,
  defaultValue,
  hasError,
  errorMessage,
  label,
  placeholder,
  rules,
}: Props<T>) => {
  const loading = false
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
          render={({ field: { onChange, value, name } }) => (
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
