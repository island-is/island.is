import React from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'

export interface FilterProps {
  /**
   * Label for the clear button.
   * Should be used for localization.
   */
  labelClear: string
  /**
   * Event handler for clear filter event.
   */
  onFilterClear: () => void
}

export const Filter: React.FC<FilterProps> = ({
  labelClear = '',
  onFilterClear,
  children,
}) => {
  return (
    <Box>
      <Stack space={2} dividers={false}>
        {children}
        <Box textAlign="right">
          <Button
            icon="reload"
            size="small"
            variant="text"
            onClick={() => onFilterClear()}
          >
            {labelClear}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
