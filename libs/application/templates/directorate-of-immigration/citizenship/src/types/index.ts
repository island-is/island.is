import { ApplicantChildCustodyInformation, NationalRegistryBirthplace, NationalRegistryIndividual, NationalRegistryParent, PaymentCatalogItem } from "@island.is/application/types"

interface UserProfile {
    bankInfo:string
    email:string
    mobilePhoneNumber:string
}

export interface ExternalData {
    nationalRegistry: {
        data: NationalRegistryIndividual
        date: string
    }
    childrenCustodyInformation: {
        data: ApplicantChildCustodyInformation[]
        date: string
    },
    nationalRegistryBirthplace: {
        data: NationalRegistryBirthplace
        date: string
    },
    payment: {
        data: PaymentCatalogItem
        date: string
    },
    userProfile: {
        data: UserProfile
        date: string
    },
    NationalRegistryParent: {
        data: NationalRegistryParent[]
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
    FORMER = 'formerIcelander'
  }