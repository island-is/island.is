import { NationalRegistryBirthplace } from './models/nationalRegistryBirthplace.model'
import { NationalRegistryCitizenship } from './models/nationalRegistryCitizenship.model'
import { NationalRegistryName } from './models/nationalRegistryName.model'
import { NationalRegistryPerson } from './models/nationalRegistryPerson.model'
import { NationalRegistrySpouse } from './models/nationalRegistrySpouse.model'

export interface NationalRegistryService {
  getNationalRegistryPerson: (
    nationalId: string,
  ) => Promise<NationalRegistryPerson | null>
  getSpouse: (nationalId: string) => Promise<NationalRegistrySpouse | null>
  getBirthplace: (
    nationalId: string,
  ) => Promise<NationalRegistryBirthplace | null>
  getCitizenship: (
    nationalId: string,
  ) => Promise<NationalRegistryCitizenship | null>
  getName: (nationalId: string) => Promise<NationalRegistryName | null>
}

export const NATIONAL_REGISTRY_SERVICE_FACTORY =
  'national-registry-service-factory'

export enum NationalRegistryGender {
  MALE = 'male',
  FEMALE = 'female',
  TRANSGENDER = 'transgender',
  MALE_MINOR = 'male-minor',
  FEMALE_MINOR = 'female-minor',
  TRANSGENDER_MINOR = 'transgender-minor',
  UNKNOWN = 'unknown',
}

export enum NationalRegistryMaritalStatus {
  UNMARRIED = 'unmarried',
  MARRIED = 'married',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  DIVORCED = 'divorced',
  MARRIED_LIVING_SEPARATELY = 'married-living-separately',
  MARRIED_TO_FOREIGN_LAW_PERSON = 'registered-married-to-foreign-law-person',
  UNKNOWN = 'unknown',
  FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON = 'foreign-residence-married-to-unregistered-person',
  ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON = 'transnational-marriage',
}
