import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { getSdfFieldMargins } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

export const SdfAccordionField = ({ component }: FieldRendererProps) => (
  <Box {...getSdfFieldMargins(component)}>
    {component.label && (
      <Text variant="h3" marginBottom={2}>
        {component.label}
      </Text>
    )}
    <Accordion>
      {(
        component.items as { label: string; content: string }[] | undefined
      )?.map((item, i) => (
        <AccordionItem
          key={i}
          id={`accordion-${component.id}-${i}`}
          label={item.label}
        >
          <Text>{item.content}</Text>
        </AccordionItem>
      ))}
    </Accordion>
  </Box>
)
