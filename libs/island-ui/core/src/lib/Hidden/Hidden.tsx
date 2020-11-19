import React, { ReactNode } from 'react'

import { Box } from '../Box/Box'
import * as styleRefs from './Hidden.treat'
import {
  resolveResponsiveRangeProps,
  ResponsiveRangeProps,
} from '../../utils/responsiveRangeProps'

type position = 'relative' | 'fixed' | 'absolute' | 'static'

export interface HiddenProps extends ResponsiveRangeProps {
  children: ReactNode
  screen?: boolean
  print?: boolean
  inline?: boolean
  position?: position | 'none'
}

export const Hidden = ({
  children,
  above,
  below,
  screen,
  print,
  inline,
  position = 'relative',
}: HiddenProps) => {
  const hiddenOnScreen = Boolean(screen)
  const hiddenOnPrint = Boolean(print)

  const [
    hiddenOnXs,
    hiddenOnSm,
    hiddenOnMd,
    hiddenOnLg,
    hiddenOnXl,
  ] = resolveResponsiveRangeProps({ above, below })

  const pos: { position?: position } = {}

  if (position !== 'none') {
    pos.position = position
  }

  const display = inline ? 'inline' : 'block'

  return (
    <Box
      {...pos}
      display={
        hiddenOnScreen
          ? 'none'
          : [
              hiddenOnXs ? 'none' : display,
              hiddenOnSm ? 'none' : display,
              hiddenOnMd ? 'none' : display,
              hiddenOnLg ? 'none' : display,
              hiddenOnXl ? 'none' : display,
            ]
      }
      className={hiddenOnPrint ? styleRefs.hiddenOnPrint : undefined}
      component={inline ? 'span' : 'div'}
    >
      {children}
    </Box>
  )
}
