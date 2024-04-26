import { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { Inject, Injectable, NotImplementedException } from '@nestjs/common'
import { Birthplace, Citizenship, Housing, Spouse } from './shared/models'
import { Name } from './shared/models/name.model'
import { SharedPerson } from './shared/types'
import { SoffiaService } from './v1/soffia.service'
import { BrokerService } from './v3/broker.service'

type ApiVersion = 'v1' | 'v3'

@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly v1: SoffiaService,
    private readonly v3: BrokerService,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async getApi(user: User, api: ApiVersion = 'v1') {
    if (api === 'v3') {
      return api
    }

    const disableSoffia = await this.featureFlagService.getValue(
      Features.disableSoffia,
      false,
      user,
    )
    if (disableSoffia) {
      return 'v3'
    } else {
      return api
    }
  }

  getPerson(nationalId: string, api: ApiVersion = 'v1', useFakeData?: boolean) {
    return api === 'v3'
      ? this.v3.getPerson(nationalId, undefined, useFakeData)
      : this.v1.getPerson(nationalId)
  }

  getChildCustody(nationalId: string, data?: SharedPerson) {
    if (data?.api === 'v3') {
      return this.v3.getChildrenCustodyInformation(
        nationalId,
        data?.rawData,
        data?.useFakeData,
      )
    }

    return this.v1.getChildCustody(nationalId, data?.rawData)
  }

  async getChildDetails(
    nationalId: string,
    api: ApiVersion,
    useFakeData?: boolean,
  ) {
    if (api === 'v3') {
      return this.v3.getChildDetails(nationalId, useFakeData)
    }
    return this.v1.getPerson(nationalId)
  }

  getCustodians(
    nationalId: string,
    userNationalId: string,
    data?: SharedPerson,
  ) {
    return data?.api === 'v3'
      ? this.v3.getCustodians(nationalId, data?.rawData)
      : this.v1.getCustodians(nationalId, userNationalId, data?.rawData)
  }

  getParents(nationalId: string, data?: SharedPerson, userNationalId?: string) {
    return data?.api === 'v3'
      ? this.v3.getParents(nationalId, data?.rawData)
      : this.v1.getParents(userNationalId, data?.rawData)
  }

  getBirthplace(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Birthplace | null> {
    return data?.api === 'v3'
      ? this.v3.getBirthplace(nationalId, data?.rawData)
      : this.v1.getBirthplace(nationalId, data?.rawData)
  }

  getCitizenship(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Citizenship | null> {
    return data?.api === 'v3'
      ? this.v3.getCitizenship(nationalId, data?.rawData)
      : this.v1.getCitizenship(nationalId, data?.rawData)
  }

  async getHousing(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Housing | null> {
    if (data?.api === 'v1') {
      const family = await this.v1.getFamily(nationalId)
      return {
        domicileId: data?.rawData?.Fjolsknr ?? '',
        address: {
          code: data?.rawData?.LoghHusk,
          lastUpdated: data?.rawData?.LoghHuskBreytt,
          streetAddress:
            data?.rawData?.Logheimili || data?.address?.streetAddress,
          city:
            data?.rawData?.LogheimiliSveitarfelag || data?.address?.city || '',
          postalCode: data?.rawData?.Postnr || data?.address?.postalCode,
        },
        domicileInhabitants: family,
      }
    }
    return this.v3.getHousing(nationalId, data?.rawData)
  }

  getName(nationalId: string, data?: SharedPerson): Promise<Name | null> {
    return data?.api === 'v3'
      ? this.v3.getName(nationalId, data?.rawData)
      : this.v1.getName(nationalId, data?.rawData)
  }

  getSpouse(nationalId: string, data?: SharedPerson): Promise<Spouse | null> {
    return data?.api === 'v3'
      ? this.v3.getSpouse(nationalId, data?.rawData)
      : this.v1.getSpouse(nationalId, data?.rawData)
  }

  // Deprecated schemas
  getUser(nationalId: string, api: ApiVersion = 'v1') {
    return api === 'v3'
      ? this.v3.getUser(nationalId)
      : this.v1.getUser(nationalId)
  }

  getChildren(nationalId: string, api: ApiVersion = 'v1') {
    return api === 'v3'
      ? this.v3.getChildren(nationalId)
      : this.v1.getChildren(nationalId)
  }

  getFamily(nationalId: string, api: ApiVersion = 'v1') {
    // Returning null in v3 as this schema should have no clients.
    return api === 'v3' ? null : this.v1.getFamily(nationalId)
  }

  getFamilyMemberDetails(
    nationalId: string,
    familyMemberNationalId: string,
    api: ApiVersion = 'v1',
  ) {
    // Returning null in v3 as this schema should have no clients.
    return api === 'v3'
      ? null
      : this.v1.getFamilyMemberDetails(nationalId, familyMemberNationalId)
  }
}
