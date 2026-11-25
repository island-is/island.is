import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache as CacheManager } from 'cache-manager'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { NationalRegistryUser } from './nationalRegistry.types'
import { environment } from '../../../environments'
import {
  EinstaklingurDTOAllt,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { Gender } from '@island.is/air-discount-scheme/types'
import { isDefined } from '@island.is/shared/utils'

const TEST_USERS: NationalRegistryUser[] = [
  {
    // Test User Ísabella
    nationalId: '1902982649',
    givenName: 'Ísabella EagleAir',
    fullName: 'Ísabella EagleAir Developersdóttir',
    address: 'Hrimblugrugg 2',
    city: 'Vestmannaeyjar',
    gender: 'kvk',
    postalcode: 900,
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111990000',
    givenName: 'Minnsti Drengur',
    fullName: 'Minnsti Drengur Ísabelluson',
    gender: 'kk',
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111994500',
    givenName: 'Stærri Drengur',
    fullName: 'Stærri Drengur Ísabelluson',
    gender: 'kk',
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111997600',
    givenName: 'Lítil Stúlka',
    fullName: 'Lítil Stúlka Ísabelludóttir',
    gender: 'kvk',
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ísabellu
    nationalId: '1111999300',
    givenName: 'Stærsta Stúlka',
    fullName: 'Stærsta Stúlka Ísabelludóttir',
    gender: 'kvk',
    address: 'Hrimblugrugg 2',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervimadur Ameríka
    nationalId: '0101302989',
    givenName: 'Gervimaður',
    fullName: 'Gervimaður Ameríka',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 600,
    city: 'Akureyri',
  },
  {
    // Gervimadur Færeyjar
    nationalId: '0101302399',
    givenName: 'Gervimaður',
    fullName: 'Gervimaður Færeyjar',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 100,
    city: 'Reykjavík',
  },
  {
    // Gervibarn Ameríku
    nationalId: '2222222229',
    givenName: 'Litli Jói',
    fullName: 'Litli Jói Ameríkuson',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 100,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Ameríku
    nationalId: '3333333339',
    givenName: 'Litla Jóna',
    fullName: 'Litla Jóna Ameríkudóttir',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 100,
    city: 'Vestmannaeyjar',
  },

  {
    // Gervibarn Friðrik
    nationalId: '1204209090',
    givenName: 'Friðrik Ari',
    fullName: 'Friðrik Ari Baldursson',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Eyjólfur
    nationalId: '0711196370',
    givenName: 'Eyjólfur',
    fullName: 'Eyjólfur Baldursson',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Arnar
    nationalId: '1508154790',
    givenName: 'Arnar',
    fullName: 'Arnar Sigurðarson',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervimadur Afríka
    nationalId: '0101303019',
    givenName: 'Gervimaður',
    fullName: 'Gervimaður Afríka',
    gender: 'kk',
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervibarn Stefán
    nationalId: '2508107410',
    givenName: 'Stefán Eysteinn',
    fullName: 'Stefán Eysteinn Júlíusson',
    gender: 'kk',
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervibarn Embla
    nationalId: '2508105630',
    givenName: 'Embla',
    fullName: 'Embla Asksdóttir',
    gender: 'kvk',
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervibarn Sunna
    nationalId: '1110199320',
    givenName: 'Sunna Hlín',
    fullName: 'Sunna Hlín Júlíusdóttir',
    gender: 'kvk',
    address: 'Urðarbraut 1',
    postalcode: 540,
    city: 'Blönduós',
  },
  {
    // Gervimaður Útlönd
    nationalId: '0101307789',
    givenName: 'Gervimaður',
    fullName: 'Gervimaður Útlönd',
    gender: 'kk',
    address: 'Vallargata 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
  {
    // Gervibarn Útlönd
    nationalId: '1111111119',
    givenName: 'Sól Rún',
    fullName: 'Sól Rún Gervimannsdóttir',
    gender: 'kvk',
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
    private personApiV3: NationalRegistryV3ClientService,
  ) {}

  // Þjóðskrá API gender keys
  private mapGender(genderId: string): Gender {
    switch (genderId) {
      case '1':
      case '3':
        return 'kk'
      case '2':
      case '4':
        return 'kvk'
      case '7':
      case '8':
        return 'x'
      default:
        return 'manneskja'
    }
  }

  private createNationalRegistryUser(
    response: EinstaklingurDTOAllt,
    nationalId: string,
  ): NationalRegistryUser {
    const address = response.heimilisfang ?? response.itarupplysingar?.adsetur
    const postnumer = address?.postnumer
    return {
      nationalId: response.kennitala ?? nationalId,
      givenName: response.fulltNafn?.eiginNafn ?? '',
      fullName: response.fulltNafn?.fulltNafn ?? response.nafn ?? '',
      gender: this.mapGender(response.kyn?.kynKodi ?? ''),
      address: address?.husHeiti ?? '',
      postalcode:
        postnumer && /^\d+$/.test(postnumer) ? parseInt(postnumer, 10) : 0,
      city: address?.poststod ?? '',
    }
  }

  async getRelations(authUser: AuthUser): Promise<Array<string>> {
    try {
      const parent = await this.personApiV3.getAllDataIndividual(
        authUser.nationalId,
      )
      return (parent?.forsja?.born ?? [])
        .map((child) => child.barnKennitala)
        .filter(isDefined)
    } catch (e) {
      this.logger.info('getRelations custodychildren not successful', {
        category: 'ads-backend',
        e,
      })
      throw e
    }
  }

  async getCustodians(
    childNationalId: string,
  ): Promise<Array<NationalRegistryUser | null>> {
    const response = (
      (await this.personApiV3.getCustodians(childNationalId)) ?? []
    )
      .map((custodian) => custodian.forsjaAdiliKennitala)
      .filter(isDefined)

    const custodians = []
    for (const custodian of response) {
      const mappedCustodian = await this.getUser(custodian)
      custodians.push(mappedCustodian)
    }
    return custodians
  }

  async getUser(nationalId: string): Promise<NationalRegistryUser | null> {
    if (environment.environment !== 'prod') {
      const testUser = TEST_USERS.find(
        (testUser) => testUser.nationalId === nationalId,
      )
      if (testUser) {
        return testUser
      }
    }

    const response = await this.personApiV3.getAllDataIndividual(nationalId)
    if (!response) {
      this.logger.info('getUser individual not found', {
        category: 'ads-backend',
      })
      return null
    }

    return this.createNationalRegistryUser(response, nationalId)
  }
}
