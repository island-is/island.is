import { Dispatch, FC, SetStateAction } from 'react'

import {
  Box,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
} from '@island.is/island-ui/core'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  AppealDecisionPartyRole,
  Case,
  CaseAppealDecision,
  CourtSessionResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCourtSessions } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  courtSession: CourtSessionResponse
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}

// Identifies a single party's decision row for the session's ruling order.
interface PartyKey {
  partyRole: AppealDecisionPartyRole
  defendantId?: string
  civilClaimantId?: string
}

const samePartyKey = (
  a: {
    partyRole?: AppealDecisionPartyRole | null
    defendantId?: string | null
    civilClaimantId?: string | null
  },
  b: PartyKey,
): boolean =>
  a.partyRole === b.partyRole &&
  (a.defendantId ?? null) === (b.defendantId ?? null) &&
  (a.civilClaimantId ?? null) === (b.civilClaimantId ?? null)

const CourtSessionAppealDecisions: FC<Props> = ({
  courtSession,
  workingCase,
  setWorkingCase,
}) => {
  const { updateCourtSessionAppealDecision } = useCourtSessions()

  const rulingFileId = courtSession.rulingFileId
  if (!rulingFileId) {
    return null
  }

  const disabled = Boolean(courtSession.isConfirmed)

  const findDecision = (party: PartyKey) =>
    workingCase.appealDecisions?.find(
      (decision) =>
        decision.rulingFileId === rulingFileId && samePartyKey(decision, party),
    )

  const upsertDecision = (
    party: PartyKey,
    changes: { decision?: CaseAppealDecision; announcement?: string },
    persist: boolean,
  ) => {
    setWorkingCase((prev) => {
      const decisions = prev.appealDecisions ?? []
      const index = decisions.findIndex(
        (decision) =>
          decision.rulingFileId === rulingFileId &&
          samePartyKey(decision, party),
      )
      const merged = {
        __typename: 'AppealDecisionResponse' as const,
        ...(index >= 0 ? decisions[index] : { id: '', rulingFileId, ...party }),
        ...changes,
      }

      return {
        ...prev,
        appealDecisions:
          index >= 0
            ? decisions.map((decision, i) => (i === index ? merged : decision))
            : [...decisions, merged],
      }
    })

    if (persist) {
      updateCourtSessionAppealDecision({
        caseId: workingCase.id,
        courtSessionId: courtSession.id,
        ...party,
        ...changes,
      })
    }
  }

  const renderCard = (
    party: PartyKey,
    options: {
      name?: string | null
      // Nominative form for the radio labels (Ákærði / Kröfuhafi / Sækjandi)
      nominative: string
      // Genitive form for the title and announcement (ákærða / kröfuhafa / sækjanda)
      genitive: string
    },
  ) => {
    const { name, nominative, genitive } = options
    const decision = findDecision(party)
    const groupName = `appeal-decision-${party.partyRole}-${
      party.defendantId ?? party.civilClaimantId ?? 'prosecutor'
    }`

    const radios: { value: CaseAppealDecision; label: string }[] = [
      {
        value: CaseAppealDecision.APPEAL,
        label: `${nominative} kærir úrskurðinn`,
      },
      {
        value: CaseAppealDecision.ACCEPT,
        label: `${nominative} unir úrskurðinum`,
      },
      { value: CaseAppealDecision.NOT_APPLICABLE, label: 'Á ekki við' },
      {
        value: CaseAppealDecision.POSTPONE,
        label: `${nominative} tekur sér lögboðinn frest`,
      },
    ]

    return (
      <BlueBox key={groupName}>
        <SectionHeading
          title={`${
            name ? `${name} - ` : ''
          }Afstaða ${genitive} til úrskurðar í lok þinghalds`}
          heading="h4"
          marginBottom={2}
          required
        />
        <GridRow rowGap={2}>
          {radios.map((radio) => (
            <GridColumn key={radio.value} span="1/2">
              <RadioButton
                name={groupName}
                id={`${groupName}-${radio.value}`}
                label={radio.label}
                checked={decision?.decision === radio.value}
                disabled={disabled}
                onChange={() =>
                  upsertDecision(
                    party,
                    {
                      decision: radio.value,
                      announcement:
                        radio.value === CaseAppealDecision.APPEAL
                          ? `${nominative} kærir úrskurðinn til Landsréttar.`
                          : '',
                    },
                    true,
                  )
                }
                large
                backgroundColor="white"
              />
            </GridColumn>
          ))}
        </GridRow>
        <Box marginTop={2}>
          <Input
            name={`${groupName}-announcement`}
            label={`Yfirlýsing ${genitive}`}
            placeholder={`Hér er hægt að bóka frekar um afstöðu ${genitive}`}
            value={decision?.announcement ?? ''}
            disabled={disabled}
            onChange={(event) =>
              upsertDecision(party, { announcement: event.target.value }, false)
            }
            onBlur={(event) =>
              upsertDecision(party, { announcement: event.target.value }, true)
            }
            textarea
            rows={7}
          />
        </Box>
      </BlueBox>
    )
  }

  return (
    <Box>
      <SectionHeading
        title="Ákvörðun um kæru"
        description="Dómari kynnir rétt til að kæra úrskurð og um kærufrest skv. 193. gr. laga nr. 88/2008."
      />
      <Box display="flex" flexDirection="column" rowGap={3}>
        {workingCase.defendants?.map((defendant) =>
          renderCard(
            {
              partyRole: AppealDecisionPartyRole.DEFENDANT,
              defendantId: defendant.id,
            },
            { name: defendant.name, nominative: 'Ákærði', genitive: 'ákærða' },
          ),
        )}
        {workingCase.civilClaimants?.map((civilClaimant) =>
          renderCard(
            {
              partyRole: AppealDecisionPartyRole.CIVIL_CLAIMANT,
              civilClaimantId: civilClaimant.id,
            },
            {
              name: civilClaimant.name,
              nominative: 'Kröfuhafi',
              genitive: 'kröfuhafa',
            },
          ),
        )}
        {renderCard(
          { partyRole: AppealDecisionPartyRole.PROSECUTOR },
          { nominative: 'Sækjandi', genitive: 'sækjanda' },
        )}
      </Box>
    </Box>
  )
}

export default CourtSessionAppealDecisions
