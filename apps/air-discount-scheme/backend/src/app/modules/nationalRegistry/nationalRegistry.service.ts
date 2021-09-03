import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import * as kennitala from 'kennitala'
import { lastValueFrom } from 'rxjs'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  NationalRegistryGeneralLookupResponse,
  NationalRegistryFamilyLookupResponse,
  NationalRegistryUser,
  FamilyMember,
} from './nationalRegistry.types'
import { environment } from '../../../environments'

export const ONE_MONTH = 2592000 // seconds
export const CACHE_KEY = 'nationalRegistry'
const MAX_AGE_LIMIT = 18

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
    postalcode: 900,
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
]

@Injectable()
export class NationalRegistryService {
  constructor(
    private httpService: HttpService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  baseUrl = environment.nationalRegistry.url

  private getCacheKey(nationalId: string, suffix: 'user' | 'children'): string {
    return `${CACHE_KEY}_${nationalId}_${suffix}`
  }

  private createNationalRegistryUser(
    response: NationalRegistryGeneralLookupResponse,
  ): NationalRegistryUser | null {
    if (response.error) {
      return null
    }

    const parts = response.name.split(' ')
    return {
      nationalId: response.ssn,
      firstName: parts[0] || '',
      middleName: parts.slice(1, -1).join(' '),
      lastName: parts.slice(-1).pop() || '',
      gender: response.gender,
      address: response.address,
      postalcode: parseInt(response.postalcode),
      city: response.city,
    }
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
    }

    return user
  }

  private isParent(person: FamilyMember): boolean {
    return ['1', '2'].includes(person.gender)
  }

  private isChild(person: FamilyMember): boolean {
    return (
      !this.isParent(person) && kennitala.info(person.ssn).age < MAX_AGE_LIMIT
    )
  }

  async getRelatedChildren(nationalId: string): Promise<string[]> {
    if (environment.environment !== 'prod') {
      const testUser = TEST_USERS.find((user) => user.nationalId === nationalId)
      if (testUser) {
        return TEST_USERS.filter(
          (user) =>
            user.nationalId !== nationalId && user.address === testUser.address,
        ).map((user) => user.nationalId)
      }
    }

    const cacheKey = this.getCacheKey(nationalId, 'children')
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (cacheValue) {
      return cacheValue.children
    }

    const response: {
      data: [NationalRegistryFamilyLookupResponse]
    } = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/family-lookup?ssn=${nationalId}`),
    )

    const data = response.data[0]
    if (data.error) {
      this.logger.error(
        `Could not find family members for User<${nationalId}> due to: ${data.error}`,
      )
      return []
    }

    const family = data.results
    const user = family.find((person) => person.ssn === nationalId)
    if (!user) {
      this.logger.error(
        `Could not find User<${nationalId}> in list of family members`,
      )
      return []
    }

    let children: string[] = []
    if (this.isParent(user)) {
      children = family
        .filter((person) => person.ssn !== nationalId && this.isChild(person))
        .map((person) => person.ssn)
    }

    await this.cacheManager.set(cacheKey, { children }, { ttl: ONE_MONTH })

    return children
  }
}
