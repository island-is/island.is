import { Sequelize } from 'sequelize-typescript'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { validateClientId } from '@island.is/auth/shared'

import { ApiScope } from '../models/api-scope.model'
import { Client } from '../../clients/models/client.model'
import { ClientCreateScopeDTO } from './dto/client-create-scope.dto'
import { ApiScopeUserClaim } from '../models/api-scope-user-claim.model'
import { ApiScopeDTO } from '../dto/api-scope.dto'
import { TranslationService } from '../../translation/translation.service'
import { TranslatedValueDto } from '../../translation/dto/translated-value.dto'
import { AdminScopeDTO } from './dto/admin-scope.dto'

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
    private readonly translationService: TranslationService,
    private sequelize: Sequelize,
  ) {}

  async findApiScopesByTenantId(tenantId: string): Promise<AdminScopeDTO[]> {
    const apiScopes = await this.apiScope.findAll({
      where: {
        domainName: tenantId,
      },
    })

    const scopeTranslations = await this.translationService.findTranslationMap(
      'apiscope',
      apiScopes.map(({ name }) => name),
    )

    return apiScopes.map((apiScope) => ({
      ...apiScope.toDTO(),
      displayName: this.formatTranslationsByKey(
        'displayName',
        apiScope.displayName,
        scopeTranslations.get(apiScope.name),
      ),
      description: this.formatTranslationsByKey(
        'description',
        apiScope.description,
        scopeTranslations.get(apiScope.name),
      ),
    }))
  }

  private formatTranslationsByKey(
    key: string,
    defaultValueIS: string,
    translations?: Map<string, Map<string, string>>,
  ): TranslatedValueDto[] {
    return [
      {
        locale: 'is',
        value: defaultValueIS,
      },
      ...Array.from(translations || []).map(([locale, translation]) => ({
        locale,
        value: translation.get(key) ?? '',
      })),
    ]
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
  }): Promise<AdminScopeDTO> {
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

    const scopeTranslations = await this.translationService.findTranslationMap(
      'apiscope',
      [apiScope.name],
    )

    const translations = scopeTranslations.get(apiScope.name)

    return {
      ...apiScope.toDTO(),
      displayName: this.formatTranslationsByKey(
        'displayName',
        apiScope.displayName,
        translations,
      ),
      description: this.formatTranslationsByKey(
        'description',
        apiScope.description,
        translations,
      ),
    }
  }

  /**
   * Creates a new scope in api_scope table and adds row in api_scope_user_claim table with the newly created scope
   */
  async createScope(
    tenantId: string,
    input: ClientCreateScopeDTO,
  ): Promise<ApiScopeDTO> {
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
