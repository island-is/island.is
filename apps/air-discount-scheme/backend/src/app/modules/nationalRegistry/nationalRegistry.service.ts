import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  NationalRegistryUser,
} from './nationalRegistry.types'
import { environment } from '../../../environments'
import {
  EinstaklingarApi,
  EinstaklingarGetEinstaklingurRequest,
  EinstaklingarGetForsjaForeldriRequest,
  EinstaklingarGetForsjaRequest,
  Einstaklingsupplysingar,
} from '@island.is/clients/national-registry-v2'
import {
  AuthMiddleware,
  AuthMiddlewareOptions,
  User as AuthUser,
} from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { lastValueFrom } from 'rxjs'

export const ONE_MONTH = 2592000 // seconds
export const CACHE_KEY = 'nationalRegistry'
export const MAX_AGE_LIMIT = 1800

const TEST_USERS: NationalRegistryUser[] = [
  {
    // Test User Ísabella
    nationalId: '1902982649',
    firstName: 'Ísabella',
    address: 'Hrimblugrugg 2',
    city: 'Vestmannaeyjar',
    gender: 'kvk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kvk',
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
    gender: 'kvk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kk',
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
    gender: 'kvk',
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
    gender: 'kvk',
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
    gender: 'kk',
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
    private nationalRegistryIndividualsApi: EinstaklingarApi,
  ) {}

  personApiWithAuth(authUser: AuthUser) {
    return this.nationalRegistryIndividualsApi.withMiddleware(
      new AuthMiddleware(
        authUser,
        environment.nationalRegistry
          .authMiddlewareOptions as AuthMiddlewareOptions,
      ),
    )
  }

  // Þjóðskrá API gender keys
  private mapGender(genderId: string): 'kk' | 'kvk' | 'hvk' | 'óvíst' {
    if (['1', '3'].includes(genderId)) {
      return 'kk'
    } else if (['2', '4'].includes(genderId)) {
      return 'kvk'
    } else if (['7', '8'].includes(genderId)) {
      return 'hvk'
    }
    return 'óvíst'
  }

  private createNationalRegistryUser(
    response: Einstaklingsupplysingar,
  ): NationalRegistryUser {
    const parts = response.fulltNafn?.split(' ') ?? []
    return {
      nationalId: response.kennitala,
      firstName: parts[0] || '',
      middleName: parts.slice(1, -1).join(' '),
      lastName: parts.slice(-1).pop() || '',
      gender: this.mapGender(response.kynkodi),
      address: response.logheimili?.heiti ?? response.adsetur?.heiti ?? '',
      postalcode: parseInt(
        response.logheimili?.postnumer ?? response.adsetur?.postnumer ?? '0',
      ),
      city: response.logheimili?.stadur ?? response.adsetur?.stadur ?? '',
    }
  }

  async getRelations(authUser: AuthUser): Promise<Array<string>> {
    const response = await this.personApiWithAuth(authUser)
      .einstaklingarGetForsja(<EinstaklingarGetForsjaRequest>{
        id: authUser.nationalId,
      })
      .catch(this.handle404)

    if (response === undefined) {
      return []
    }
    return response
  }

  async getCustodians(
    auth: AuthUser,
    childNationalId: string,
  ): Promise<Array<NationalRegistryUser | null>> {
    const response = await this.personApiWithAuth(auth)
      .einstaklingarGetForsjaForeldri(<EinstaklingarGetForsjaForeldriRequest>{
        id: auth.nationalId,
        barn: childNationalId,
      })
      .catch(this.handle404)

    if (response === undefined) {
      return []
    }

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

    const response = await this.personApiWithAuth(auth)
      .einstaklingarGetEinstaklingur(<EinstaklingarGetEinstaklingurRequest>{
        id: nationalId,
      })
      .catch(this.handle404)

    if (!response) {
      return null
    }

    const mappedUser = this.createNationalRegistryUser(response)
    return mappedUser
  }

  /*
  async getUserOld(nationalId: string): Promise<NationalRegistryUser | null> {
    if (environment.environment !== 'prod') {
      const testUser = TEST_USERS.find(
        (testUser) => testUser.nationalId === nationalId,
      )
      if (testUser) {
        return testUser
      }
    }
    const cacheKey = this.getCacheKey(nationalId, 'user')
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (cacheValue) {
      return cacheValue.user
    }
    const response: {
      data: [NationalRegistryGeneralLookupResponse]
    } = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/general-lookup?ssn=${nationalId}`),
    )

    const user = this.createNationalRegistryUser(response.data[0])
    if (user) {
      await this.cacheManager.set(cacheKey, { user }, { ttl: ONE_MONTH })
    } else if (user === null) {
      this.logger.error(
        `National Registry general lookup failed for User<${nationalId}> due to: ${response.data[0].error}`,
      )
    }
    return user
  }
  */

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return undefined
    }
    throw error
  }
}
