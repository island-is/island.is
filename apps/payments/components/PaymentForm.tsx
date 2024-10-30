'use client'

import { Box } from '@island.is/island-ui/core'

export const PaymentForm = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box>
      <form>{children}</form>
    </Box>
  )
}
