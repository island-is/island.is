import { Box, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfInformationCardField = ({ component }: FieldRendererProps) => {
  const rows = component.informationCardItems ?? []
  return (
    <Box
      {...getSdfFieldMargins(component)}
      border="standard"
      borderColor="blue200"
      borderWidth="standard"
      paddingY={2}
      paddingX={2}
    >
      {rows.map((row, i) => (
        <Box display="flex" key={`${row.label}-${i}`} paddingY={1}>
          <Text fontWeight="semiBold">
            {row.label}
            &nbsp;
          </Text>
          <Box>
            <Text>{row.value}</Text>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
