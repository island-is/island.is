import React, { Children } from 'react'
import flattenChildren from 'react-keyed-flatten-children'
import { Box } from '../Box/Box'
import { ResponsiveSpace, UseBoxStylesProps } from '../Box/useBoxStyles'
import {
  useNegativeMarginLeft,
  useNegativeMarginTop,
} from '../../hooks/useNegativeMargin/useNegativeMargin'
import { ReactNodeNoStrings } from '../private/ReactNodeNoStrings'
import {
  resolveCollapsibleAlignmentProps,
  CollapsibleAlignmentProps,
} from '../../utils/collapsibleAlignmentProps'

export interface InlineProps extends CollapsibleAlignmentProps {
  space?: ResponsiveSpace
  flexWrap?: 'wrap' | 'nowrap'
  fluid?: boolean
  justifyContent?: UseBoxStylesProps['justifyContent']
  children: ReactNodeNoStrings
}

export const Inline = ({
  space = 'none',
  fluid = false,
  flexWrap = 'wrap',
  justifyContent,
  align,
  alignY,
  collapseBelow,
  reverse,
  children,
}: InlineProps) => {
  const negativeMarginLeft = useNegativeMarginLeft(space)
  const negativeMarginTop = useNegativeMarginTop(space)

  const {
    collapsibleAlignmentProps,
    collapsibleAlignmentChildProps,
    orderChildren,
  } = resolveCollapsibleAlignmentProps({
    align,
    alignY,
    collapseBelow,
    reverse,
  })

  return (
    <Box className={negativeMarginTop}>
      <Box
        className={negativeMarginLeft}
        flexWrap={flexWrap}
        width={fluid === true ? 'full' : undefined}
        flexGrow={fluid === true ? 1 : fluid === false ? 0 : undefined}
        {...collapsibleAlignmentProps}
        {...(justifyContent && { justifyContent })}
      >
        {Children.map(orderChildren(flattenChildren(children)), (child) =>
          child !== null && child !== undefined ? (
            <Box
              minWidth={0}
              paddingLeft={space}
              paddingTop={space}
              {...collapsibleAlignmentChildProps}
            >
              {child}
            </Box>
          ) : null,
        )}
      </Box>
    </Box>
  )
}
