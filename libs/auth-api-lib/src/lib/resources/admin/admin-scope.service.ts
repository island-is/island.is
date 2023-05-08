import { Sequelize } from 'sequelize-typescript'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { validateClientId } from '@island.is/auth/shared'

import { ApiScope } from '../models/api-scope.model'
import { AdminScopeDTO } from './dto/admin-scope.dto'
import { Client } from '../../clients/models/client.model'
import { ClientCreateScopeDTO } from './dto/client-create-scope.dto'
import { ApiScopeUserClaim } from '../models/api-scope-user-claim.model'
import { ApiScopesDTO } from '../dto/api-scopes.dto'

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
    @InjectModel(ApiScopeUserClaim)
    private readonly apiScopeUserClaim: typeof ApiScopeUserClaim,
    private sequelize: Sequelize,
  ) {}

  async findApiScopesByTenantId(tenantId: string): Promise<AdminScopeDTO[]> {
    const apiScopes = await this.apiScope.findAll({
      where: {
        domainName: tenantId,
      },
    })

    return apiScopes.map((apiScope) => new AdminScopeDTO(apiScope))
  }

  /**
   * Finds a scope by name and tenantId
   */
  async findApiScope({
    name,
    tenantId,
  }: {
    name: string
    tenantId: string
  }): Promise<ApiScopesDTO> {
    const apiScope = await this.apiScope.findOne({
      where: {
        name,
        domainName: tenantId,
      },
    })

    if (!apiScope) {
      throw new BadRequestException(
        `Scope name "${name}" does not exist for tenant ${tenantId}`,
      )
    }

    return apiScope.toDTO()
  }

  /**
   * Creates a new scope in api_scope table and adds row in api_scope_user_claim table with the newly created scope
   */
  async createScope(
    tenantId: string,
    input: ClientCreateScopeDTO,
  ): Promise<ApiScopesDTO> {
    if (
      !validateClientId({
        prefix: tenantId,
        value: input.name,
      })
    ) {
      throw new BadRequestException(`Invalid scope name: "${input.name}"`)
    }

    const existingScope = await this.apiScope.findOne({
      where: {
        name: input.name,
      },
    })

    if (existingScope) {
      throw new BadRequestException(`Scope name "${input.name}" already exists`)
    }

    const apiScope = await this.sequelize.transaction(async (transaction) => {
      const scope = await this.apiScope.create(
        {
          ...input,
          domainName: tenantId,
        },
        { transaction },
      )

      await this.apiScopeUserClaim.create(
        {
          apiScopeId: scope.id,
          apiScopeName: scope.name,
          claimName: 'nationalId',
        },
        {
          transaction,
        },
      )

      return scope
    })

    return apiScope.toDTO()
  }
}
