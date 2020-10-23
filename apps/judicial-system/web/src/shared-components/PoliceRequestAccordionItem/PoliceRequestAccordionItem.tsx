import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'

import AccordionListItem from '../AccordionListItem/AccordionListItem'
import {
  capitalize,
  formatCustodyRestrictions,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { Case } from '../../types'

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
        <Text variant="intro">Kennitala: {workingCase.accusedNationalId}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text variant="intro">Fullt nafn: {workingCase.accusedName}</Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="intro">Lögheimili: {workingCase.accusedAddress}</Text>
      </Box>
      <AccordionListItem title="Tími handtöku">
        <Text variant="intro">
          {`${capitalize(
            formatDate(workingCase.arrestDate, 'PPPP'),
          )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`}
        </Text>
      </AccordionListItem>
      <AccordionListItem title="Ósk um fyrirtökudag og tíma">
        <Text variant="intro">
          {`${capitalize(
            formatDate(workingCase.requestedCourtDate, 'PPPP'),
          )} kl. ${formatDate(workingCase.requestedCourtDate, TIME_FORMAT)}`}
        </Text>
      </AccordionListItem>
      <AccordionListItem title="Dómkröfur">
        <Text variant="intro">
          {`Gæsluvarðhald til ${capitalize(
            formatDate(workingCase.custodyEndDate, 'PPP'),
          )} kl. ${formatDate(workingCase.custodyEndDate, TIME_FORMAT)}`}
        </Text>
      </AccordionListItem>
      <AccordionListItem title="Lagaákvæði">
        <Text variant="intro">{workingCase.lawsBroken}</Text>
      </AccordionListItem>
      <Box marginBottom={1}>
        <Text variant="h5">Takmarkanir á gæslu</Text>
      </Box>
      <Box marginBottom={4}>
        <Text variant="intro">
          {formatCustodyRestrictions(workingCase.custodyRestrictions)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          Greinargerð um málsatvik og lagarök
        </Text>
      </Box>
      <AccordionListItem title="Málsatvik rakin">
        <Text variant="intro">{workingCase.caseFacts}</Text>
      </AccordionListItem>
      <AccordionListItem title="Framburðir">
        <Text variant="intro">{workingCase.witnessAccounts}</Text>
      </AccordionListItem>
      <AccordionListItem title="Staða rannsóknar og næstu skref">
        <Text variant="intro">{workingCase.investigationProgress}</Text>
      </AccordionListItem>
      <AccordionListItem title="Lagarök">
        <Text variant="intro">{workingCase.legalArguments}</Text>
      </AccordionListItem>
    </AccordionItem>
  )
}

export default PoliceRequestAccordionItem
