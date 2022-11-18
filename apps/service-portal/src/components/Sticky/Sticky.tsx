import React, { FC, useRef } from 'react'

export const Sticky: FC = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <aside
      ref={ref}
      style={{
        zIndex: 1,
      }}
    >
      {children}
    </aside>
  )
}

export default Sticky
