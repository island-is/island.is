import { Box, Divider, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfPaymentChargeOverviewField = ({
  component,
}: FieldRendererProps) => {
  const lines = component.paymentChargeLines ?? []
  return (
    <Box {...getSdfFieldMargins(component)}>
      <Text variant="h3" as="h4" marginY={2}>
        {component.paymentChargeHeading}
      </Text>
      {lines.map((line, i) => (
        <Box
          key={`${line.description}-${i}`}
          paddingTop={1}
          display="flex"
          justifyContent="spaceBetween"
        >
          <Text>{line.description}</Text>
          <Text>{line.amount}</Text>
        </Box>
      ))}
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="spaceBetween" paddingBottom={2}>
        <Text variant="h5">{component.paymentChargeTotalLabel}</Text>
        <Text color="blue400" variant="h3">
          {component.paymentChargeTotalAmount}
        </Text>
      </Box>
    </Box>
  )
}
