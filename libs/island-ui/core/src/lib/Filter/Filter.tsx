import React from 'react'
import { Dialog, DialogDisclosure, useDialogState } from 'reakit/Dialog'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import * as styles from './Filter.treat'

export interface FilterProps {
  /** Label for the clear button. Should be used for localization. */
  labelClear: string

  /** Lable for open filter button when in mobile version. */
  labelOpen: string

  /** Label for filter title when expanded in mobile version. */
  labelTitle: string

  /** Label for show result button in expanded mobile version. */
  labelResult: string

  /** Number of search results to display on the show result button. */
  resultCount: number

  /** Event handler for clear filter event. */
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
  const dialog = useDialogState()

  return (
    <>
      <Box display={['block', 'block', 'none']}>
        <DialogDisclosure {...dialog} className={styles.dialogDisclosure}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            background="white"
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
        </DialogDisclosure>
        <Dialog {...dialog}>
          <Box
            background="white"
            position="fixed"
            top={0}
            bottom={0}
            left={0}
            right={0}
            paddingX={3}
            paddingY={3}
            height="full"
            display="flex"
            justifyContent="spaceBetween"
            flexDirection="column"
            className={styles.dialogContainer}
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
                  onClick={dialog.hide}
                ></Button>
              </Box>
              {children}
            </Stack>

            <Box
              background="blue100"
              marginTop={2}
              paddingTop={4}
              paddingBottom={3}
            >
              <Stack space={2} dividers={false} align="center">
                <Button size="small" onClick={dialog.hide}>
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
          </Box>
        </Dialog>
      </Box>

      <Box display={['none', 'none', 'block']}>
        <Stack space={2} dividers={false}>
          {children}
        </Stack>
        <Box textAlign="right" paddingTop={2}>
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
    </>
  )
}
