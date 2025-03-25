import { FC } from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { rulingAccordion as m } from '@island.is/judicial-system-web/messages'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { AccordionListItem, SectionHeading } from '../..'

interface Props {
  workingCase: Case
  startExpanded?: boolean
}

const RulingAccordionItem: FC<Props> = ({
  workingCase,
  startExpanded,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <AccordionItem
      id="rulingAccordionItem"
      label={formatMessage(m.heading)}
      labelVariant="h3"
      labelUse="h3"
      startExpanded={startExpanded}
    >
      <Box component="section">
        {workingCase.isCompletedWithoutRuling ? (
          <SectionHeading
            title={formatMessage(m.sections.noRuling.title)}
            heading="h4"
            marginBottom={2}
          />
        ) : (
          <>
            <SectionHeading
              title={formatMessage(m.title)}
              heading="h4"
              marginBottom={2}
            />
            <AccordionListItem
              title={formatMessage(m.sections.prosecutorDemands.title)}
            >
              <Text>{workingCase.prosecutorDemands}</Text>
            </AccordionListItem>
            <AccordionListItem
              title={formatMessage(m.sections.courtCaseFacts.title)}
            >
              <Text>{workingCase.courtCaseFacts}</Text>
            </AccordionListItem>
            <AccordionListItem
              title={formatMessage(m.sections.courtLegalArguments.title)}
            >
              <Text>{workingCase.courtLegalArguments}</Text>
            </AccordionListItem>
            <AccordionListItem title={formatMessage(m.sections.ruling.title)}>
              <Text whiteSpace="breakSpaces">{workingCase.ruling}</Text>
            </AccordionListItem>
          </>
        )}
      </Box>
    </AccordionItem>
  )
}

export default RulingAccordionItem
