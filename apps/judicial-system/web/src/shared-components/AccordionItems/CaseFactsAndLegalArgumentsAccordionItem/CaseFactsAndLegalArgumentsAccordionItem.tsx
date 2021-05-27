import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
}

const CaseFactsAndLegalArgumentsAccordionItem: React.FC<Props> = ({
  workingCase,
}: Props) => {
  return (
    <AccordionItem
      id="id_1"
      label="Greinargerð um málsatvik og lagarök"
      labelVariant="h3"
    >
      <Box marginBottom={4}>
        <Box marginBottom={1}>
          <Text variant="h4" as="h4">
            Málsatvik
          </Text>
        </Box>
        <Text>{workingCase.courtCaseFacts}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text variant="h4" as="h4">
          Lagarök
        </Text>
      </Box>
      <Text>{workingCase.courtLegalArguments}</Text>
    </AccordionItem>
  )
}

export default CaseFactsAndLegalArgumentsAccordionItem
