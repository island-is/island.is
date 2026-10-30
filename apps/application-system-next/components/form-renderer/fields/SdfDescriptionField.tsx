import { Box, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfDescriptionField = ({ component }: FieldRendererProps) => {
  const primaryLabel = (component.label ?? '').trim()
  const secondaryText = (component.description ?? '').trim()
  const hasPrimary = primaryLabel.length > 0
  const hasSecondary = secondaryText.length > 0

  return (
    <Box {...getSdfFieldMargins(component)}>
      {hasPrimary && hasSecondary ? (
        <>
          <Text variant="h3" marginBottom={1}>
            {component.label}
          </Text>
          <Text>{component.description}</Text>
        </>
      ) : hasPrimary ? (
        <Text>{component.label}</Text>
      ) : hasSecondary ? (
        <Text>{component.description}</Text>
      ) : null}
    </Box>
  )
}
