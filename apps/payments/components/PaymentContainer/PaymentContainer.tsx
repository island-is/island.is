import { Box } from '@island.is/island-ui/core'

interface PaymentContainerProps {
  children: React.ReactNode
}

export const PaymentContainer = ({ children }: PaymentContainerProps) => {
  return (
    <Box marginBottom={3} display="flex" flexDirection="column" rowGap={2}>
      {children}
    </Box>
  )
}
