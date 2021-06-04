import { application } from './factories'
import { CurrentUserCompanies, NationalRegistryFamilyMember } from '../../types'
import { createStore, faker } from '@island.is/shared/mocking'

export const store = createStore(() => {
  faker.seed(100)

  const applications = application
    .list(10)
    .concat([application({ applicant: '0000000000' })])
    .concat([application({ applicant: '0000000000', typeId: 'ParentalLeave' })])
    .concat([application({ applicant: '0000000000', typeId: 'PartyLetter' })])
  const familyMembers: NationalRegistryFamilyMember[] = [
    {
      nationalId: '1234567890',
      fullName: 'Jóna Jónsdóttir',
      gender: 'FEMALE',
      familyRelation: 'spouse',
    },
    {
      nationalId: '0987654321',
      fullName: 'Bjarni sonur þinn',
      gender: 'MALE',
      familyRelation: 'child',
    },
  ]

  const userCompanies: CurrentUserCompanies[] = [
    {
      hasProcuration: true,
      isPartOfBoardOfDirectors: false,
      nationalId: '0000000000',
      name: 'Tester Testson',
      companyStatus: 'Standandi',
      operationalForm: 'ehf',
    },
  ]
  return { applications, familyMembers, userCompanies }
})
