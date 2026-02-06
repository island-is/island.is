import React, { Children, ReactNode } from 'react'
import flattenChildren from 'react-keyed-flatten-children'
import { Box } from '../Box/Box'
import { BoxProps } from '../Box/types'
import { Divider, DividerProps } from '../Divider/Divider'
import { Hidden, HiddenProps } from '../Hidden/Hidden'
import * as hiddenStyleRefs from '../Hidden/Hidden.css'
import { alignToFlexAlign, Align } from '../../utils/align'
import {
  mapResponsiveProp,
  normaliseResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import { resolveResponsiveRangeProps } from '../../utils/responsiveRangeProps'
import { ReactNodeNoStrings } from '../private/ReactNodeNoStrings'

const alignToDisplay = {
  left: 'block',
  center: 'flex',
  right: 'flex',
} as const

interface UseStackItemProps {
  align: ResponsiveProp<Align>
}

const useStackItem = ({ align }: UseStackItemProps) => ({
  // If we're aligned left across all screen sizes,
  // there's actually no alignment work to do.
  ...(align === 'left'
    ? null
    : {
        display: mapResponsiveProp(align, alignToDisplay) || 'flex',
        flexDirection: 'column' as const,
        alignItems: alignToFlexAlign(align),
      }),
})

const validStackComponents = ['div', 'ol', 'ul'] as const

const extractHiddenPropsFromChild = (child: ReactNode) =>
  child && typeof child === 'object' && 'type' in child && child.type === Hidden
    ? (child.props as HiddenProps)
    : null

const resolveHiddenProps = ({ screen, above, below }: HiddenProps) =>
  screen
    ? ([true, true, true, true, true] as const)
    : resolveResponsiveRangeProps({
        above,
        below,
      })

const calculateHiddenStackItemProps = (
  stackItemProps: ReturnType<typeof useStackItem>,
  [hiddenOnXs, hiddenOnSm, hiddenOnMd, hiddenOnLg, hiddenOnXl]: Readonly<
    [boolean, boolean, boolean, boolean, boolean]
  >,
) => {
  const [displayXs, displaySm, displayMd, displayLg, displayXl] =
    normaliseResponsiveProp(stackItemProps?.display || 'block')

  return {
    ...stackItemProps,
    display: [
      hiddenOnXs ? 'none' : displayXs,
      hiddenOnSm ? 'none' : displaySm,
      hiddenOnMd ? 'none' : displayMd,
      hiddenOnLg ? 'none' : displayLg,
      hiddenOnXl ? 'none' : displayXl,
    ] as ResponsiveProp<'block' | 'flex' | 'none' | 'inline' | 'inlineBlock'>,
  }
}

export interface StackProps {
  component?: typeof validStackComponents[number]
  children: ReactNodeNoStrings
  space: BoxProps['paddingTop']
  align?: ResponsiveProp<Align>
  dividers?: boolean | DividerProps['weight']
}

export const Stack = ({
  component = 'div',
  children,
  space = 'none',
  align = 'left',
  dividers = false,
}: StackProps) => {
  if (
    process.env.NODE_ENV === 'development' &&
    !validStackComponents.includes(component)
  ) {
    throw new Error(`Invalid Stack component: ${component}`)
  }

  const hiddenStyles = { ...hiddenStyleRefs }
  const stackItemProps = useStackItem({ align })
  const stackItems = flattenChildren(children)
  const isList = component === 'ol' || component === 'ul'
  const stackItemComponent = isList ? 'li' : 'div'

  let firstItemOnXs: number | null = null
  let firstItemOnSm: number | null = null
  let firstItemOnMd: number | null = null
  let firstItemOnLg: number | null = null
  let firstItemOnXl: number | null = null

  return (
    <Box
      component={component}
      display="flex"
      flexDirection="column"
      rowGap={dividers ? 'none' : space}
    >
      {Children.map(stackItems, (child, index) => {
        if (
          process.env.NODE_ENV !== 'production' &&
          typeof child === 'object' &&
          child.type === Hidden &&
          (child.props as HiddenProps).inline !== undefined
        ) {
          throw new Error(
            'The "inline" prop is invalid on Hidden elements within a Stack',
          )
        }

        const hiddenProps = extractHiddenPropsFromChild(child)
        const hidden = hiddenProps
          ? resolveHiddenProps(hiddenProps)
          : ([false, false, false, false, false] as const)
        const [hiddenOnXs, hiddenOnSm, hiddenOnMd, hiddenOnLg, hiddenOnXl] =
          hidden

        if (firstItemOnXs === null && !hiddenOnXs) {
          firstItemOnXs = index
        }

        if (firstItemOnSm === null && !hiddenOnSm) {
          firstItemOnSm = index
        }

        if (firstItemOnMd === null && !hiddenOnMd) {
          firstItemOnMd = index
        }

        if (firstItemOnLg === null && !hiddenOnLg) {
          firstItemOnLg = index
        }

        if (firstItemOnXl === null && !hiddenOnXl) {
          firstItemOnXl = index
        }

        return (
          <Box
            component={stackItemComponent}
            className={[
              hiddenProps && hiddenProps.print
                ? hiddenStyles.hiddenOnPrint
                : null,
            ]}
            {...(hiddenOnXs ||
            hiddenOnSm ||
            hiddenOnMd ||
            hiddenOnLg ||
            hiddenOnXl
              ? calculateHiddenStackItemProps(stackItemProps, hidden)
              : stackItemProps)}
          >
            {dividers && index > 0 ? (
              <Box
                width="full"
                paddingBottom={space}
                display={[
                  index === firstItemOnXs ? 'none' : 'block',
                  index === firstItemOnSm ? 'none' : 'block',
                  index === firstItemOnMd ? 'none' : 'block',
                  index === firstItemOnLg ? 'none' : 'block',
                  index === firstItemOnXl ? 'none' : 'block',
                ]}
              >
                {typeof dividers === 'string' ? (
                  <Divider weight={dividers} />
                ) : (
                  <Divider />
                )}
              </Box>
            ) : null}
            {hiddenProps ? hiddenProps.children : child}
          </Box>
        )
      })}
    </Box>
  )
}
