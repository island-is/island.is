import React from 'react'
import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'
import { FocusableBox } from './FocusableBox'

export default {
  title: 'Core/FocusableBox',
  component: FocusableBox,
}

const CustomComponent = ({ children }) => (
  <button style={{ textAlign: 'start', background: 'aliceblue' }}>
    {children}
  </button>
)

export const Default = () => (
  <Box padding={2}>
    <FocusableBox component="button">
      <Typography variant="p">
        FocusableBox extends the `Box` component and implements our custom focus
        styles. It should wrap a focusable element like a button.
      </Typography>
    </FocusableBox>
  </Box>
)

export const WrappedWithCustomComponent = () => (
  <Box padding={2}>
    <FocusableBox component={CustomComponent}>
      <Typography variant="p">
        It can also be wrapped with a custom React component
      </Typography>
    </FocusableBox>
  </Box>
)
