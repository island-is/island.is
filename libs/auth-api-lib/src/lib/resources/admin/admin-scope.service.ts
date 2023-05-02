import { Op } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ApiScope } from '../models/api-scope.model'
import { AdminScopeDTO } from './dto/admin-scope.dto'
import { Client } from '../../clients/models/client.model'
import { ClientAllowedScope } from '../../clients/models/client-allowed-scope.model'

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

  mapApiScopesToDto({ name, description, displayName }: ApiScope) {
    return {
      name,
      description,
      displayName,
    }
  }

  async findApiScopesByTenantId(tenantId: string): Promise<AdminScopeDTO[]> {
    const apiScopes = await this.apiScope.findAll({
      where: {
        domainName: tenantId,
      },
    })

    return apiScopes.map(this.mapApiScopesToDto)
  }

  async findAllowedScopes({
    clientId,
    tenantId,
  }: {
    clientId: string
    tenantId: string
  }): Promise<AdminScopeDTO[]> {
    const client = await this.clientModel.findOne({
      where: {
        clientId,
        domainName: tenantId,
      },
      include: {
        model: ClientAllowedScope,
        as: 'allowedScopes',
        where: {
          scopeName: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT name FROM identity_resource)`,
            ),
          },
        },
        required: false,
      },
    })

    if (!client?.allowedScopes?.length) return []

    const scopeNames = client.allowedScopes.map((scope) => scope.scopeName)

    const apiScopes = await this.apiScope.findAll({
      where: {
        name: {
          [Op.in]: scopeNames,
        },
        enabled: true,
        domainName: tenantId,
      },
    })

    return apiScopes.map(this.mapApiScopesToDto)
  }
}
