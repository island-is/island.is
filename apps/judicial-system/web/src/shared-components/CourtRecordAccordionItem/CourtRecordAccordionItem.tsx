import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'

import AccordionListItem from '../AccordionListItem/AccordionListItem'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system/types'
import * as style from './CourtRecordAccordionItem.treat'

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
      <AccordionListItem title="Krafa lögreglu">
        <span className={style.breakSpaces}>{workingCase.policeDemands}</span>
      </AccordionListItem>
      <AccordionListItem title="Viðstaddir">
        <span className={style.breakSpaces}>{workingCase.courtAttendees}</span>
      </AccordionListItem>
      <AccordionListItem title="Dómskjöl">
        Rannsóknargögn málsins liggja frammi. Krafa lögreglu þingmerkt nr. 1.
      </AccordionListItem>
      <AccordionListItem title="Réttindi kærða">
        Kærða er bent á að honum sé óskylt að svara spurningum er varða brot það
        sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Kærði
        er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið,
        sbr. 1. mgr. 114. gr. sömu laga.
      </AccordionListItem>
      <AccordionListItem title="Afstaða kærða">
        <span className={style.breakSpaces}>{workingCase.accusedPlea}</span>
      </AccordionListItem>
      <AccordionListItem title="Málflutningur">
        <span className={style.breakSpaces}>
          {workingCase.litigationPresentations}
        </span>
      </AccordionListItem>
    </AccordionItem>
  )
}

export default CourtRecordAccordionItem
