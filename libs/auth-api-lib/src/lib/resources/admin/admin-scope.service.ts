import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiScope } from '../models/api-scope.model'
import { AdminScopeDto } from './dto/admin-scope.dto'

/**
 * This is a service that is used to access the admin scopes
 */
@Injectable()
export class AdminScopeService {
  constructor(
    @InjectModel(ApiScope)
    private readonly apiScope: typeof ApiScope,
  ) {}

  mapApiScopesToDto({ name, description, displayName }: ApiScope) {
    return {
      name,
      description,
      displayName,
    }
  }

  async findApiScopesByTenantId(tenantId: string): Promise<AdminScopeDto[]> {
    const apiScopes = await this.apiScope.findAll({
      where: {
        domainName: tenantId,
      },
    })

    return apiScopes.map(this.mapApiScopesToDto)
  }
}
