import type { ChangeEvent } from 'react'

import { Box, Input, Stack, Text } from '@island.is/island-ui/core'

interface UnitInputProps {
  name: string
  label: string
  description?: string
  value?: string
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  inputMode?: 'decimal' | 'numeric'
}

export const UnitInput = ({
  name,
  label,
  description,
  value,
  onChange,
  inputMode,
}: UnitInputProps) => {
  return (
    <Stack space={1}>
      <Input
        name={name}
        size="sm"
        label={label}
        backgroundColor="blue"
        value={value}
        onChange={onChange}
        type="number"
        inputMode={inputMode}
      />
      {!!description && (
        <Box paddingLeft={1}>
          <Text variant="small">{description}</Text>
        </Box>
      )}
    </Stack>
  )
}
