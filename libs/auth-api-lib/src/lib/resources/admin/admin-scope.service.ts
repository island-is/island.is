import { Sequelize } from 'sequelize-typescript'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Transaction } from 'sequelize'
import omit from 'lodash/omit'

import { validateClientId } from '@island.is/auth/shared'
import { isDefined } from '@island.is/shared/utils'

import { ApiScope } from '../models/api-scope.model'
import { Client } from '../../clients/models/client.model'
import { AdminCreateScopeDto } from './dto/admin-create-scope.dto'
import { ApiScopeUserClaim } from '../models/api-scope-user-claim.model'
import { AdminScopeDTO } from './dto/admin-scope.dto'
import { AdminTranslationService } from './services/admin-translation.service'
import { NoContentException } from '@island.is/nest/problem'
import { AdminPatchScopeDto } from './dto/admin-patch-scope.dto'
import { TranslatedValueDto } from '../../translation/dto/translated-value.dto'
import { TranslationService } from '../../translation/translation.service'

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
    private readonly adminTranslationService: AdminTranslationService,
    private readonly translationService: TranslationService,
    private sequelize: Sequelize,
  ) {}

  async findAllByTenantId(tenantId: string): Promise<AdminScopeDTO[]> {
    const apiScopes = await this.apiScope.findAll({
      where: {
        domainName: tenantId,
        enabled: true,
      },
    })

    const translations =
      await this.adminTranslationService.getApiScopeTranslations(
        apiScopes.map(({ name }) => name),
      )

    return apiScopes.map((apiScope) =>
      this.adminTranslationService.mapApiScopeToAdminScopeDTO(
        apiScope,
        translations,
      ),
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

    const translations =
      await this.adminTranslationService.getApiScopeTranslations([
        apiScope.name,
      ])

    return this.adminTranslationService.mapApiScopeToAdminScopeDTO(
      apiScope,
      translations,
    )
  }

  /**
   * Creates a new scope in api_scope table and adds row in api_scope_user_claim table with the newly created scope
   */
  async createScope(
    tenantId: string,
    input: AdminCreateScopeDto,
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

    const translatedValuesErrorMsg =
      'Scope displayName and description are required'

    if (!input.displayName || !input.description) {
      throw new BadRequestException(translatedValuesErrorMsg)
    }

    const [displayName, description] = [
      input.displayName,
      input.description,
    ].map(
      (translatedValueDto) =>
        this.adminTranslationService.findTranslationByLocale(
          translatedValueDto,
          'is',
        )?.value,
    )

    if (!displayName || !description) {
      throw new BadRequestException(translatedValuesErrorMsg)
    }

    const apiScope = await this.sequelize.transaction(async (transaction) => {
      const scope = await this.apiScope.create(
        {
          ...input,
          displayName,
          description,
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

      await this.updateScopeTranslatedValueFields(
        input.name,
        input,
        transaction,
      )

      return scope
    })

    const translations =
      await this.adminTranslationService.getApiScopeTranslations([
        apiScope.name,
      ])

    return this.adminTranslationService.mapApiScopeToAdminScopeDTO(
      apiScope,
      translations,
    )
  }

  /**
   * Finds all none icelandic translated values
   */
  private findNoneIcelandicTranslatedValueDto(
    translatedValueDTO: TranslatedValueDto[],
  ): TranslatedValueDto[] | undefined {
    return translatedValueDTO.filter(
      (translatedValue) => translatedValue.locale !== 'is',
    )
  }

  /**
   * Updates translations for scope fields which are of type  TranslatedValueDto, i.e. displayName and description
   */
  private async updateScopeTranslatedValueFields(
    scopeName: string,
    input: Pick<AdminPatchScopeDto, 'displayName' | 'description'>,
    transaction: Transaction,
  ) {
    // Find all translations that are not Icelandic for displayName and description
    const translationNames: Record<
      keyof Pick<AdminScopeDTO, 'displayName' | 'description'>,
      TranslatedValueDto[] | undefined
    > = {
      displayName:
        input.displayName &&
        this.findNoneIcelandicTranslatedValueDto(input.displayName),
      description:
        input.description &&
        this.findNoneIcelandicTranslatedValueDto(input.description),
    }

    // Update or create translations for all fields in translationNames
    await Promise.all(
      Object.entries(translationNames)
        .map(([property, translatedValueDtos]) => {
          if (translatedValueDtos && translatedValueDtos.length > 0) {
            return translatedValueDtos.map((translatedValueDto) =>
              this.translationService.upsertTranslation(
                {
                  className: 'apiscope',
                  key: scopeName,
                  language: translatedValueDto.locale,
                  property,
                  value: translatedValueDto.value,
                },
                transaction,
              ),
            )
          }
        })
        .filter(isDefined)
        .flat(),
    )
  }

  /**
   * Updates a scope by scope name and tenant id in api_scope table
   */
  async updateScope({
    scopeName,
    tenantId,
    input,
  }: {
    scopeName: string
    tenantId: string
    input: AdminPatchScopeDto
  }): Promise<AdminScopeDTO> {
    if (Object.keys(input).length === 0) {
      throw new BadRequestException('No fields provided to update.')
    }

    // Check if scope exists
    const existingScope = await this.apiScope.findOne({
      where: {
        name: scopeName,
        domainName: tenantId,
        enabled: true,
      },
    })

    if (!existingScope) {
      throw new NoContentException()
    }

    const displayName =
      input.displayName &&
      this.adminTranslationService.findTranslationByLocale(
        input.displayName,
        'is',
      )?.value
    const description =
      input.description &&
      this.adminTranslationService.findTranslationByLocale(
        input.description,
        'is',
      )?.value

    await this.sequelize.transaction(async (transaction) => {
      // Update apiScope row and get the Icelandic translations for displayName and description
      await this.apiScope.update(
        {
          ...omit(input, ['displayName', 'description']),
          ...(displayName && { displayName }),
          ...(description && { description }),
        },
        {
          where: {
            name: scopeName,
          },
          transaction,
        },
      )

      await this.updateScopeTranslatedValueFields(scopeName, input, transaction)
    })

    return this.findByTenantIdAndScopeName({
      scopeName,
      tenantId,
    })
  }
}
