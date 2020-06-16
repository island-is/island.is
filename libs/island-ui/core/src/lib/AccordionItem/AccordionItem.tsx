import React, { useContext, useState, ReactNode, forwardRef, FC } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'
import { Box, Columns, Column } from '../../'
import { AllOrNone } from '../private/AllOrNone'
import { useVirtualTouchable } from '../private/touchable/useVirtualTouchable'
import { hideFocusRingsClassName } from '../private/hideFocusRings/hideFocusRings'
import { Overlay } from '../private/Overlay/Overlay'
import * as styles from './AccordionItem.treat'
import { Typography } from '../Typography/Typography'
import { VariantTypes } from '../Typography/Typography.treat'
import { AccordionContext } from '../Accordion/Accordion'

export type AccordionItemBaseProps = {
  id: string
  label: string
  labelVariant?: VariantTypes
  visibleContent?: ReactNode
  children: ReactNode
  onClick?: () => void
  onBlur?: () => void
  onFocus?: () => void
}

export type AccordionItemStateProps = AllOrNone<{
  expanded?: boolean
  onToggle: (expanded: boolean) => void
}>

export type AccordionItemProps = AccordionItemBaseProps &
  AccordionItemStateProps

// TODO: Get icon from icon component...
const IconPlus = ({ color = '#0061FF' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    fill="none"
    viewBox="0 0 21 21"
  >
    <path
      fill={color}
      d="M19.071 11.929H11.93v7.142c0 .786-.643 1.429-1.429 1.429a1.433 1.433 0 01-1.429-1.429V11.93H1.93A1.433 1.433 0 01.5 10.5c0-.786.643-1.429 1.429-1.429H9.07V1.93C9.071 1.143 9.714.5 10.5.5s1.429.643 1.429 1.429V9.07h7.142c.786 0 1.429.643 1.429 1.429s-.643 1.429-1.429 1.429z"
    ></path>
  </svg>
)

export const AccordionItem = forwardRef<HTMLButtonElement, AccordionItemProps>(
  (
    {
      id,
      label,
      labelVariant = 'h3',
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
                  className={cn(styles.icon, {
                    [styles.iconTilted]: expanded,
                  })}
                >
                  <IconPlus />
                </div>
              </Column>
            </Columns>
          </Box>
          <Overlay className={[styles.focusRing, hideFocusRingsClassName]} />
        </Box>
        {visibleContent && visibleContent}
        <AnimateHeight duration={300} height={height}>
          <Box paddingTop={2} id={id}>
            {children}
          </Box>
        </AnimateHeight>
      </Box>
    )
  },
)

export const AccordionCard: FC<AccordionItemBaseProps> = (props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <Box
      height="full"
      background="white"
      borderRadius="standard"
      padding={[2, 2, 4]}
      className={cn(styles.card, { [styles.focused]: isFocused })}
    >
      <AccordionItem {...props} onFocus={handleFocus} onBlur={handleBlur}>
        {props.children}
      </AccordionItem>
    </Box>
  )
}
