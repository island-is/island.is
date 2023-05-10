import { Sequelize } from 'sequelize-typescript'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { validateClientId } from '@island.is/auth/shared'

import { ApiScope } from '../models/api-scope.model'
import { Client } from '../../clients/models/client.model'
import { ClientCreateScopeDTO } from './dto/client-create-scope.dto'
import { ApiScopeUserClaim } from '../models/api-scope-user-claim.model'
import { TranslationService } from '../../translation/translation.service'
import { AdminScopeDTO } from './dto/admin-scope.dto'
import { AdminTranslationService } from './services/admin-translation.service'
import { NoContentException } from '@island.is/nest/problem'

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
    private readonly adminTranslationService: AdminTranslationService,
    private sequelize: Sequelize,
  ) {}

  /**
   * Creates new api scope translations
   */
  private async getApiScopeTranslations(keys: string[]) {
    return this.translationService.findTranslationMap('apiscope', keys)
  }

  /**
   * Maps api scope to admin api scope
   */
  private mapApiScopeToAdminScopeDTO(
    apiScope: ApiScope,
    translations: Map<string, Map<string, Map<string, string>>>,
  ): AdminScopeDTO {
    return {
      ...apiScope.toDTO(),
      displayName: this.adminTranslationService.createTranslatedValueDTOs({
        key: 'displayName',
        defaultValueIS: apiScope.displayName,
        translations: translations.get(apiScope.name),
      }),
      description: this.adminTranslationService.createTranslatedValueDTOs({
        key: 'description',
        defaultValueIS: apiScope.description,
        translations: translations.get(apiScope.name),
      }),
    }
  }

  async findAllByTenantId(tenantId: string): Promise<AdminScopeDTO[]> {
    const apiScopes = await this.apiScope.findAll({
      where: {
        domainName: tenantId,
      },
    })

    const translations = await this.getApiScopeTranslations(
      apiScopes.map(({ name }) => name),
    )

    return apiScopes.map((apiScope) =>
      this.mapApiScopeToAdminScopeDTO(apiScope, translations),
    )
  }

  /**
   * Finds a scope by name and tenantId
   */
  async findByTenantIdAndScopeName({
    scopeName,
    tenantId,
  }: {
    scopeName: string
    tenantId: string
  }): Promise<AdminScopeDTO> {
    const apiScope = await this.apiScope.findOne({
      where: {
        name: scopeName,
        domainName: tenantId,
        enabled: true,
      },
    })

    if (!apiScope) {
      throw new NoContentException()
    }

    const translations = await this.getApiScopeTranslations([apiScope.name])

    return this.mapApiScopeToAdminScopeDTO(apiScope, translations)
  }

  /**
   * Creates a new scope in api_scope table and adds row in api_scope_user_claim table with the newly created scope
   */
  async createScope(
    tenantId: string,
    input: ClientCreateScopeDTO,
  ): Promise<AdminScopeDTO> {
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

    const translations = await this.getApiScopeTranslations([apiScope.name])

    return this.mapApiScopeToAdminScopeDTO(apiScope, translations)
  }
}
