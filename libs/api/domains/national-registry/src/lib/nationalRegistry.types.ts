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
