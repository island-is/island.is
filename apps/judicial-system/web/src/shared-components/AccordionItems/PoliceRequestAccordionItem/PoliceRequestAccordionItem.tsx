import React from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import { useIntl } from 'react-intl'

import {
  capitalize,
  formatRequestedCustodyRestrictions,
  formatDate,
  TIME_FORMAT,
  laws,
  caseTypes,
} from '@island.is/judicial-system/formatters'
import { CaseType, isRestrictionCase } from '@island.is/judicial-system/types'
import type {
  Case,
  CaseCustodyProvisions,
} from '@island.is/judicial-system/types'
import { requestCourtDate } from '@island.is/judicial-system-web/messages'

import AccordionListItem from '../../AccordionListItem/AccordionListItem'
import * as styles from './PoliceRequestAccordionItem.treat'
interface Props {
  workingCase: Case
}

const PoliceRequestAccordionItem: React.FC<Props> = ({
  workingCase,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <AccordionItem
      id="id_1"
      label={`Krafa ${
        isRestrictionCase(workingCase.type)
          ? `um ${caseTypes[workingCase.type]}`
          : `- ${capitalize(caseTypes[workingCase.type])}`
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
              formatDate(workingCase.arrestDate, 'PPPP') ?? '',
            )} kl. ${formatDate(workingCase.arrestDate, TIME_FORMAT)}`}
          </Text>
        </AccordionListItem>
      )}
      {workingCase.requestedCourtDate && (
        <AccordionListItem title={formatMessage(requestCourtDate.heading)}>
          <Text>
            {`${capitalize(
              formatDate(workingCase.requestedCourtDate, 'PPPP') ?? '',
            )} eftir kl. ${formatDate(
              workingCase.requestedCourtDate,
              TIME_FORMAT,
            )}`}
          </Text>
        </AccordionListItem>
      )}
      <AccordionListItem title="Dómkröfur">
        <Text>{workingCase.demands}</Text>
      </AccordionListItem>
      <AccordionListItem title="Lagaákvæði sem brot varða við" breakSpaces>
        <Text>{workingCase.lawsBroken}</Text>
      </AccordionListItem>
      <AccordionListItem title="Lagaákvæði sem krafan er byggð á" breakSpaces>
        {isRestrictionCase(workingCase.type) ? (
          <>
            {workingCase.custodyProvisions &&
              workingCase.custodyProvisions.map(
                (custodyProvision: CaseCustodyProvisions, index) => {
                  return (
                    <div key={index}>
                      <Text>{laws[custodyProvision]}</Text>
                    </div>
                  )
                },
              )}
            {workingCase.legalBasis && <Text>{workingCase.legalBasis}</Text>}
          </>
        ) : (
          <Text>{workingCase.legalBasis}</Text>
        )}
      </AccordionListItem>
      {isRestrictionCase(workingCase.type) && (
        <>
          <Box marginBottom={1}>
            <Text variant="h5">{`Takmarkanir og tilhögun ${
              workingCase.type === CaseType.CUSTODY ? 'gæslu' : 'farbanns'
            }`}</Text>
          </Box>
          <Box marginBottom={4}>
            <Text>
              {formatRequestedCustodyRestrictions(
                workingCase.type,
                workingCase.requestedCustodyRestrictions,
                workingCase.requestedOtherRestrictions,
              )
                .split('\n')
                .map((requestedCustodyRestriction, index) => {
                  return (
                    <span key={index} className={styles.block}>
                      <Text as="span">{requestedCustodyRestriction}</Text>
                    </span>
                  )
                })}
            </Text>
          </Box>
        </>
      )}
      <Box marginBottom={2}>
        <Text variant="h4" as="h4">
          Greinargerð um málsatvik og lagarök
        </Text>
      </Box>
      <AccordionListItem title="Málsatvik" breakSpaces>
        <Text>{workingCase.caseFacts}</Text>
      </AccordionListItem>
      <AccordionListItem title="Lagarök" breakSpaces>
        <Text>{workingCase.legalArguments}</Text>
      </AccordionListItem>
      {workingCase.requestProsecutorOnlySession && (
        <AccordionListItem
          title="Beiðni um dómþing að varnaraðila fjarstöddum"
          breakSpaces
        >
          <Text>{workingCase.prosecutorOnlySessionRequest}</Text>
        </AccordionListItem>
      )}
    </AccordionItem>
  )
}

export default PoliceRequestAccordionItem
