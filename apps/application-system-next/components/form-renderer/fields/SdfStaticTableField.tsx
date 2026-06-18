import { Box, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfStaticTableField = ({ component }: FieldRendererProps) => {
  const staticRows = (component.rows ?? []) as string[][]
  if (staticRows.length === 0) {
    return null
  }
  return (
    <Box {...getSdfFieldMargins(component)}>
      {component.label && (
        <Text variant="h3" marginBottom={2}>
          {component.label}
        </Text>
      )}
      <Box overflow="auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {component.header && component.header.length > 0 ? (
            <thead>
              <tr>
                {component.header.map((h: string, i: number) => (
                  <th key={i} style={{ textAlign: 'left' }}>
                    <Box
                      paddingY={2}
                      paddingX={3}
                      borderBottomWidth="standard"
                      borderColor="blue200"
                    >
                      <Text fontWeight="semiBold" variant="small">
                        {h}
                      </Text>
                    </Box>
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {staticRows.map((row: string[], ri: number) => (
              <tr key={ri}>
                {row.map((cell: string, ci: number) => (
                  <td key={ci}>
                    <Box
                      paddingY={2}
                      paddingX={3}
                      borderBottomWidth="standard"
                      borderColor="blue100"
                    >
                      <Text variant="small">{cell}</Text>
                    </Box>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  )
}
