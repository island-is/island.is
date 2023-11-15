import React, {
  useContext,
  useState,
  ReactNode,
  forwardRef,
  useEffect,
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
import { TextVariants } from '../../Text/Text.css'
import { AccordionContext } from '../Accordion'
import { Icon } from '../../IconRC/Icon'
import * as styles from './AccordionItem.css'

type IconVariantTypes = 'default' | 'small' | 'sidebar'
type ColorVariants = 'blue' | 'red'

export type AccordionItemLabelTags = 'p' | 'h2' | 'h3' | 'h4' | 'h5'

type BaseProps = {
  id: string
  label: ReactNode
  labelVariant?: TextVariants
  labelUse?: AccordionItemLabelTags
  labelColor?: Colors
  iconVariant?: IconVariantTypes
  visibleContent?: ReactNode
  children: ReactNode
  onBlur?: () => void
  onFocus?: () => void
  colorVariant?: ColorVariants
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
      labelVariant = 'h4',
      labelUse = 'h3',
      labelColor = 'currentColor',
      iconVariant = 'default',
      visibleContent,
      expanded: expandedProp,
      onToggle,
      children,
      startExpanded,
      onClick,
      onBlur,
      onFocus,
      colorVariant,
    },
    forwardedRef,
  ) => {
    const { toggledId, setToggledId } = useContext(AccordionContext)
    const [expandedFallback, setExpandedFallback] = useState(false)
    let expanded = expandedProp ?? expandedFallback
    const [height, setHeight] = useState<Height>(expanded ? 'auto' : 0)

    if (toggledId && toggledId !== id && expanded) {
      expanded = false

      if (height !== 0) {
        setHeight(0)
      }
    }

    const handleToggle = () => {
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

    const plusColor = colorVariant
      ? colorVariant
      : iconVariant === 'sidebar'
      ? 'purple'
      : 'blue'

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
                        iconVariant,
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
                        size={iconVariant === 'default' ? 'large' : 'small'}
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
                        size={iconVariant === 'default' ? 'large' : 'small'}
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

export type AccordionCardProps = AccordionItemProps & TestSupport

export const AccordionCard = ({ dataTestId, ...props }: AccordionCardProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <Box
      height="full"
      background="white"
      borderRadius="large"
      className={cn(styles.card({ color: props.colorVariant }), {
        [styles.focused]: isFocused,
      })}
      padding={[2, 2, 4]}
      dataTestId={dataTestId}
    >
      <AccordionItem {...props} onFocus={handleFocus} onBlur={handleBlur}>
        {props.children}
      </AccordionItem>
    </Box>
  )
}

// ---------------------------------------------------------------------------

export type SidebarAccordionProps = Omit<
  BaseProps,
  'labelVariant' | 'iconVariant'
> &
  StateProps

export const SidebarAccordion = (props: SidebarAccordionProps) => {
  return (
    <AccordionItem {...props} labelVariant="default" iconVariant="sidebar">
      {props.children}
    </AccordionItem>
  )
}
