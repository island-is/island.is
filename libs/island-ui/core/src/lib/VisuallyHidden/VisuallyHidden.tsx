import React, { CSSProperties, forwardRef, ReactNode } from 'react'

const style: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
}

interface VisuallyHiddenProps
  extends Pick<
    React.HTMLAttributes<HTMLElement>,
    'aria-labelledby' | 'aria-describedby' | 'id'
  > {
  children?: ReactNode
}

const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, ...restProps }, ref) => {
    return (
      <span ref={ref} style={style} {...restProps}>
        {children}
      </span>
    )
  },
)

export { VisuallyHidden }
export type { VisuallyHiddenProps }
