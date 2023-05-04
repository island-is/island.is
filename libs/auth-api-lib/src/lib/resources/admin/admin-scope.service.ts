import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiScope } from '../models/api-scope.model'
import { AdminScopeDTO } from './dto/admin-scope.dto'
import { Client } from '../../clients/models/client.model'

/**
 * This is a service that is used to access the admin scopes
 */
@Injectable()
export class AdminScopeService {
  constructor(
    @InjectModel(ApiScope)
    private readonly apiScope: typeof ApiScope,
    @InjectModel(Client)
    private readonly clientModel: typeof Client,
  ) {}

  async findApiScopesByTenantId(tenantId: string): Promise<AdminScopeDTO[]> {
    const apiScopes = await this.apiScope.findAll({
      where: {
        domainName: tenantId,
      },
    })

    return apiScopes.map((apiScope) => new AdminScopeDTO(apiScope))
  }
}
