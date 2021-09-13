import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import { CaseType } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'

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
      {workingCase.type !== CaseType.CUSTODY &&
        workingCase.type !== CaseType.TRAVEL_BAN &&
        workingCase.requestProsecutorOnlySession && (
          <Box marginTop={4}>
            <Box marginBottom={1}>
              <Text variant="h4" as="h4">
                Beiðni um dómþing að varnaraðila fjarstöddum
              </Text>
            </Box>
            <Text>{workingCase.prosecutorOnlySessionRequest}</Text>
          </Box>
        )}
    </AccordionItem>
  )
}

export default CaseFactsAndLegalArgumentsAccordionItem
