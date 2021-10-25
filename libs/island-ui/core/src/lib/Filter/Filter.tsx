import React, { createContext, FC } from 'react'
import { Dialog, DialogDisclosure, useDialogState } from 'reakit/Dialog'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import * as styles from './Filter.css'

export interface FilterProps {
  /** Label for the clear button. Should be used for localization. */
  labelClear: string

  /** Lable for open filter button when in mobile version. */
  labelOpen: string

  /** Label for close icon to add title to button for screen readers in mobile version. */
  labelClose?: string

  /** Label for filter title when expanded in mobile version. */
  labelTitle?: string

  /** Label for show result button in expanded mobile version. */
  labelResult?: string

  /** Number of search results to display on the show result button in mobile version*/
  resultCount?: number

  /** Controls if the Filter renders as desktop like sidenavbar or mobile dialog */
  isDialog?: boolean

  /** Event handler for clear filter event. */
  onFilterClear: () => void
}

/**
 * Datatype to use for Filter context.
 * Provides the Filter's childs access to shared values,
 * like the `isDialog` state with out bloating the childs props.
 */
interface FilterContextValue {
  isDialog: boolean
}

export const FilterContext = createContext<FilterContextValue>({
  isDialog: false,
})

export const Filter: FC<FilterProps> = ({
  labelClear = '',
  labelOpen = '',
  labelClose = '',
  labelTitle = '',
  labelResult = '',
  resultCount = 0,
  isDialog = false,
  onFilterClear,
  children,
}) => {
  const dialog = useDialogState()

  return (
    <FilterContext.Provider value={{ isDialog }}>
      {isDialog ? (
        <>
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
                title={labelOpen}
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
              <Box>
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  marginBottom={2}
                >
                  <Text variant="h4" color="blue600">
                    {labelTitle}
                  </Text>
                  <Button
                    circle
                    colorScheme="light"
                    icon="close"
                    iconType="outline"
                    onClick={dialog.hide}
                    title={labelClose}
                  ></Button>
                </Box>

                <Stack space={4} dividers={false}>
                  {children}
                </Stack>
              </Box>

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
                    onClick={onFilterClear}
                  >
                    {labelClear}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>
        </>
      ) : (
        <>
          <Stack space={3} dividers={false}>
            {children}
          </Stack>

          <Box textAlign="right" paddingTop={2}>
            <Button
              icon="reload"
              size="small"
              variant="text"
              onClick={onFilterClear}
            >
              {labelClear}
            </Button>
          </Box>
        </>
      )}
    </FilterContext.Provider>
  )
}
