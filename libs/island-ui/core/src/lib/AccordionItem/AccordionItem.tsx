import React, { useContext, useState, ReactNode, forwardRef, FC } from 'react'
import cn from 'classnames'
import AnimateHeight from 'react-animate-height'

import { Box } from '../Box/Box'
import { Column } from '../Column/Column'
import { Columns } from '../Columns/Columns'
import { Icon } from '../Icon/Icon'
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

export const AccordionItem = forwardRef<HTMLButtonElement, AccordionItemProps>(
  (
    {
      id,
      label,
      labelVariant = 'h3',
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
                  className={cn(styles.icon, styles.iconVariants[iconVariant], {
                    [styles.iconTilted]: expanded,
                  })}
                >
                  <Icon
                    type="plus"
                    width={iconVariant === 'default' ? 21 : 12}
                    color={iconVariant === 'default' ? 'blue400' : 'purple400'}
                  />
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

export const SidebarAccordion: FC<AlternateAccordionItemBaseProps> = (
  props,
) => {
  return (
    <AccordionItem {...props} labelVariant="p" iconVariant="sidebar">
      {props.children}
    </AccordionItem>
  )
}
