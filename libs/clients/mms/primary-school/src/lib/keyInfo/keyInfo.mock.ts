/**
 * DEV mock payloads for the key-information endpoints, shaped exactly like the
 * MMS contract v0.2 responses (§4). The service returns these until the real
 * endpoints are connected. Delete together with the mocked service bodies once
 * the client codegen lands (see keyInfo.types.ts).
 */
import type {
  AgentRelationTypeDto,
  AllergyDto,
  ChildAgentDto,
  ChildDto,
  HealthProfileDto,
  LanguageEnvironmentDto,
  LanguageProfileDto,
  MyContactDto,
} from './keyInfo.types'

/* -- 4.1 Lookup lists ------------------------------------------------------ */

export const mockAgentRelationTypes: AgentRelationTypeDto[] = [
  {
    id: 'rt-parent',
    relation: 'parent',
    title: { is: 'Foreldri', en: 'Parent' },
  },
  {
    id: 'rt-grandparent',
    relation: 'grandparent',
    title: { is: 'Amma/afi', en: 'Grandparent' },
  },
  {
    id: 'rt-sibling',
    relation: 'sibling',
    title: { is: 'Systkini', en: 'Sibling' },
  },
  {
    id: 'rt-neighbour',
    relation: 'neighbour',
    title: { is: 'Nágranni', en: 'Neighbour' },
  },
  {
    id: 'rt-friend',
    relation: 'friend',
    title: { is: 'Vinur/vinkona', en: 'Friend' },
  },
  { id: 'rt-other', relation: 'other', title: { is: 'Annað', en: 'Other' } },
]

export const mockAllergies: AllergyDto[] = [
  {
    id: 'al-nuts',
    code: 'nuts',
    type: 'food',
    title: { is: 'Hnetur', en: 'Nuts' },
  },
  { id: 'al-egg', code: 'egg', type: 'food', title: { is: 'Egg', en: 'Eggs' } },
  {
    id: 'al-milk',
    code: 'milk',
    type: 'food',
    title: { is: 'Mjólkurvörur', en: 'Dairy' },
  },
  {
    id: 'al-fish',
    code: 'fish',
    type: 'food',
    title: { is: 'Fiskur', en: 'Fish' },
  },
  {
    id: 'al-sesame',
    code: 'sesame',
    type: 'food',
    title: { is: 'Sesamfræ', en: 'Sesame' },
  },
  {
    id: 'al-food-other',
    code: 'other',
    type: 'food',
    title: { is: 'Annað', en: 'Other' },
  },
  {
    id: 'al-nsaid',
    code: 'nsaid',
    type: 'medicine',
    title: { is: 'Bólgueyðandi lyf', en: 'NSAIDs' },
  },
  {
    id: 'al-pollen',
    code: 'pollen',
    type: 'environmental',
    title: { is: 'Frjókorn/gras/birki', en: 'Pollen/grass/birch' },
  },
  {
    id: 'al-insect',
    code: 'insect',
    type: 'environmental',
    title: { is: 'Geitunga-/skordýrabit', en: 'Wasp/insect stings' },
  },
  {
    id: 'al-animals',
    code: 'animals',
    type: 'environmental',
    title: { is: 'Hundar/kettir/önnur dýr', en: 'Dogs/cats/other animals' },
  },
  {
    id: 'al-latex',
    code: 'latex',
    type: 'environmental',
    title: { is: 'Latex', en: 'Latex' },
  },
  {
    id: 'al-nickel',
    code: 'nickel',
    type: 'environmental',
    title: { is: 'Nikkel', en: 'Nickel' },
  },
  {
    id: 'al-env-other',
    code: 'other',
    type: 'environmental',
    title: { is: 'Annað', en: 'Other' },
  },
]

export const mockLanguageEnvironments: LanguageEnvironmentDto[] = [
  {
    id: 'le-icelandic',
    code: 'icelandicOnly',
    title: { is: 'Aðeins töluð íslenska', en: 'Only Icelandic spoken' },
  },
  {
    id: 'le-icelandicAndOther',
    code: 'icelandicAndOther',
    title: {
      is: 'Töluð íslenska og annað/önnur tungumál',
      en: 'Icelandic and other language(s) spoken',
    },
  },
  {
    id: 'le-otherOnly',
    code: 'otherOnly',
    title: {
      is: 'Aðeins töluð önnur tungumál en íslenska',
      en: 'Only languages other than Icelandic spoken',
    },
  },
]

/* -- 4.2 Own contact ------------------------------------------------------- */

export const mockMyContact: MyContactDto = {
  nationalId: '0101803019',
  name: 'Jón Jónsson',
  email: 'jon@dæmi.is',
  phone: null,
  mobile: '6661234',
  updatedAt: '2026-09-02T10:12:00Z',
}

/* -- 4.3 Children ---------------------------------------------------------- */

export const mockChildren: ChildDto[] = [
  {
    id: 'c1f0-anna',
    nationalId: '1501203030',
    name: 'Anna Jónsdóttir',
    preferredName: null,
    school: {
      id: 'sc-hlidaskoli',
      name: 'Hlíðaskóli',
      municipality: 'Reykjavíkurborg',
    },
    gradeLevel: '3',
    myGuardianship: { sharedWithOtherGuardian: true },
  },
]

/* -- 4.4 Emergency contacts (agents) --------------------------------------- */

export const mockChildAgents: ChildAgentDto[] = [
  {
    id: 'a7-gudrun',
    person: { nationalId: '2002655555', name: 'Guðrún Sigurðardóttir' },
    relationType: {
      id: 'rt-grandparent',
      title: { is: 'Amma/afi', en: 'Grandparent' },
    },
    createdBy: {
      kind: 'guardian',
      displayName: 'Jón Jónsson',
      at: '2026-09-01T09:00:00Z',
    },
    canEdit: true,
  },
  {
    id: 'a12-Fannar',
    person: { nationalId: '2002655555', name: 'Guðrún Sigurðardóttir' },
    relationType: {
      id: 'rt-grandparent',
      title: { is: 'Amma/afi', en: 'Grandparent' },
    },
    createdBy: {
      kind: 'guardian',
      displayName: 'Hinn forsjáaraðili',
      at: '2026-09-01T09:00:00Z',
    },
    canEdit: false,
  },
  {
    id: 'a8-pall',
    person: { nationalId: '1212707070', name: 'Páll Pálsson' },
    relationType: {
      id: 'rt-neighbour',
      title: { is: 'Nágranni', en: 'Neighbour' },
    },
    createdBy: {
      kind: 'organization',
      displayName: 'Hlíðaskóli',
      at: '2026-08-20T13:40:00Z',
    },
    canEdit: true,
  },
  {
    id: 'a9-legacy',
    person: { nationalId: '3003653030', name: 'Sigurður Ólafsson' },
    relationType: { id: 'rt-other', title: { is: 'Annað', en: 'Other' } },
    createdBy: {
      kind: 'unknown',
      displayName: null,
      at: '2026-03-11T08:00:00Z',
    },
    canEdit: false,
  },
]

/* -- 4.5 Health profile ---------------------------------------------------- */

export const mockHealthProfile: HealthProfileDto = {
  epipen: true,
  medicalDiagnoses: true,
  medicationAssistance: false,
  allergies: [
    {
      id: 'al-nuts',
      code: 'nuts',
      type: 'food',
      title: { is: 'Hnetur', en: 'Nuts' },
    },
    {
      id: 'al-egg',
      code: 'egg',
      type: 'food',
      title: { is: 'Egg', en: 'Eggs' },
    },
    {
      id: 'al-nsaid',
      code: 'nsaid',
      type: 'medicine',
      title: { is: 'Bólgueyðandi lyf', en: 'NSAIDs' },
    },
    {
      id: 'al-pollen',
      code: 'pollen',
      type: 'environmental',
      title: { is: 'Frjókorn/gras/birki', en: 'Pollen/grass/birch' },
    },
  ],
  updatedAt: '2026-09-02T10:12:00Z',
  updatedBy: { kind: 'guardian', displayName: 'Jón Jónsson' },
}

/* -- 4.6 Language profile -------------------------------------------------- */

export const mockLanguageProfile: LanguageProfileDto = {
  languageEnvironment: {
    id: 'le-icelandicAndOther',
    code: 'icelandicAndOther',
    title: {
      is: 'Töluð íslenska og annað/önnur tungumál',
      en: 'Icelandic and other language(s) spoken',
    },
  },
  preferredLanguage: 'pl',
  languages: ['is', 'pl'],
  interpreter: true,
  signLanguage: false,
  updatedAt: '2026-09-02T10:12:00Z',
  updatedBy: { kind: 'guardian', displayName: 'Jón Jónsson' },
}

/** §8: MMS has not opened the health-profile PATCH yet. While false, an
 * update-health-profile call returns FEATURE_DISABLED (see the service). */
export const MOCK_HEALTH_EDIT_ENABLED = false
