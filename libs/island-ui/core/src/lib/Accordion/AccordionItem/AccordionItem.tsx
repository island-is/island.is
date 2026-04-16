import React, {
  useContext,
  useState,
  ReactNode,
  forwardRef,
  useEffect,
  useCallback,
} from 'react'
import cn from 'classnames'
import AnimateHeight, { Height } from 'react-animate-height'

import { TestSupport } from '@island.is/island-ui/utils'
import { Colors } from '@island.is/island-ui/theme'

import { Box } from '../../Box/Box'
import { Column } from '../../Column/Column'
import { Columns } from '../../Columns/Columns'
import { useVirtualTouchable } from '../../private/touchable/useVirtualTouchable'
import { hideFocusRingsClassName } from '../../private/hideFocusRings/hideFocusRings'
import { Overlay } from '../../private/Overlay/Overlay'
import { Text } from '../../Text/Text'
import { AccordionContext } from '../Accordion'
import { Icon } from '../../IconRC/Icon'
import * as styles from './AccordionItem.css'

type ColorVariants = 'blue' | 'red'

export type AccordionItemLabelTags = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'div'

type BaseProps = {
  id: string
  label: ReactNode
  labelUse?: AccordionItemLabelTags
  labelColor?: Colors
  visibleContent?: ReactNode
  children: ReactNode
  onBlur?: () => void
  onFocus?: () => void
  colorVariant?: ColorVariants
  variant?: 'mini' | 'small' | 'large'
  sidebar?: boolean
}

type StateProps =
  | {
      expanded: boolean
      onToggle: (expanded: boolean) => void
      startExpanded?: never
      onClick?: never
    }
  | {
      expanded?: never
      onToggle?: never
      startExpanded?: boolean
      onClick?: () => void
    }

// ---------------------------------------------------------------------------

export type AccordionItemProps = BaseProps & StateProps

export const AccordionItem = forwardRef<HTMLButtonElement, AccordionItemProps>(
  (
    {
      id,
      label,
      labelUse = 'h3',
      labelColor = 'currentColor',
      visibleContent,
      expanded: expandedProp,
      onToggle,
      children,
      startExpanded,
      onClick,
      onBlur,
      onFocus,
      colorVariant,
      variant: variantProp,
      sidebar,
    },
    forwardedRef,
  ) => {
    const {
      registerForSingleExpand,
      notifyExpanded,
      variant: contextVariant,
    } = useContext(AccordionContext)
    const accordionVariant = variantProp ?? contextVariant
    const isMini = accordionVariant === 'mini'
    const labelVariant = isMini
      ? 'h5'
      : accordionVariant === 'large'
      ? 'h3'
      : 'h4'
    const [expandedFallback, setExpandedFallback] = useState(false)
    const expanded = expandedProp ?? expandedFallback
    const [height, setHeight] = useState<Height>(expanded ? 'auto' : 0)

    // When this item should be collapsed by singleExpand, the Accordion calls
    // this directly — no context state change, so only this item re-renders.
    const collapseForSingleExpand = useCallback(() => {
      if (expandedProp !== undefined) {
        onToggle?.(false)
      } else {
        setExpandedFallback(false)
        setHeight(0)
      }
    }, [expandedProp, onToggle])

    useEffect(() => {
      return registerForSingleExpand?.(id, collapseForSingleExpand)
    }, [id, registerForSingleExpand, collapseForSingleExpand])

    const handleToggle = () => {
      const newValue = !expanded

      if (newValue) {
        notifyExpanded?.(id)
      }

      setHeight(newValue ? 'auto' : 0)

      if (expandedProp === undefined) {
        setExpandedFallback(newValue)
      }

      if (typeof onToggle === 'function') {
        onToggle(newValue)
      }
    }

    // Sync height when expandedProp changes in controlled mode
    useEffect(() => {
      setHeight(expanded ? 'auto' : 0)
    }, [expanded])

    useEffect(
      () => {
        if (startExpanded && expandedProp == null) {
          handleToggle()
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [], // Only run when component mounts!
    )

    const plusColor = colorVariant ? colorVariant : sidebar ? 'purple' : 'blue'

    return (
      <Box>
        <Box position="relative" display="flex">
          <Box component={labelUse} width="full" display="flex">
            <Box
              ref={forwardedRef}
              component="button"
              type="button"
              cursor="pointer"
              className={[styles.button, useVirtualTouchable()]}
              outline="none"
              width="full"
              textAlign="left"
              aria-controls={id}
              aria-expanded={expanded}
              onFocus={onFocus}
              onBlur={onBlur}
              onClick={onClick ? onClick : handleToggle}
            >
              <Columns space={2} alignY="center" as="span">
                <Column>
                  <Box
                    component="span"
                    height="full"
                    width="full"
                    display="flex"
                    alignItems="center"
                  >
                    {typeof label === 'string' ? (
                      <Text variant={labelVariant} as="span" color={labelColor}>
                        {label}
                      </Text>
                    ) : (
                      label
                    )}
                  </Box>
                  {visibleContent && (
                    <Box paddingTop={2}>
                      <Text>{visibleContent}</Text>
                    </Box>
                  )}
                </Column>
                <Column width="content">
                  <span
                    className={cn(
                      styles.iconWrap,
                      styles.plusIconWrap({
                        mini: isMini,
                        color: plusColor,
                      }),
                    )}
                  >
                    <span
                      className={cn(styles.icon, styles.removeIcon, {
                        [styles.showRemoveIcon]: expanded,
                      })}
                    >
                      <Icon
                        icon="remove"
                        size={isMini ? 'small' : 'medium'}
                        color="currentColor"
                      />
                    </span>
                    <span
                      className={cn(styles.icon, styles.addIcon, {
                        [styles.hideAddIcon]: expanded,
                      })}
                    >
                      <Icon
                        icon="add"
                        size={isMini ? 'small' : 'medium'}
                        color="currentColor"
                      />
                    </span>
                  </span>
                </Column>
              </Columns>
            </Box>
          </Box>
          <Overlay className={[styles.focusRing, hideFocusRingsClassName]} />
        </Box>
        <AnimateHeight duration={300} height={height}>
          <Box id={id} paddingTop={2}>
            {children}
          </Box>
        </AnimateHeight>
      </Box>
    )
  },
)

// ---------------------------------------------------------------------------

type AccordionCardVariant = {
  variant?: 'small' | 'large'
}

export type AccordionCardProps = AccordionItemProps &
  TestSupport &
  AccordionCardVariant

export const AccordionCard = ({
  dataTestId,
  variant = 'large',
  ...props
}: AccordionCardProps) => {
  return (
    <Box
      height="full"
      background="white"
      borderRadius="large"
      className={styles.card({ color: props.colorVariant })}
      padding={[2, 2, 4]}
      dataTestId={dataTestId}
    >
      <AccordionItem {...props} variant={variant}>
        {props.children}
      </AccordionItem>
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type SidebarAccordionProps = BaseProps & StateProps

export const SidebarAccordion = (props: SidebarAccordionProps) => {
  return (
    <AccordionItem {...props} variant="mini" sidebar>
      {props.children}
    </AccordionItem>
  )
}
