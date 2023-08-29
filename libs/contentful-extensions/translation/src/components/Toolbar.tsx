import React, { FC } from 'react'

export const Toolbar: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      position: 'relative',

      padding: '16px',
      margin: '8px 0 0',

      border: '1px solid #d3dce0',
      borderTopLeftRadius: '6px',
      borderTopRightRadius: '6px',
      backgroundColor: '#f7f9fa',
    }}
  >
    {children}
  </div>
)
