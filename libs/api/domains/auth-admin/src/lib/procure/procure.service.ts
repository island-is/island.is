import { Injectable } from '@nestjs/common'

import { ProcureCompany } from './model/company.model'
import { CompanyRelationships } from './model/company-relationships.model'
import { RskProcuringClient } from '@island.is/clients/rsk/procuring'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class ProcureService {
  constructor(private readonly rskProcuringClient: RskProcuringClient) {}

  /**
   * Search for procure companies by name or national id
   */
  async getCompanies(user: User, search: string): Promise<ProcureCompany[]> {
    return this.rskProcuringClient.getLegalEntities(user, search)
  }

  async getCompanyRelationships(
    user: User,
    nationalId: string,
  ): Promise<CompanyRelationships | null> {
    return this.rskProcuringClient.getLegalEntity(user, nationalId)
  }
}
