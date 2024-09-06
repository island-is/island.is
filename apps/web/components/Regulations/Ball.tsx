import cn from 'classnames'

import * as s from './Ball.css'

// ---------------------------------------------------------------------------
export type BallColor = 'green' | 'yellow' | 'red'
const ballClasses: Record<BallColor, string | undefined> = {
  green: undefined,
  yellow: s.ballYellow,
  red: s.ballRed,
}
export type BallProps = {
  type?: BallColor
  children?: string | number | ReadonlyArray<string | number>
}
export const Ball = ({ type, children }: BallProps) => (
  <span className={cn(s.ball, ballClasses[type || 'green'])}>{children}</span>
)
