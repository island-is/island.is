import * as React from 'react'
import cn from 'classnames'
import { Tooltip, TooltipAnchor, TooltipProvider } from '@ariakit/react'
import * as styles from './HoverTooltip.css'

export type HoverTooltipPlacement = 'top' | 'right' | 'bottom' | 'left'

export interface HoverTooltipProps {
  text: React.ReactNode
  children: React.ReactElement
  placement?: HoverTooltipPlacement
  showTimeout?: number
  className?: string
}

export const HoverTooltip: React.FC<HoverTooltipProps> = ({
  text,
  children,
  placement = 'top',
  showTimeout = 100,
  className,
}) => (
  <TooltipProvider placement={placement} showTimeout={showTimeout}>
    <TooltipAnchor render={children} />
    <Tooltip portal className={cn(styles.tooltip, className)}>
      {text}
    </Tooltip>
  </TooltipProvider>
)
