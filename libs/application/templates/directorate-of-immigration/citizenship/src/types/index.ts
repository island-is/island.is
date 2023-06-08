import {
  ApplicantChildCustodyInformation,
  NationalRegistryBirthplace,
  NationalRegistryParent,
  PaymentCatalogItem,
} from '@island.is/application/types'
// import {
//   CitizenIndividual,
//   SpouseIndividual,
// } from '@island.is/application/template-api-modules/directory-of-immigration/types'

interface UserProfile {
  bankInfo: string
  email: string
  mobilePhoneNumber: string
}

export interface ExternalData {
  individual?: {
    data: any
    date: string
  }
  childrenCustodyInformation?: {
    data: ApplicantChildCustodyInformation[]
    date: string
  }
  nationalRegistryBirthplace?: {
    data: NationalRegistryBirthplace
    date: string
  }
  payment?: {
    data: PaymentCatalogItem
    date: string
  }
  userProfile?: {
    data: UserProfile
    date: string
  }
  NationalRegistryParents?: {
    data: NationalRegistryParent[]
    date: string
  }
  spouseDetails?: {
    data: any
    date: string
  }
}

export enum ResidenceTypes {
  MARRIED = 'marriedToIcelander',
  COHABIT = 'cohabitWithIcelander',
  CHILDOFRESIDENT = 'childOfIcelander',
  NORDICRESIDENT = 'residentOfNordicCountry',
  REFUGEE = 'refugeeInIceland',
  NORESIDENCY = 'personWithNoResidency',
  FORMER = 'formerIcelander',
}
