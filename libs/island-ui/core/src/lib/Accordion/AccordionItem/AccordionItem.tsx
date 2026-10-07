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
import { Tooltip } from '../../Tooltip/Tooltip'
import * as styles from './AccordionItem.css'

type IconVariantTypes = 'default' | 'small' | 'sidebar'
type ColorVariants = 'blue' | 'red'

export type AccordionItemLabelTags = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'div'

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
  /**
   * Shows a checkmark before the label, e.g. to mark the item as answered/completed.
   */
  checkmark?: boolean
  /**
   * Optional tooltip shown as an info icon next to the label.
   */
  tooltip?: ReactNode
  /**
   * Optional status pill/element rendered in the header, between the label and
   * the expand icon. Typically a `Tag`.
   */
  statusPill?: ReactNode
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
      checkmark,
      statusPill,
      tooltip,
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

    const checkmarkNode = checkmark ? (
      <Box
        component="span"
        display="flex"
        alignItems="center"
        marginRight={1}
        flexShrink={0}
      >
        <Icon icon="checkmark" size="medium" type="outline" color="blue400" />
      </Box>
    ) : null

    const labelNode =
      typeof label === 'string' ? (
        <Text variant={labelVariant} as="span" color={labelColor}>
          {label}
        </Text>
      ) : (
        label
      )

    const statusPillNode = statusPill ? (
      <Box component="span" height="full" display="flex" alignItems="center">
        {statusPill}
      </Box>
    ) : null

    const expandIcon = (
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
    )

    const buttonProps = {
      ref: forwardedRef,
      component: 'button' as const,
      type: 'button' as const,
      cursor: 'pointer' as const,
      className: [styles.button, useVirtualTouchable()],
      outline: 'none' as const,
      textAlign: 'left' as const,
      'aria-controls': id,
      'aria-expanded': expanded,
      onFocus,
      onBlur,
      onClick: onClick ? onClick : handleToggle,
    }

    return (
      <Box>
        <Box position="relative" display="flex">
          {tooltip ? (
            // The tooltip trigger is focusable (tabIndex=0), which is invalid
            // and unreliable nested inside the toggle <button>. So it lives
            // outside the button; the chevron becomes a second, aria-hidden
            // toggle so clicking it still expands the item.
            <Box
              component={labelUse}
              width="full"
              display="flex"
              alignItems="center"
            >
              <Box
                {...buttonProps}
                display="flex"
                alignItems="center"
                flexGrow={1}
              >
                <Box
                  component="span"
                  width="full"
                  display="flex"
                  flexDirection="column"
                >
                  <Box component="span" display="flex" alignItems="center">
                    {checkmarkNode}
                    {labelNode}
                  </Box>
                  {visibleContent && (
                    <Box paddingTop={2}>
                      <Text>{visibleContent}</Text>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                component="span"
                display="flex"
                alignItems="center"
                marginLeft={1}
                flexShrink={0}
              >
                <Tooltip text={tooltip} />
              </Box>
              {statusPillNode && (
                <Box marginLeft={2} flexShrink={0}>
                  {statusPillNode}
                </Box>
              )}
              <Box
                component="button"
                type="button"
                cursor="pointer"
                className={styles.button}
                outline="none"
                marginLeft={2}
                flexShrink={0}
                aria-hidden
                tabIndex={-1}
                onClick={onClick ? onClick : handleToggle}
              >
                {expandIcon}
              </Box>
            </Box>
          ) : (
            <Box component={labelUse} width="full" display="flex">
              <Box {...buttonProps} width="full">
                <Columns space={2} alignY="center" as="span">
                  <Column>
                    <Box
                      component="span"
                      height="full"
                      width="full"
                      display="flex"
                      alignItems="center"
                    >
                      {checkmarkNode}
                      {labelNode}
                    </Box>
                    {visibleContent && (
                      <Box paddingTop={2}>
                        <Text>{visibleContent}</Text>
                      </Box>
                    )}
                  </Column>
                  {statusPillNode ? (
                    <Column width="content">{statusPillNode}</Column>
                  ) : null}
                  <Column width="content">{expandIcon}</Column>
                </Columns>
              </Box>
            </Box>
          )}
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
