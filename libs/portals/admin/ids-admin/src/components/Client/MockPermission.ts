import { Scopes } from '../forms/AddPermissions/AddPermissions.loader'

export const mockData: Scopes[] = [
  {
    displayName: '1-Staða og hreyfingar',
    name: '1@island.is/finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
  },
  {
    displayName: '2-Full Access',
    name: '2@island.is/auth/admin:full',
    description:
      'Full access to authorization admin something description here',
  },
  {
    displayName: '3-Skattskýrslur',
    name: '3@skatturinn.is/skattskyrslur',
    description:
      'Full access to authorization admin something description here',
  },
  {
    displayName: '4-Staða og hreyfingar',
    name: '4@island.is/finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
  },
  {
    displayName: '5-Full Access',
    name: '5@island.is/auth/admin:full',
    description:
      'Full access to authorization admin something description here',
  },
  {
    displayName: '6-Skattskýrslur',
    name: '6@skatturinn.is/skattskyrslur',
    description:
      'Full access to authorization admin something description here',
  },
]

export const mockDataUnused: Scopes[] = [
  {
    displayName: 'Unused:Staða og hreyfingar',
    name: 'auth-admin-api.full_control',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
  },
  {
    displayName: 'Unused:Full Access',
    name: '@island.is/auth/not-admin:full',
    description:
      'Full access to authorization admin something description here',
  },
  {
    displayName: 'Unused:Skattskýrslur',
    name: '@skatturinn.is/not-skattskyrslur',
    description:
      'Full access to authorization admin something description here',
  },
  {
    displayName: 'Unused:Staða og hreyfingar',
    name: '@island.is/not-finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
  },
  {
    displayName: 'Unused:Full Access',
    name: '@island.is/auth/not-admin:full',
    description:
      'Full access to authorization admin something description here',
  },
  {
    displayName: 'Unused:Skattskýrslur',
    name: '@skatturinn.is/not-skattskyrslur',
    description:
      'Full access to authorization admin something description here',
  },
]
