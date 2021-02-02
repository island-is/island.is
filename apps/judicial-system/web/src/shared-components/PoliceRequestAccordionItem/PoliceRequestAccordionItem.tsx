import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'

import AccordionListItem from '../AccordionListItem/AccordionListItem'
import {
  capitalize,
  formatRequestedCustodyRestrictions,
  formatDate,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { Case, CaseType } from '@island.is/judicial-system/types'
import { constructProsecutorDemands } from '@island.is/judicial-system-web/src/utils/stepHelper'

interface Props {
  workingCase: Case
}

const PoliceRequestAccordionItem: React.FC<Props> = ({
  workingCase,
}: Props) => {
  return (
    <AccordionItem
      id="id_1"
      label={`Krafa um ${
        workingCase.type === CaseType.CUSTODY ? 'gæsluvarðhald' : 'farbann'
      }`}
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
      {workingCase.arrestDate && (
        <AccordionListItem title="Tími handtöku">
          <Text>
            {`${capitalize(
              formatDate(workingCase.arrestDate, 'PPPP') || '',
            )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`}
          </Text>
        </AccordionListItem>
      )}
      {workingCase.requestedCourtDate && (
        <AccordionListItem title="Ósk um fyrirtökudag og tíma">
          <Text>
            {`${capitalize(
              formatDate(workingCase.requestedCourtDate, 'PPPP') || '',
            )} eftir kl. ${formatDate(
              workingCase.requestedCourtDate,
              TIME_FORMAT,
            )}`}
          </Text>
        </AccordionListItem>
      )}
      <AccordionListItem title="Dómkröfur">
        {constructProsecutorDemands(workingCase)}
      </AccordionListItem>
      <AccordionListItem title="Lagaákvæði" breakSpaces>
        <Text>{workingCase.lawsBroken}</Text>
      </AccordionListItem>
      <Box marginBottom={1}>
        <Text variant="h5">{`Takmarkanir og tilhögun ${
          workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
        }`}</Text>
      </Box>
      <Box marginBottom={4}>
        <Text>
          {`${formatRequestedCustodyRestrictions(
            workingCase.type,
            workingCase.requestedCustodyRestrictions,
            workingCase.requestedOtherRestrictions,
          )}`}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          Greinargerð um málsatvik og lagarök
        </Text>
      </Box>
      <AccordionListItem title="Málsatvik rakin" breakSpaces>
        <Text>{workingCase.caseFacts}</Text>
      </AccordionListItem>
      <AccordionListItem title="Lagarök" breakSpaces>
        <Text>{workingCase.legalArguments}</Text>
      </AccordionListItem>
    </AccordionItem>
  )
}

export default PoliceRequestAccordionItem
