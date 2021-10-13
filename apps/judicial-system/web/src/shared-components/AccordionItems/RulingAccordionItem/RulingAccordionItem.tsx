import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseType,
  isInvestigationCase,
  isRestrictionCase,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import {
  capitalize,
  formatAccusedByGender,
  formatAlternativeTravelBanRestrictions,
  formatAppeal,
  formatCustodyRestrictions,
  NounCases,
} from '@island.is/judicial-system/formatters'
import { rulingAccordion as m } from '@island.is/judicial-system-web/messages/Core/rulingAccordion'
import { rcConfirmation } from '@island.is/judicial-system-web/messages'
import * as style from './RulingAccordionItem.treat'

interface Props {
  workingCase: Case
}

const RulingAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const custodyRestrictions = formatCustodyRestrictions(
    workingCase.accusedGender,
    workingCase.custodyRestrictions,
  )

  const alternativeTravelBanRestrictions = formatAlternativeTravelBanRestrictions(
    workingCase.accusedGender,
    workingCase.custodyRestrictions,
    workingCase.otherRestrictions,
  )

  return (
    <AccordionItem
      id="id_3"
      label="Úrskurður Héraðsdóms Reykjavíkur"
      labelVariant="h3"
    >
      <Box component="section" marginBottom={5}>
        <Box marginBottom={2}>
          <Text as="h4" variant="h4">
            Úrskurður Héraðsdóms
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Greinargerð um málsatvik
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>{workingCase.courtCaseFacts}</Text>
        </Box>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Greinargerð um lagarök
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>{workingCase.courtLegalArguments}</Text>
        </Box>
        {isInvestigationCase(workingCase.type) &&
          workingCase.requestProsecutorOnlySession && (
            <Box marginY={2}>
              <Box marginBottom={1}>
                <Text variant="eyebrow" color="blue400">
                  Beiðni um dómþing að varnaraðila fjarstöddum
                </Text>
              </Box>
              <Text>{workingCase.prosecutorOnlySessionRequest}</Text>
            </Box>
          )}
        <Box marginBottom={5}>
          <Text variant="eyebrow" color="blue400">
            Niðurstaða
          </Text>
          <Text>
            <span className={style.breakSpaces}>{workingCase.ruling}</span>
          </Text>
        </Box>
      </Box>
      <Box component="section" marginBottom={7}>
        <Box marginBottom={2}>
          <Text as="h4" variant="h4">
            Úrskurðarorð
          </Text>
        </Box>
        <Box marginBottom={3}>
          <Box marginTop={1}>
            <Text>{workingCase.conclusion}</Text>
          </Box>
        </Box>
        <Box marginBottom={1}>
          <Text variant="h5">
            {workingCase?.judge
              ? `${workingCase.judge.name} ${workingCase.judge.title}`
              : `${user?.name} ${user?.title}`}
          </Text>
        </Box>
        {(isRestrictionCase(workingCase.type) ||
          workingCase.sessionArrangements !==
            SessionArrangements.REMOTE_SESSION) && (
          <Text>
            Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.
          </Text>
        )}
      </Box>
      <Box component="section" marginBottom={3}>
        <Box marginBottom={1}>
          <Text as="h4" variant="h4">
            Ákvörðun um kæru
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>{formatMessage(m.sections.appealDecision.disclaimer)}</Text>
        </Box>
        {workingCase.prosecutorAppealDecision !==
          CaseAppealDecision.NOT_APPLICABLE && (
          <Box marginBottom={1}>
            <Text variant="h4">
              {formatAppeal(workingCase.prosecutorAppealDecision, 'Sækjandi')}
            </Text>
          </Box>
        )}
        {workingCase.accusedAppealDecision !==
          CaseAppealDecision.NOT_APPLICABLE && (
          <Text variant="h4">
            {formatAppeal(
              workingCase.accusedAppealDecision,
              isRestrictionCase(workingCase.type)
                ? capitalize(formatAccusedByGender(workingCase.accusedGender))
                : 'Varnaraðili',
              isRestrictionCase(workingCase.type)
                ? workingCase.accusedGender
                : undefined,
            )}
          </Text>
        )}
      </Box>
      {(workingCase.accusedAppealAnnouncement ||
        workingCase.prosecutorAppealAnnouncement) && (
        <Box component="section" marginBottom={6}>
          {workingCase.accusedAppealAnnouncement &&
            workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL && (
              <Box marginBottom={2}>
                <Text variant="eyebrow" color="blue400">
                  {`Yfirlýsing um kæru ${formatAccusedByGender(
                    workingCase.accusedGender,
                    NounCases.GENITIVE,
                    isInvestigationCase(workingCase.type),
                  )}`}
                </Text>
                <Text>{workingCase.accusedAppealAnnouncement}</Text>
              </Box>
            )}
          {workingCase.prosecutorAppealAnnouncement &&
            workingCase.prosecutorAppealDecision ===
              CaseAppealDecision.APPEAL && (
              <Box marginBottom={2}>
                <Text variant="eyebrow" color="blue400">
                  Yfirlýsing um kæru sækjanda
                </Text>
                <Text>{workingCase.prosecutorAppealAnnouncement}</Text>
              </Box>
            )}
        </Box>
      )}
      {workingCase.type === CaseType.CUSTODY &&
        workingCase.decision === CaseDecision.ACCEPTING && (
          <Box>
            <Box marginBottom={1}>
              <Text as="h3" variant="h3">
                Tilhögun gæsluvarðhalds
              </Text>
            </Box>
            {custodyRestrictions && (
              <Box marginBottom={2}>
                <Text>{custodyRestrictions}</Text>
              </Box>
            )}
            <Text>
              {formatMessage(
                rcConfirmation.sections.custodyRestrictions.disclaimer,
                {
                  caseType: 'gæsluvarðhaldsins',
                },
              )}
            </Text>
          </Box>
        )}
      {(workingCase.type === CaseType.CUSTODY &&
        workingCase.decision ===
          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) ||
        (workingCase.type === CaseType.TRAVEL_BAN &&
          workingCase.decision === CaseDecision.ACCEPTING && (
            <Box>
              <Box marginBottom={1}>
                <Text as="h3" variant="h3">
                  Tilhögun farbanns
                </Text>
              </Box>
              {alternativeTravelBanRestrictions && (
                <Box marginBottom={2}>
                  <Text>
                    {alternativeTravelBanRestrictions
                      .split('\n')
                      .map((str, index) => {
                        return (
                          <div key={index}>
                            <Text>{str}</Text>
                          </div>
                        )
                      })}
                  </Text>
                </Box>
              )}
              <Text>
                {formatMessage(
                  rcConfirmation.sections.custodyRestrictions.disclaimer,
                  {
                    caseType: 'farbannsins',
                  },
                )}
              </Text>
            </Box>
          ))}
    </AccordionItem>
  )
}

export default RulingAccordionItem
