import { NationalRegistryPerson } from '@island.is/api/domains/national-registry-x-road'

export const mockedUsers: Record<string, NationalRegistryPerson[]> = {
  '0101303019': [
    {
      nationalId: '1111111119',
      fullName: 'Stubbur Maack',
      genderCode: '3',
      livesWithApplicant: true,
      livesWithBothParents: true,
    },
  ],
  '0101302989': [
    {
      nationalId: '2222222229',
      fullName: 'Stúfur Maack ',
      genderCode: '3',
      livesWithApplicant: true,
      livesWithBothParents: true,
      otherParent: {
        nationalId: '0101302399',
        fullName: 'Gervimaður Færeyjar',
        address: {
          streetName: 'Hvassaleiti 5',
          postalCode: '103',
          city: 'Reykjavík',
          municipalityCode: '0000',
        },
        genderCode: '2',
      },
    },
    {
      nationalId: '5555555559',
      fullName: 'Bína Maack ',
      genderCode: '4',
      livesWithApplicant: true,
      livesWithBothParents: true,
    },
    {
      nationalId: '6666666669',
      fullName: 'Snúður Maack',
      genderCode: '3',
      livesWithApplicant: true,
      livesWithBothParents: true,
    },
  ],
  '0101304929': [
    {
      nationalId: '6666666669',
      fullName: 'Snúður Maack',
      genderCode: '3',
      livesWithApplicant: true,
      livesWithBothParents: true,
    },
  ],
}
