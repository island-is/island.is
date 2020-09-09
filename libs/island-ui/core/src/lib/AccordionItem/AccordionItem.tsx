import React, { useContext, useState, ReactNode, forwardRef, FC } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'

import { Box } from '../Box/Box'
import { Column } from '../Column/Column'
import { Columns } from '../Columns/Columns'
import { AllOrNone } from '../private/AllOrNone'
import { useVirtualTouchable } from '../private/touchable/useVirtualTouchable'
import { hideFocusRingsClassName } from '../private/hideFocusRings/hideFocusRings'
import { Overlay } from '../private/Overlay/Overlay'
import * as styles from './AccordionItem.treat'
import { Typography } from '../Typography/Typography'
import { VariantTypes } from '../Typography/Typography.treat'
import { AccordionContext } from '../Accordion/Accordion'

type IconVariantTypes = 'default' | 'sidebar'

export type AccordionItemBaseProps = {
  id: string
  label: string
  labelVariant?: VariantTypes
  iconVariant?: IconVariantTypes
  visibleContent?: ReactNode
  children: ReactNode
  expanded?: boolean
  onClick?: () => void
  onBlur?: () => void
  onFocus?: () => void
}

export type AccordionItemStateProps = AllOrNone<{
  expanded?: boolean
  onToggle?: (expanded: boolean) => void
}>

export type AccordionItemProps = AccordionItemBaseProps &
  AccordionItemStateProps

export const AccordionItem = forwardRef<HTMLButtonElement, AccordionItemProps>(
  (
    {
      id,
      label,
      labelVariant = 'h5',
      iconVariant = 'default',
      visibleContent,
      expanded: expandedProp,
      onToggle,
      children,
      onClick,
      onBlur,
      onFocus,
    },
    forwardedRef,
  ) => {
    if (process.env.NODE_ENV !== 'production') {
      if (label !== undefined && typeof label !== 'string') {
        throw new Error('Label must be a string')
      }
    }

    const { toggledId, setToggledId } = useContext(AccordionContext)
    const [expandedFallback, setExpandedFallback] = useState(false)
    let expanded = expandedProp ?? expandedFallback
    const [height, setHeight] = useState(expanded ? 'auto' : 0)

    if (toggledId && toggledId !== id && expanded) {
      expanded = false

      if (height !== 0) {
        setHeight(0)
      }
    }

    return (
      <Box>
        <Box position="relative" display="flex">
          <Box
            ref={forwardedRef}
            component="button"
            cursor="pointer"
            className={[styles.button, useVirtualTouchable()]}
            outline="none"
            width="full"
            textAlign="left"
            aria-controls={id}
            aria-expanded={expanded}
            onFocus={onFocus}
            onBlur={onBlur}
            onClick={
              onClick
                ? onClick
                : () => {
                    const newValue = !expanded

                    if (typeof setToggledId === 'function' && newValue) {
                      setToggledId(id)
                    }

                    setHeight(newValue ? 'auto' : 0)

                    if (expandedProp === undefined) {
                      setExpandedFallback(newValue)
                    }

                    if (typeof onToggle === 'function') {
                      onToggle(newValue)
                    }
                  }
            }
          >
            <Columns space={2} alignY="center">
              <Column>
                <Typography variant={labelVariant} as="h3">
                  {label}
                </Typography>
              </Column>
              <Column width="content">
                <div
                  className={cn(
                    styles.plusIconWrap,
                    styles.iconWrapVariants[iconVariant],
                  )}
                >
                  <svg
                    className={cn(
                      styles.plusIcon,
                      styles.iconVariants[iconVariant],
                      {
                        [styles.plusIconActive]: expanded,
                      },
                    )}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4286 11.4286H18.5714C19.3571 11.4286 20 10.7857 20 9.99998C20 9.21427 19.3571 8.57141 18.5714 8.57141H11.4286H8.57143H1.42857C0.642857 8.57141 0 9.21427 0 9.99998C0 10.7857 0.642857 11.4286 1.42857 11.4286H8.57143H11.4286Z"
                      className={cn(styles.plusIconX, {
                        [styles.plusIconXActive]: expanded,
                      })}
                    />
                    <path
                      d="M8.57157 11.4286L8.57157 18.5714C8.57157 19.3571 9.21442 20 10.0001 20C10.7859 20 11.4287 19.3571 11.4287 18.5714L11.4287 11.4286L11.4287 8.57143L11.4287 1.42857C11.4287 0.642857 10.7859 -2.81002e-08 10.0001 -6.24449e-08C9.21442 -9.67895e-08 8.57157 0.642857 8.57157 1.42857L8.57157 8.57143L8.57157 11.4286Z"
                      className={styles.plusIconY}
                    />
                  </svg>
                </div>
              </Column>
            </Columns>
          </Box>
          <Overlay className={[styles.focusRing, hideFocusRingsClassName]} />
        </Box>
        {visibleContent && (
          <div className={styles.visibleContent}>
            <Typography variant="pSmall">{visibleContent}</Typography>
          </div>
        )}
        <AnimateHeight duration={300} height={height}>
          <Box paddingTop={2} id={id}>
            {children}
          </Box>
        </AnimateHeight>
      </Box>
    )
  },
)

type AlternateAccordionItemBaseProps = Omit<
  AccordionItemBaseProps,
  'labelVariant' | 'iconVariant'
>

export const AccordionCard: FC<AlternateAccordionItemBaseProps> = (props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <Box
      height="full"
      background="white"
      borderRadius="large"
      paddingX={[2, 2, 4]}
      paddingY={2}
      className={cn(styles.card, { [styles.focused]: isFocused })}
    >
      <AccordionItem {...props} onFocus={handleFocus} onBlur={handleBlur}>
        {props.children}
      </AccordionItem>
    </Box>
  )
}

export const SidebarAccordion: FC<AlternateAccordionItemBaseProps> = (
  props,
) => {
  return (
    <AccordionItem {...props} labelVariant="p" iconVariant="sidebar">
      {props.children}
    </AccordionItem>
  )
}
