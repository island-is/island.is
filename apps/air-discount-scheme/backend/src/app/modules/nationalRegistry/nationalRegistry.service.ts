import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryUser } from './nationalRegistry.types'
import { environment } from '../../../environments'
import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import {
  Gender,
  RegistryGender,
  UncategorizedGender,
} from '@island.is/air-discount-scheme/types'

const TEST_USERS: NationalRegistryUser[] = [
  {
    // Test User Ísabella
    nationalId: '1902982649',
    firstName: 'Ísabella',
    address: 'Hrimblugrugg 2',
    city: 'Vestmannaeyjar',
    gender: RegistryGender.Female,
    lastName: 'Developersdóttir',
    middleName: 'EagleAir',
    postalcode: 900,
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111990000',
    firstName: 'Minnsti',
    middleName: 'Drengur',
    lastName: 'Ísabelluson',
    gender: RegistryGender.Male,
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111994500',
    firstName: 'Stærri',
    middleName: 'Drengur',
    lastName: 'Ísabelluson',
    gender: RegistryGender.Male,
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111997600',
    firstName: 'Lítil',
    middleName: 'Stúlka',
    lastName: 'Ísabelludóttir',
    gender: RegistryGender.Female,
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111999300',
    firstName: 'Stærsta',
    middleName: 'Stúlka',
    lastName: 'Ísabelludóttir',
    gender: RegistryGender.Female,
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervimadur Ameríka
    nationalId: '0101302989',
    firstName: 'Gervimaður',
    middleName: '',
    lastName: 'Ameríka',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 600,
    city: 'Akureyri',
  },
  {
    // Gervimadur Færeyjar
    nationalId: '0101302399',
    firstName: 'Gervimaður',
    middleName: '',
    lastName: 'Færeyjar',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 100,
    city: 'Reykjavík',
  },
  {
    // Gervibarn Ameríku
    nationalId: '2222222229',
    firstName: 'Litli',
    middleName: 'Jói',
    lastName: 'Ameríkuson',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 100,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ameríku
    nationalId: '3333333339',
    firstName: 'Litla',
    middleName: 'Jóna',
    lastName: 'Ameríkudóttir',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 100,
    city: 'Vestmannaeyjar',
  },

  {
    // Gervibarn Friðrik
    nationalId: '1204209090',
    firstName: 'Friðrik',
    middleName: 'Ari',
    lastName: 'Baldursson',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Eyjólfur
    nationalId: '0711196370',
    firstName: 'Eyjólfur',
    middleName: '',
    lastName: 'Baldursson',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Arnar
    nationalId: '1508154790',
    firstName: 'Arnar',
    middleName: '',
    lastName: 'Sigurðarson',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervimadur Afríka
    nationalId: '0101303019',
    firstName: 'Gervimaður',
    middleName: '',
    lastName: 'Afríka',
    gender: RegistryGender.Male,
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervibarn Stefán
    nationalId: '2508107410',
    firstName: 'Stefán',
    middleName: 'Eysteinn',
    lastName: 'Júlíusson',
    gender: RegistryGender.Male,
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervibarn Embla
    nationalId: '2508105630',
    firstName: 'Embla',
    middleName: '',
    lastName: 'Asksdóttir',
    gender: RegistryGender.Female,
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervibarn Sunna
    nationalId: '1110199320',
    firstName: 'Sunna',
    middleName: 'Hlín',
    lastName: 'Júlíusdóttir',
    gender: RegistryGender.Female,
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervimaður Útlönd
    nationalId: '0101307789',
    firstName: 'Gervimaður',
    middleName: '',
    lastName: 'Útlönd',
    gender: RegistryGender.Male,
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Útlönd
    nationalId: '1111111119',
    firstName: 'Sól',
    middleName: 'Rún',
    lastName: 'Gervimannsdóttir',
    gender: RegistryGender.Female,
    address: 'Urðarbraut 1',
    postalcode: 210,
    city: 'Garðabær',
  },
]

@Injectable()
export class NationalRegistryService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
    private personApi: NationalRegistryClientService,
  ) {}

  // Þjóðskrá API gender keys
  private mapGender(genderId: string): Gender {
    switch (genderId) {
      case '1':
      case '3':
        return RegistryGender.Male
      case '2':
      case '4':
        return RegistryGender.Female
      case '7':
      case '8':
        return RegistryGender.NonBinary
      default:
        return UncategorizedGender.Uncategorized
    }
  }

  private createNationalRegistryUser(
    response: IndividualDto,
  ): NationalRegistryUser {
    const address = response.legalDomicile ?? response.residence
    const nameParts = response.fullName?.split(' ') ?? []
    return {
      nationalId: response.nationalId,
      firstName: nameParts[0] ?? '',
      middleName: nameParts.slice(1, -1).join(' ') ?? '',
      lastName: nameParts.slice(-1).pop() ?? '',
      gender: this.mapGender(response.genderCode),
      address: address?.streetAddress ?? '',
      postalcode: parseInt(address?.postalCode ?? '0'),
      city: address?.locality ?? '',
    }
  }

  async getRelations(authUser: AuthUser): Promise<Array<string>> {
    return this.personApi.getCustodyChildren(authUser)
  }

  async getCustodians(
    auth: AuthUser,
    childNationalId: string,
  ): Promise<Array<NationalRegistryUser | null>> {
    const response = await this.personApi.getOtherCustodyParents(
      auth,
      childNationalId,
    )

    // Add the callee parent to custodians
    // Custody relation isn't circular/transitive
    response.push(auth.nationalId)

    const custodians = []
    for (const custodian of response) {
      const mappedCustodian = await this.getUser(custodian, auth)
      custodians.push(mappedCustodian)
    }
    return custodians
  }

  async getUser(
    nationalId: string,
    auth: AuthUser,
  ): Promise<NationalRegistryUser | null> {
    if (environment.environment !== 'prod') {
      const testUser = TEST_USERS.find(
        (testUser) => testUser.nationalId === nationalId,
      )
      if (testUser) {
        return testUser
      }
    }

    const response = await this.personApi.getIndividual(nationalId)

    if (!response) {
      return null
    }

    const mappedUser = this.createNationalRegistryUser(response)
    return mappedUser
  }
}
