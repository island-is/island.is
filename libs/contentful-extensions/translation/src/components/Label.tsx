import React, { FC } from 'react'

export const Label: FC = ({ children }) => (
  <p
    style={{
      display: 'inline-block',

      marginBottom: 8,

      fontSize: 12,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.35px',

      color: '#536171',
      borderRadius: 6,
    }}
  >
    {children}
  </p>
)
