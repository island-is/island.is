//import { application } from './factories'
import { NationalRegistryFamilyMember } from '../../types'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const applications = application
    .list(10)
    .concat([application({ applicant: '0000000000' })])
    .concat([application({ applicant: '0000000000', typeId: 'ParentalLeave' })])
  const familyMembers: NationalRegistryFamilyMember[] = [
    {
      nationalId: '1234567890',
      fullName: 'Jóna Jónsdóttir',
      gender: 'FEMALE',
    },
    {
      nationalId: '0987654321',
      fullName: 'Bjarni sonur þinn',
      gender: 'MALE',
    },
  ]

  return { applications, familyMembers }
})
