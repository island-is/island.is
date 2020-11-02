import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'

import AccordionListItem from '../AccordionListItem/AccordionListItem'
import {
  capitalize,
  formatCustodyRestrictions,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
}

const PoliceRequestAccordionItem: React.FC<Props> = ({
  workingCase,
}: Props) => {
  return (
    <AccordionItem
      id="id_1"
      label="Krafan um gæsluvarðhald frá lögreglu"
      labelVariant="h3"
    >
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          Grunnupplýsingar
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text>Kennitala: {workingCase.accusedNationalId}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text>Fullt nafn: {workingCase.accusedName}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text>Lögheimili: {workingCase.accusedAddress}</Text>
      </Box>
      <AccordionListItem title="Tími handtöku">
        {`${capitalize(
          formatDate(workingCase.arrestDate, 'PPPP'),
        )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`}
      </AccordionListItem>
      <AccordionListItem title="Ósk um fyrirtökudag og tíma">
        {`${capitalize(
          formatDate(workingCase.requestedCourtDate, 'PPPP'),
        )} kl. ${formatDate(workingCase.requestedCourtDate, TIME_FORMAT)}`}
      </AccordionListItem>
      <AccordionListItem title="Dómkröfur">
        {`Gæsluvarðhald til ${capitalize(
          formatDate(workingCase.custodyEndDate, 'PPP'),
        )} kl. ${formatDate(workingCase.custodyEndDate, TIME_FORMAT)}`}
      </AccordionListItem>
      <AccordionListItem title="Lagaákvæði" breakSpaces>
        {workingCase.lawsBroken}
      </AccordionListItem>
      <Box marginBottom={1}>
        <Text variant="h5">Takmarkanir á gæslu</Text>
      </Box>
      <Box marginBottom={4}>
        <Text>
          {formatCustodyRestrictions(workingCase.custodyRestrictions)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          Greinargerð um málsatvik og lagarök
        </Text>
      </Box>
      <AccordionListItem title="Málsatvik rakin" breakSpaces>
        {workingCase.caseFacts}
      </AccordionListItem>
      <AccordionListItem title="Lagarök" breakSpaces>
        {workingCase.legalArguments}
      </AccordionListItem>
    </AccordionItem>
  )
}

export default PoliceRequestAccordionItem
