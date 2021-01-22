import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'

import { AccordionListItem } from '@island.is/judicial-system-web/src/shared-components'
import {
  capitalize,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
}

const CourtRecordAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  return (
    <AccordionItem id="id_2" label="Þingbók" labelVariant="h3">
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          Upplýsingar
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text>
          {`Þinghald frá kl. ${formatDate(
            workingCase.courtStartTime,
            TIME_FORMAT,
          )} til kl. ${formatDate(
            workingCase.courtEndTime,
            TIME_FORMAT,
          )} ${formatDate(workingCase.courtEndTime, 'PP')}`}
        </Text>
      </Box>
      <AccordionListItem title="Krafa lögreglu" breakSpaces>
        <Text>{workingCase.policeDemands}</Text>
      </AccordionListItem>
      <AccordionListItem title="Viðstaddir" breakSpaces>
        <Text>{workingCase.courtAttendees}</Text>
      </AccordionListItem>
      <AccordionListItem title="Dómskjöl">
        <Text>
          {`Rannsóknargögn málsins liggja frammi. Krafa lögreglu þingmerkt nr. 1. ${workingCase.courtDocuments?.map(
            (courtDocument, index) => {
              return `${capitalize(courtDocument)} þingmerkt nr. ${index + 2}`
            },
          )}.`.replace(/,/g, '. ')}
        </Text>
      </AccordionListItem>
      <AccordionListItem title="Réttindi kærða">
        <Text>
          Kærða er bent á að honum sé óskylt að svara spurningum er varða brot
          það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008.
          Kærði er enn fremur áminntur um sannsögli kjósi hann að tjá sig um
          sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.
        </Text>
      </AccordionListItem>
      <AccordionListItem title="Afstaða kærða" breakSpaces>
        <Text>{workingCase.accusedPlea}</Text>
      </AccordionListItem>
      <AccordionListItem title="Málflutningur" breakSpaces>
        <Text>{workingCase.litigationPresentations}</Text>
      </AccordionListItem>
    </AccordionItem>
  )
}

export default CourtRecordAccordionItem
