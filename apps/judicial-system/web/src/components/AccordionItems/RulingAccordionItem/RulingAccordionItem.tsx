import type { FC } from 'react'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { rulingAccordion as m } from '@island.is/judicial-system-web/messages'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AccordionListItem,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'

interface Props {
  workingCase: WorkingCase
  startExpanded?: boolean
}

const RulingAccordionItem: FC<Props> = ({
  workingCase,
  startExpanded,
}: Props) => {
  return (
    <AccordionItem
      id="rulingAccordionItem"
      label={m.heading}
      labelVariant="h3"
      labelUse="h3"
      startExpanded={startExpanded}
    >
      <Box component="section">
        {workingCase.isCompletedWithoutRuling ? (
          <SectionHeading
            title={m.sections.noRuling.title}
            heading="h4"
            marginBottom={2}
          />
        ) : (
          <>
            <SectionHeading title={m.title} heading="h4" marginBottom={2} />
            <AccordionListItem title={m.sections.prosecutorDemands.title}>
              <Text>{workingCase.prosecutorDemands}</Text>
            </AccordionListItem>
            <AccordionListItem title={m.sections.courtCaseFacts.title}>
              <Text>{workingCase.courtCaseFacts}</Text>
            </AccordionListItem>
            <AccordionListItem title={m.sections.courtLegalArguments.title}>
              <Text>{workingCase.courtLegalArguments}</Text>
            </AccordionListItem>
            <AccordionListItem title={m.sections.ruling.title}>
              <Text whiteSpace="breakSpaces">{workingCase.ruling}</Text>
            </AccordionListItem>
          </>
        )}
      </Box>
    </AccordionItem>
  )
}

export default RulingAccordionItem
