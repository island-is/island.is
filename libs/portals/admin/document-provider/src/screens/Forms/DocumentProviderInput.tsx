import React from 'react'
import { Box, Input, SkeletonLoader } from '@island.is/island-ui/core'
import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from 'react-hook-form'

interface Props<T extends FieldValues> {
  control: Control<T, string>
  name: Path<T>
  defaultValue: PathValue<T, Path<T>>
  hasError: boolean
  errorMessage: string
  label: string
  placeholder: string
  rules?: RegisterOptions<T, Path<T>>
  loading?: boolean
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
  loading,
}: Props<T>) => {
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
          render={({ field: { onChange, value, name, ref, onBlur } }) => (
            <Input
              name={name}
              value={value}
              onChange={onChange}
              label={label}
              placeholder={placeholder}
              hasError={hasError}
              errorMessage={errorMessage}
              onBlur={onBlur}
              ref={ref}
              size="xs"
            />
          )}
        />
      )}
    </Box>
  )
}
