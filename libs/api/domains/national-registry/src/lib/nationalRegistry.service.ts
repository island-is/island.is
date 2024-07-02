import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { Birthplace, Citizenship, Housing, Spouse } from './shared/models'
import { Name } from './shared/models/name.model'
import { SharedPerson } from './shared/types'
import { BrokerService } from './v3/broker.service'

@Injectable()
export class NationalRegistryService {
  constructor(
    private readonly v3: BrokerService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  getPerson(nationalId: string, useFakeData?: boolean) {
    return this.v3.getPerson(nationalId, undefined, useFakeData)
  }

  getChildCustody(nationalId: string, data?: SharedPerson) {
    return this.v3.getChildrenCustodyInformation(
      nationalId,
      data?.rawData,
      data?.useFakeData,
    )
  }

  async getChildDetails(nationalId: string, useFakeData?: boolean) {
    return this.v3.getChildDetails(nationalId, useFakeData)
  }

  getBiologicalChildren(nationalId: string, data?: SharedPerson) {
    return this.v3.getBiologicalFamily(nationalId, data?.rawData)
  }

  getCustodians(nationalId: string, data?: SharedPerson) {
    return this.v3.getCustodians(nationalId, data?.rawData)
  }

  getParents(nationalId: string, data?: SharedPerson) {
    return this.v3.getParents(nationalId, data?.rawData)
  }

  getBirthplace(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Birthplace | null> {
    return this.v3.getBirthplace(nationalId, data?.rawData)
  }

  getCitizenship(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Citizenship | null> {
    return this.v3.getCitizenship(nationalId, data?.rawData)
  }

  async getHousing(
    nationalId: string,
    data?: SharedPerson,
  ): Promise<Housing | null> {
    return this.v3.getHousing(nationalId, data?.rawData)
  }

  getName(nationalId: string, data?: SharedPerson): Promise<Name | null> {
    return this.v3.getName(nationalId, data?.rawData)
  }

  getSpouse(nationalId: string, data?: SharedPerson): Promise<Spouse | null> {
    return this.v3.getSpouse(nationalId, data?.rawData)
  }

  // Deprecated schemas
  getUser(nationalId: string) {
    return this.v3.getUser(nationalId)
  }

  getChildren(nationalId: string) {
    return this.v3.getChildren(nationalId)
  }
}
