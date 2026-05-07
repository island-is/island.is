import { Box, Text } from '@island.is/island-ui/core'
import type { FieldRendererProps } from '../types'

type SdfBoxSpacing =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 12
  | 13
  | 14
  | 15
  | 20
  | 21
  | 22
  | 23
  | 24
  | 28
  | 30
  | 200

export const SdfDescriptionField = ({ component }: FieldRendererProps) => {
  const primaryLabel = (component.label ?? '').trim()
  const secondaryText = (component.description ?? '').trim()
  const hasPrimary = primaryLabel.length > 0
  const hasSecondary = secondaryText.length > 0
  const marginTop = component.marginTop as SdfBoxSpacing | undefined
  const marginBottom = (component.marginBottom ?? 3) as SdfBoxSpacing

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
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
