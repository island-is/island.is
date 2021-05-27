import * as s from './Ball.treat'

import React, { ReactNode } from 'react'
import cn from 'classnames'

// ---------------------------------------------------------------------------
type BallType = 'green' | 'yellow' | 'red'
const ballClasses: Record<BallType, string | undefined> = {
  green: undefined,
  yellow: s.ballYellow,
  red: s.ballRed,
}
type BallProps = {
  type?: BallType
  children?: ReactNode
}
export const Ball = ({ type, children }: BallProps) => (
  <span className={cn(s.ball, ballClasses[type || 'green'])}>{children}</span>
)
