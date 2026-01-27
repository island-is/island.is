import React, { createContext, FC, ReactNode, useEffect, useState } from 'react'
import { Dialog, DialogDisclosure, useDialogState } from 'reakit/Dialog'
import { usePopoverState, Popover, PopoverDisclosure } from 'reakit/Popover'
import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { Inline } from '../Inline/Inline'
import { Stack } from '../Stack/Stack'
import { Text } from '../Text/Text'
import { usePreventBodyScroll } from './usePreventBodyScroll'

import * as styles from './Filter.css'
import { useWindowSize } from 'react-use'
import { FilterDrawerAriakit } from './FilterMobileDrawer'
import { theme } from '@island.is/island-ui/theme'

export interface FilterProps {
  /** Label for the clear all button. Should be used for localization. */
  labelClearAll: string

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

  /** Label for filter button in expanded mobile version */
  labelFilterBy?: string

  /** Number of search results to display on the show result button in mobile version*/
  resultCount?: number

  /** Number of filter values chosen */
  filterCount?: number

  /** Filter input component */
  filterInput?: ReactNode

  /** How the filter should be displayed */
  variant?: 'popover' | 'dialog' | 'default'

  /** Align popover button (and input if also applied) to the left or right */
  align?: 'left' | 'right'

  /** Event handler for clear filter event. */
  onFilterClear: () => void

  /** Swap input and filter button locations */
  reverse?: boolean

  /** Allow popover to flip upwards */
  popoverFlip?: boolean

  /** Mobile title  */
  title?: string

  /** Use the popover disclosure button styling */
  usePopoverDiscloureButtonStyling?: boolean

  /** Wrap filter input in a mobile version */
  mobileWrap?: boolean
}

/**
 * Datatype to use for Filter context.
 * Provides the Filter's childs access to shared values,
 * like the `isDialog` state without bloating the childs props.
 */
interface FilterContextValue {
  variant?: FilterProps['variant']
}

export const FilterContext = createContext<FilterContextValue>({
  variant: undefined,
})

export const Filter: FC<React.PropsWithChildren<FilterProps>> = ({
  labelClearAll,
  labelClear,
  labelOpen,
  labelClose,
  labelTitle,
  labelResult,
  labelFilterBy,
  resultCount = 0,
  filterCount = 0,
  align,
  variant = 'default',
  filterInput,
  onFilterClear,
  reverse,
  children,
  title,
  popoverFlip = true,
  mobileWrap = true,
  usePopoverDiscloureButtonStyling,
}) => {
  const dialog = useDialogState({ modal: true })
  const popover = usePopoverState({
    placement: 'bottom-start',
    unstable_flip: popoverFlip,
    gutter: 8,
  })

  const hasFilterInput = !!filterInput

  usePreventBodyScroll(dialog.visible && variant === 'dialog')

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm

  const filterInputContent = hasFilterInput ? filterInput : null
  const filterCountNumber = filterCount > 9 ? '9+' : filterCount

  const popoverContent = (component: boolean) => (
    <Box
      component={component ? Popover : undefined}
      background="white"
      borderRadius="large"
      boxShadow="subtle"
      className={styles.popoverContainer}
      {...popover}
    >
      <Stack space={4} dividers={false}>
        {children}
      </Stack>

      <Box
        display="flex"
        width="full"
        paddingX={3}
        paddingY={2}
        justifyContent="center"
        background="blue100"
      >
        <Button
          icon="reload"
          size="small"
          variant="text"
          onClick={onFilterClear}
        >
          {labelClearAll}
        </Button>
      </Box>
    </Box>
  )

  const popoverContainer = () => (
    <>
      <Box
        display="flex"
        width="full"
        justifyContent={align === 'right' ? 'flexEnd' : 'flexStart'}
      >
        <Inline
          space={2}
          reverse={reverse}
          alignY="bottom"
          flexWrap={mobileWrap ? 'wrap' : 'nowrap'}
        >
          <Box
            component={PopoverDisclosure}
            background="white"
            display="inlineBlock"
            borderRadius="large"
            tabIndex={-1}
            {...popover}
            className={filterCount ? styles.filterCountButton : undefined}
          >
            {filterCount ? (
              <Button
                as="span"
                variant="utility"
                icon={!filterCount ? 'filter' : undefined}
                fluid
                nowrap
              >
                {labelOpen}

                <Box
                  as="span"
                  background="blue400"
                  color="white"
                  className={styles.filterCount}
                >
                  <Text
                    variant="eyebrow"
                    color="white"
                    lineHeight={isMobile ? 'xl' : 'lg'}
                  >
                    {filterCountNumber}
                  </Text>
                </Box>
              </Button>
            ) : (
              <Button as="span" variant="utility" icon="filter" fluid nowrap>
                {labelOpen}
              </Button>
            )}
          </Box>
          {filterInputContent}
        </Inline>
      </Box>
      {popoverContent(true)}
    </>
  )

  const dialogContent = () => (
    <>
      <DialogDisclosure
        {...dialog}
        className={
          usePopoverDiscloureButtonStyling ? undefined : styles.dialogDisclosure
        }
      >
        {usePopoverDiscloureButtonStyling ? (
          <Box background="white" borderRadius="large">
            <Button
              unfocusable
              as="span"
              variant="utility"
              icon="filter"
              nowrap
            >
              {labelOpen}
            </Button>
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="spaceBetween"
            border="standard"
            borderColor="blue200"
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
              unfocusable
            />
          </Box>
        )}
      </DialogDisclosure>
      <Dialog {...dialog} preventBodyScroll={false}>
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
            <Box display="flex" justifyContent="spaceBetween" marginBottom={2}>
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
              />
            </Box>

            <Stack space={4} dividers={false}>
              {filterInputContent}
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
  )

  const defaultContent = () => (
    <>
      <Stack space={3} dividers={false}>
        {filterInputContent}
        {children}
      </Stack>

      <Box textAlign="right" paddingTop={2}>
        <Button
          icon="reload"
          size="small"
          variant="text"
          onClick={onFilterClear}
        >
          {labelClearAll}
        </Button>
      </Box>
    </>
  )

  if (isMobile) {
    return (
      <Box display="flex" alignItems="flexEnd">
        {filterInputContent}

        <FilterDrawerAriakit
          initialVisibility={false}
          ariaLabel={''}
          labelShowResult={labelResult}
          labelClearAll={labelClearAll}
          labelFilterBy={labelFilterBy}
          onFilterClear={onFilterClear}
          disclosure={
            <Box
              background="white"
              marginTop={'auto'}
              borderRadius="large"
              tabIndex={-1}
              marginLeft={2}
              className={filterCount ? styles.filterCountButton : undefined}
            >
              {filterCount ? (
                <Button
                  as="span"
                  variant="utility"
                  icon={!filterCount ? 'filter' : undefined}
                  fluid
                  nowrap
                >
                  {labelOpen}

                  <Box
                    as="span"
                    background="blue400"
                    color="white"
                    className={styles.filterCount}
                  >
                    <Text
                      variant="eyebrow"
                      textAlign="center"
                      color="white"
                      lineHeight={isMobile ? 'xl' : 'lg'}
                    >
                      {filterCountNumber}
                    </Text>
                  </Box>
                </Button>
              ) : (
                <Button as="span" variant="utility" icon="filter" fluid nowrap>
                  {labelOpen}
                </Button>
              )}
            </Box>
          }
        >
          <Box width="full" tabIndex={-1}>
            <Box className={styles.mobilePopoverContainer}>
              <Stack space={4} dividers={false}>
                {children}
              </Stack>
            </Box>
          </Box>
        </FilterDrawerAriakit>
      </Box>
    )
  }

  return (
    <FilterContext.Provider value={{ variant }}>
      {variant === 'popover' && popoverContainer()}
      {variant === 'dialog' && dialogContent()}
      {variant === 'default' && defaultContent()}
    </FilterContext.Provider>
  )
}
