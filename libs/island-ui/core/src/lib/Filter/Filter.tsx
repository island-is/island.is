import React from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'

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
      <Box
        display={['block', 'block', 'none']}
        background="white"
        position="relative"
        top={0}
        bottom={0}
        left={0}
        right={0}
        paddingX={3}
        paddingTop={3}
      >
        <Box display="flex" justifyContent="spaceBetween">
          <Text variant="h4" color="blue600">
            Sía API vörulista
          </Text>
          <Button circle colorScheme="light" icon="close"></Button>
        </Box>
      </Box>
      <Box display={['none', 'none', 'block']}>
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
    </Box>
  )
}
