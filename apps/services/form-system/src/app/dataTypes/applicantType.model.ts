import { LanguageType } from './languageType.model'

export class ApplicantType {
  id!: string
  type!: string
  description!: LanguageType
  nameSuggestions?: LanguageType[]
}

export const ApplicantTypes: ApplicantType[] = [
  {
    id: 'd999c588-19b4-4254-9c5d-4dcc6e817e50',
    type: 'individual',
    description: {
      is: '',
      en: '',
    },
  },
  {
    id: 'a46a5bb8-7f24-4767-abf7-13b6a3b24be8',
    type: 'individualWithDelegationFromIndividual',
    description: {
      is: '',
      en: '',
    },
  },
  {
    id: 'a9a16cf0-349b-4a7c-b174-4fa608d463ef',
    type: 'individualWithDelegationFromLegalEntity',
    description: {
      is: '',
      en: '',
    },
  },
  {
    id: '7f815b3d-3ce0-4cfc-86c0-66066c20f479',
    type: 'individualWithProcuration',
    description: {
      is: '',
      en: '',
    },
  },
  {
    id: '4dbe615a-84bd-4a38-9f97-0a574c05f807',
    type: 'individualGivingDelegation',
    description: {
      is: '',
      en: '',
    },
  },
  {
    id: 'df099315-b101-4b43-b7dc-8de5f6aa2e21',
    type: 'legalEntity',
    description: {
      is: '',
      en: '',
    },
  },
]
