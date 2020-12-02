import React from 'react'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'


export interface FilterProps {
  clearBtnLabel: string
}

export const Filter : React.FC<FilterProps> = ({
  clearBtnLabel = '',
  children
}) => {
  return (
    <Box>
      <Stack space={2} dividers={false}>
        {children}
        <Box textAlign="right">
          <Button
            // icon="reload"
            onClick={() => {

            }}
            variant="text"
          >
            {clearBtnLabel}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}