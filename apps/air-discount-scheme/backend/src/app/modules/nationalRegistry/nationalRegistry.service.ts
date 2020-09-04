import { Inject, Injectable, CACHE_MANAGER, HttpService } from '@nestjs/common'
import CacheManager from 'cache-manager'
import * as kennitala from 'kennitala'

import {
  NationalRegistryGeneralLookupResponse,
  NationalRegistryFamilyLookupResponse,
  NationalRegistryUser,
} from './nationalRegistry.types'
import { environment } from '../../../environments'

export const ONE_MONTH = 2592000 // seconds
export const CACHE_KEY = 'nationalRegistry'
const MAX_AGE_LIMIT = 18

const TEST_USERS: NationalRegistryUser[] = [
  {
    // Gervimadur Ameríka
    nationalId: '0101302989',
    firstName: 'Gervimaður',
    middleName: '',
    lastName: 'Ameríka',
    gender: 'kk',
    address: 'Bessastaðir 1',
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
    address: 'Bessastaðir 1',
    postalcode: 900,
    city: 'Vestmannaeyjar',
  },
]

@Injectable()
export class NationalRegistryService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager,
  ) {}

  baseUrl = environment.nationalRegistry.url

  private getCacheKey(nationalId: string, suffix: 'user' | 'children'): string {
    return `${CACHE_KEY}_${nationalId}_${suffix}`
  }

  private createNationalRegistryUser(
    response: NationalRegistryGeneralLookupResponse,
  ): NationalRegistryUser {
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
      postalcode: response.postalcode,
      city: response.city,
    }
  }

  async getUser(nationalId: string): Promise<NationalRegistryUser> {
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
    } = await this.httpService
      .get(`${this.baseUrl}/general-lookup?ssn=${nationalId}`)
      .toPromise()

    const user = this.createNationalRegistryUser(response.data[0])
    if (user) {
      await this.cacheManager.set(cacheKey, { user }, { ttl: ONE_MONTH })
    }

    return user
  }

  private isChild(nationalId: string): boolean {
    return kennitala.info(nationalId).age < MAX_AGE_LIMIT
  }

  async getRelatedChildren(nationalId: string): Promise<string[]> {
    if (environment.environment !== 'prod') {
      const testUser = TEST_USERS.find(
        (testUser) => testUser.nationalId === nationalId,
      )
      if (testUser) {
        return TEST_USERS.filter(
          (testUser) => testUser.nationalId !== nationalId,
        ).map((testUser) => testUser.nationalId)
      }
    }

    const cacheKey = this.getCacheKey(nationalId, 'children')
    const cacheValue = await this.cacheManager.get(cacheKey)
    if (cacheValue) {
      return cacheValue.children
    }

    const response: {
      data: [NationalRegistryFamilyLookupResponse]
    } = await this.httpService
      .get(`${this.baseUrl}/family-lookup?ssn=${nationalId}`)
      .toPromise()

    const children = response.data[0].results
      .filter((person) => person.ssn !== nationalId && this.isChild(person.ssn))
      .map((person) => person.ssn)
    if (children) {
      await this.cacheManager.set(cacheKey, { children }, { ttl: ONE_MONTH })
    }

    return children
  }
}
