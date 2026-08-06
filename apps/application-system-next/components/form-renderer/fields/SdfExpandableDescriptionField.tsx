import { AccordionCard, Box, BulletList, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfExpandableDescriptionField = ({
  component,
}: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    <AccordionCard
      id={`expandable-${component.id}`}
      label={component.label ?? ''}
      labelVariant="h3"
    >
      {component.introText && (
        <Box marginBottom={4}>
          <Text>{component.introText}</Text>
        </Box>
      )}
      {component.description && (
        <BulletList space="gutter" type="ul">
          <Text>{component.description}</Text>
        </BulletList>
      )}
    </AccordionCard>
  </Box>
)
