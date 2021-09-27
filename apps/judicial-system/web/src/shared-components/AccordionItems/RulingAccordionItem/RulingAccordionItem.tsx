import React, { useContext } from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { getAppealDecisionText } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { AppealDecisionRole } from '@island.is/judicial-system-web/src/types'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import {
  formatAccusedByGender,
  formatAlternativeTravelBanRestrictions,
  formatCustodyRestrictions,
  NounCases,
} from '@island.is/judicial-system/formatters'
import * as style from './RulingAccordionItem.treat'

interface Props {
  workingCase: Case
}

const RulingAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  const { user } = useContext(UserContext)

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
        <Box marginBottom={7}>
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
          <Text variant="h3">
            {workingCase?.judge
              ? `${workingCase.judge.name} ${workingCase.judge.title}`
              : `${user?.name} ${user?.title}`}
          </Text>
        </Box>
      </Box>
      <Box component="section" marginBottom={3}>
        <Box marginBottom={1}>
          <Text as="h4" variant="h4">
            Ákvörðun um kæru
          </Text>
        </Box>
        <Box marginBottom={2}>
          <Text>
            Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð
            þennan til Landsréttar innan þriggja sólarhringa.
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Text variant="h4">
            {getAppealDecisionText(
              AppealDecisionRole.ACCUSED,
              workingCase.accusedAppealDecision,
              workingCase.accusedGender,
            )}
          </Text>
        </Box>
        <Text variant="h4">
          {getAppealDecisionText(
            AppealDecisionRole.PROSECUTOR,
            workingCase.prosecutorAppealDecision,
            workingCase.accusedGender,
          )}
        </Text>
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
              Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að
              bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.
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
                Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að
                bera atriði er lúta að framkvæmd farbannsins undir dómara.
              </Text>
            </Box>
          ))}
    </AccordionItem>
  )
}

export default RulingAccordionItem
