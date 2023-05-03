export type Permission = {
  id: string
  label: string
  description: string
  api: string
  locked?: boolean
}

export const mockData = [
  {
    label: '1-Staða og hreyfingar',
    id: '1@island.is/finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: '2-Full Access',
    id: '2@island.is/auth/admin:full',
    description:
      'Full access to authorization admin something description here',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: '3-Skattskýrslur',
    id: '3@skatturinn.is/skattskyrslur',
    description:
      'Full access to authorization admin something description here',
    api: 'Skatturinn',
    locked: true,
  },
  {
    label: '4-Staða og hreyfingar',
    id: '4@island.is/finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: '5-Full Access',
    id: '5@island.is/auth/admin:full',
    description:
      'Full access to authorization admin something description here',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: '6-Skattskýrslur',
    id: '6@skatturinn.is/skattskyrslur',
    description:
      'Full access to authorization admin something description here',
    api: 'Skatturinn',
    locked: true,
  },
] as Permission[]

export const mockDataUnused = [
  {
    label: 'Unused:Staða og hreyfingar',
    id: 'auth-admin-api.full_control',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Unused:Full Access',
    id: '@island.is/auth/not-admin:full',
    description:
      'Full access to authorization admin something description here',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Unused:Skattskýrslur',
    id: '@skatturinn.is/not-skattskyrslur',
    description:
      'Full access to authorization admin something description here',
    api: 'Skatturinn',
    locked: true,
  },
  {
    label: 'Unused:Staða og hreyfingar',
    id: '@island.is/not-finance:overview',
    description:
      'Skoða stöðu við ríkissjóð og stofnanir, hreyfingar, greiðsluseðla og greiðslukvittanir.',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Unused:Full Access',
    id: '@island.is/auth/not-admin:full',
    description:
      'Full access to authorization admin something description here',
    api: 'Island.is APIs',
    locked: false,
  },
  {
    label: 'Unused:Skattskýrslur',
    id: '@skatturinn.is/not-skattskyrslur',
    description:
      'Full access to authorization admin something description here',
    api: 'Skatturinn',
    locked: true,
  },
] as Permission[]
