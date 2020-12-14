import React, { useState } from 'react'
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
   * Lable for open filter button
   * when in mobile version
   */
  labelOpen: string
  /**
   * Label for filter title when expanded
   * in mobile version.
   */
  labelTitle: string

  /**
   * Label for show result button in
   * expanded mobile version.
   */
  labelResult: string

  /**
   * Number of search results
   */
  resultCount: number
  /**
   * Event handler for clear filter event.
   */
  onFilterClear: () => void
}

export const Filter: React.FC<FilterProps> = ({
  labelClear = '',
  labelOpen = '',
  labelTitle = '',
  labelResult = '',
  resultCount = 0,
  onFilterClear,
  children,
}) => {
  const [expanded, setExpanded] = useState(false)

  const handleToggle = () => {
    setExpanded(!expanded)
  }

  return (
    <Box>
      <Box
        display={[
          expanded ? 'none' : 'flex',
          expanded ? 'none' : 'flex',
          'none',
        ]}
        justifyContent="spaceBetween"
        background="white"
        onClick={handleToggle}
        padding={2}
        borderRadius="large"
      >
        <Text variant="h5" as="h5">
          {labelOpen}
        </Text>
        <Button
          circle
          size="small"
          colorScheme="light"
          icon="menu"
          iconType="outline"
        ></Button>
      </Box>
      <Box
        display={[
          expanded ? 'block' : 'none',
          expanded ? 'block' : 'none',
          'none',
        ]}
        background="white"
        position="relative"
        top={0}
        bottom={0}
        left={0}
        right={0}
        paddingX={3}
        paddingTop={3}
        paddingBottom={3}
      >
        <Stack space={2} dividers={false}>
          <Box display="flex" justifyContent="spaceBetween">
            <Text variant="h4" color="blue600">
              {labelTitle}
            </Text>
            <Button
              circle
              colorScheme="light"
              icon="close"
              iconType="outline"
              onClick={handleToggle}
            ></Button>
          </Box>
          {children}
        </Stack>
      </Box>

      <Box
        display={[
          expanded ? 'block' : 'none',
          expanded ? 'block' : 'none',
          'none',
        ]}
        background="blue100"
        paddingTop={4}
        paddingBottom={3}
      >
        <Stack space={2} dividers={false} align="center">
          <Button size="small">
            {labelResult} ({resultCount})
          </Button>
          <Button
            icon="reload"
            size="small"
            variant="text"
            onClick={() => onFilterClear()}
          >
            {labelClear}
          </Button>
        </Stack>
      </Box>

      <Box display={['none', 'none', 'block']}>
        <Stack space={2} dividers={false}>
          {children}
        </Stack>
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
      </Box>
    </Box>
  )
}
