export enum ServiceRequirement {
  REQUIRED = 'REQUIRED', // Ruling must be served
  NOT_REQUIRED = 'NOT_REQUIRED', // Ruling does not need to be served
  NOT_APPLICABLE = 'NOT_APPLICABLE', // Defendant was present in court
}

// We could possibly also have an APPEAL option here if we want,
// but we can also see from the verdict appeal date if the verdict
// has been appealed
export enum VerdictAppealDecision {
  ACCEPT = 'ACCEPT', // Una
  POSTPONE = 'POSTPONE', // Taka áfrýjunarfrest
}

export enum InformationForDefendant {
  INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES = 'INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES',
  INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS = 'INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS',
  CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION = 'CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION',
  DRIVING_RIGHTS_REVOKED_TRANSLATION = 'DRIVING_RIGHTS_REVOKED_TRANSLATION',
  ALTERNATIVE_FINES_TRANSLATION = 'ALTERNATIVE_FINES_TRANSLATION',
  COMMUNITY_SERVICE = 'COMMUNITY_SERVICE',
  FINES_AND_COSTS = 'FINES_AND_COSTS',
  ITEM_CONFISCATION = 'ITEM_CONFISCATION',
}

// TODO: set final descriptions
export const informationForDefendantMap: Map<
  InformationForDefendant,
  { label: string; description: string; detail?: string }
> = new Map([
  [
    InformationForDefendant.INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES,
    {
      label: 'Leiðbeiningar um endurupptöku útivistarmála',
      description: 'Missing description',
    },
  ],
  [
    InformationForDefendant.INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS,
    {
      label: 'Upplýsingar um áfrýjun til Landsréttar og áfrýjunarfresti',
      detail:
        'Einstaklingur getur áfrýjað dómi til Landsréttar ef viðkomandi hefur verið dæmdur í fangelsi eða til að greiða sekt eða sæta upptöku eigna sem nær áfrýjunarfjárhæð í einkamáli, kr. 1.420.488.',
      description: 'Missing description',
    },
  ],
  [
    InformationForDefendant.CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION,
    {
      label: 'Þýðing skilorðsbundinnar refsingar og skilorðsrofs',
      description: 'Missing description',
    },
  ],
  [
    InformationForDefendant.DRIVING_RIGHTS_REVOKED_TRANSLATION,
    {
      label: 'Þýðing sviptingu ökuréttinda',
      description: 'Missing description',
    },
  ],
  [
    InformationForDefendant.ALTERNATIVE_FINES_TRANSLATION,
    {
      label: 'Þýðing vararefsingu fésekta',
      description: 'Missing description',
    },
  ],
  [
    InformationForDefendant.COMMUNITY_SERVICE,
    {
      label: 'Upplýsingar um skilyrði og umsókn um samfélagsþjónustu',
      description: 'Missing description',
    },
  ],
  [
    InformationForDefendant.FINES_AND_COSTS,
    {
      label: 'Upplýsingar um greiðslu sekta, sakarkostnaðar og bóta',
      description: 'Missing description',
    },
  ],
  [
    InformationForDefendant.ITEM_CONFISCATION,
    {
      label: 'Upplýsingar um upptöku muna/efna',
      description: 'Missing description',
    },
  ],
])
