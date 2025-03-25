import { FC } from 'react'
import { useIntl } from 'react-intl'

import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatDate,
  formatNationalId,
  formatRequestCaseType,
} from '@island.is/judicial-system/formatters'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import {
  core,
  laws,
  requestCourtDate,
  restrictionsV2,
} from '@island.is/judicial-system-web/messages'
import { lawsBrokenAccordion } from '@island.is/judicial-system-web/messages/Core/lawsBrokenAccordion'
import {
  Case,
  CaseLegalProvisions,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { formatRequestedCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'

import AccordionListItem from '../../AccordionListItem/AccordionListItem'
import * as styles from './PoliceRequestAccordionItem.css'

interface Props {
  workingCase: Case
}

const PoliceRequestAccordionItem: FC<Props> = ({ workingCase }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <AccordionItem
      id="policeRequestAccordionItem"
      label={formatMessage(core.requestCaseType, {
        caseType: formatRequestCaseType(workingCase.type),
      })}
      labelVariant="h3"
      labelUse="h3"
    >
      <AccordionListItem
        title={capitalize(
          formatMessage(core.defendant, {
            suffix: (workingCase.defendants ?? []).length > 1 ? 'ar' : 'i',
          }),
        )}
      >
        {workingCase.defendants &&
          workingCase.defendants.map((defendant, index) => (
            <Box key={index}>
              {(!defendant.noNationalId || defendant.nationalId) && (
                <Box marginBottom={1}>
                  <Text>
                    {`${formatMessage(
                      defendant.noNationalId
                        ? core.dateOfBirth
                        : core.nationalId,
                    )}: ${
                      defendant.noNationalId
                        ? defendant.nationalId
                        : formatNationalId(defendant.nationalId ?? '')
                    }`}
                  </Text>
                </Box>
              )}
              <Box marginBottom={1}>
                <Text>{`${formatMessage(core.fullName)}: ${
                  defendant.name
                }`}</Text>
              </Box>
              <Box marginBottom={3}>
                <Text>Lögheimili: {defendant.address}</Text>
              </Box>
            </Box>
          ))}
      </AccordionListItem>
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
      <AccordionListItem
        title={formatMessage(lawsBrokenAccordion.heading)}
        breakSpaces
      >
        <Text>{workingCase.lawsBroken}</Text>
      </AccordionListItem>
      <AccordionListItem title="Lagaákvæði sem krafan er byggð á" breakSpaces>
        {isRestrictionCase(workingCase.type) ? (
          <>
            {workingCase.legalProvisions &&
              workingCase.legalProvisions.map(
                (legalProvision: CaseLegalProvisions, index) => {
                  return (
                    <div key={index}>
                      <Text>{formatMessage(laws[legalProvision].title)}</Text>
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
        <AccordionListItem
          title={formatMessage(restrictionsV2.title, {
            caseType: workingCase.type,
          })}
        >
          <Text>
            {formatRequestedCustodyRestrictions(
              formatMessage,
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
        </AccordionListItem>
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
