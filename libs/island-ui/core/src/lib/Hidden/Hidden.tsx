import React, { ReactNode } from 'react'

import { Box } from '../Box/Box'
import * as styleRefs from './Hidden.css'
import {
  resolveResponsiveRangeProps,
  ResponsiveRangeProps,
} from '../../utils/responsiveRangeProps'

export interface HiddenProps extends ResponsiveRangeProps {
  children: ReactNode
  screen?: boolean
  print?: boolean
  inline?: boolean
}

export const Hidden = ({
  children,
  above,
  below,
  screen,
  print,
  inline,
}: HiddenProps) => {
  const hiddenOnScreen = Boolean(screen)
  const hiddenOnPrint = Boolean(print)

  const [hiddenOnXs, hiddenOnSm, hiddenOnMd, hiddenOnLg, hiddenOnXl] =
    resolveResponsiveRangeProps({ above, below })

  const display = inline ? 'inline' : 'block'

  return (
    <Box
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
