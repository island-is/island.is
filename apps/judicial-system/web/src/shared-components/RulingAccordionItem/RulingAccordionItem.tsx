import React, { useContext } from 'react'
import { Text, Box, AccordionItem } from '@island.is/island-ui/core'
import {
  Case,
  CaseAppealDecision,
  CaseDecision,
} from '@island.is/judicial-system/types'
import * as style from './RulingAccordionItem.treat'
import {
  constructConclusion,
  getAppealDecitionText,
} from '../../utils/stepHelper'
import { AppealDecisionRole } from '../../types'
import { UserContext } from '../UserProvider/UserProvider'
import { formatRestrictions } from '@island.is/judicial-system/formatters'

interface Props {
  workingCase: Case
}

const RulingAccordionItem: React.FC<Props> = ({ workingCase }: Props) => {
  const { user } = useContext(UserContext)

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
        <Box marginBottom={7}>
          <Text variant="eyebrow" color="blue400">
            Niðurstaða úrskurðar
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
        <Box marginBottom={3}>{constructConclusion(workingCase)}</Box>
        <Box marginBottom={1}>
          <Text variant="h3">
            {workingCase?.judge
              ? `${workingCase.judge.name} ${workingCase.judge.title}`
              : `${user?.name} ${user?.title}`}
          </Text>
        </Box>
        <Text>Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.</Text>
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
            {getAppealDecitionText(
              AppealDecisionRole.ACCUSED,
              workingCase.accusedAppealDecision,
            )}
          </Text>
        </Box>
        <Text variant="h4">
          {getAppealDecitionText(
            AppealDecisionRole.PROSECUTOR,
            workingCase.prosecutorAppealDecision,
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
                  Yfirlýsing um kæru kærða
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
      {workingCase.decision === CaseDecision.ACCEPTING && (
        <Box>
          <Box marginBottom={1}>
            <Text as="h3" variant="h3">
              Tilhögun gæsluvarðhalds
            </Text>
          </Box>
          <Box marginBottom={2}>
            <Text>
              {formatRestrictions(workingCase.custodyRestrictions || [])}
            </Text>
          </Box>
          <Text>
            Dómari bendir kærða/umboðsaðila á að honum sé heimilt að bera atriði
            er lúta að framkvæmd gæsluvarðhaldsins undir dómara.
          </Text>
        </Box>
      )}
    </AccordionItem>
  )
}

export default RulingAccordionItem
