import { Sequelize } from 'sequelize-typescript'
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Transaction } from 'sequelize'
import omit from 'lodash/omit'

import { validatePermissionId } from '@island.is/auth/shared'
import { isDefined } from '@island.is/shared/utils'

import { ApiScope } from '../models/api-scope.model'
import { AdminCreateScopeDto } from './dto/admin-create-scope.dto'
import { ApiScopeUserClaim } from '../models/api-scope-user-claim.model'
import { AdminScopeDTO } from './dto/admin-scope.dto'
import { AdminTranslationService } from './services/admin-translation.service'
import { NoContentException } from '@island.is/nest/problem'
import {
  AdminPatchScopeDto,
  superUserScopeFields,
} from './dto/admin-patch-scope.dto'
import { TranslatedValueDto } from '../../translation/dto/translated-value.dto'
import { TranslationService } from '../../translation/translation.service'
import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScopeDelegationType } from '../models/api-scope-delegation-type.model'
import {
  delegationTypeSuperUserFilter,
  SUPER_USER_DELEGATION_TYPES,
} from '../utils/filters'

/**
 * This is a service that is used to access the admin scopes
 */
@Injectable()
export class AdminScopeService {
  constructor(
    @InjectModel(ApiScope)
    private readonly apiScope: typeof ApiScope,
    @InjectModel(ApiScopeUserClaim)
    private readonly apiScopeUserClaim: typeof ApiScopeUserClaim,
    @InjectModel(ApiScopeDelegationType)
    private readonly apiScopeDelegationType: typeof ApiScopeDelegationType,
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
      include: [
        { model: ApiScopeDelegationType, as: 'supportedDelegationTypes' },
      ],
    })

    const translations =
      await this.adminTranslationService.getApiScopeTranslations(
        apiScopes.map(({ name }) => name),
      )

    return apiScopes
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((apiScope) =>
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
      useMaster: true,
      where: {
        name: scopeName,
        domainName: tenantId,
        enabled: true,
      },
      include: [
        { model: ApiScopeDelegationType, as: 'supportedDelegationTypes' },
      ],
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
    user: User,
  ): Promise<AdminScopeDTO> {
    if (
      !validatePermissionId({
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

    // If user is not super admin, we remove the super admin fields from the input to default to the client base attributes
    if (!this.isSuperAdmin(user)) {
      input = {
        ...input,
        // Remove defined super admin fields
        ...omit(input, superUserScopeFields),
        // Remove personal representative from delegation types since it is not allowed for non-super admins
        supportedDelegationTypes: delegationTypeSuperUserFilter(
          input.supportedDelegationTypes ?? [],
        ),
      }
    }

    await this.sequelize.transaction(async (transaction) => {
      const scope = await this.apiScope.create(
        {
          ...omit(input, ['displayName', 'description']),
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

      if (
        input.supportedDelegationTypes &&
        input.supportedDelegationTypes.length > 0
      ) {
        await this.addScopeDelegationTypes({
          apiScopeName: scope.name,
          delegationTypes: input.supportedDelegationTypes,
          transaction,
        })
      }

      return scope
    })

    const apiScope = await this.apiScope.findOne({
      where: {
        name: input.name,
        domainName: tenantId,
      },
      include: [
        { model: ApiScopeDelegationType, as: 'supportedDelegationTypes' },
      ],
      useMaster: true,
    })

    if (!apiScope) {
      throw new Error('Failed to create scope')
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
    user,
  }: {
    scopeName: string
    tenantId: string
    input: AdminPatchScopeDto
    user: User
  }): Promise<AdminScopeDTO> {
    if (Object.keys(input).length === 0) {
      throw new BadRequestException('No fields provided to update.')
    }

    const isValid = await this.validateUserUpdateAccess(input, user)
    if (!isValid) {
      throw new ForbiddenException(
        'User does not have access to update admin controlled fields',
      )
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
          ...omit(input, [
            'displayName',
            'description',
            'grantToProcuringHolders',
            'grantToLegalGuardians',
            'grantToPersonalRepresentatives',
            'allowExplicitDelegationGrant',
          ]),
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

      if (input.addedDelegationTypes && input.addedDelegationTypes.length > 0) {
        await this.addScopeDelegationTypes({
          apiScopeName: scopeName,
          delegationTypes: input.addedDelegationTypes,
          transaction,
        })
      }

      if (
        input.removedDelegationTypes &&
        input.removedDelegationTypes.length > 0
      ) {
        await this.removeScopeDelegationTypes({
          apiScopeName: scopeName,
          delegationTypes: input.removedDelegationTypes,
          transaction,
        })
      }

      await this.updateScopeTranslatedValueFields(scopeName, input, transaction)
    })

    return this.findByTenantIdAndScopeName({
      scopeName,
      tenantId,
    })
  }

  private async validateUserUpdateAccess(
    input: AdminPatchScopeDto,
    user: User,
  ): Promise<boolean> {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

    // Check if none SuperUser is trying to update PersonalRepresentative fields
    const allDelegationTypes = [
      ...(input.addedDelegationTypes ?? []),
      ...(input.removedDelegationTypes ?? []),
    ]

    const hasSuperUserDelegationType = allDelegationTypes.some(
      (delegationType) => SUPER_USER_DELEGATION_TYPES.includes(delegationType),
    )

    if (!isSuperUser && hasSuperUserDelegationType) {
      return false
    }

    const updatedFields = Object.keys(input)

    const superUserUpdatedFields = updatedFields.filter((field) =>
      superUserScopeFields.includes(field),
    )

    if (superUserUpdatedFields.length === 0) {
      return true
    }

    // If there is a superUser field in the updated fields, the user must be a superUser
    return superUserUpdatedFields.length > 0 && isSuperUser
  }

  private async addScopeDelegationTypes({
    apiScopeName,
    delegationTypes = [],
    transaction,
  }: {
    apiScopeName: string
    delegationTypes?: string[]
    transaction: Transaction
  }) {
    // boolean fields
    const grantToProcuringHolders = delegationTypes?.includes(
      AuthDelegationType.ProcurationHolder,
    )
    const grantToLegalGuardians = delegationTypes?.includes(
      AuthDelegationType.LegalGuardian,
    )
    const grantToPersonalRepresentatives = delegationTypes?.some(
      (delegationType) =>
        delegationType.startsWith(AuthDelegationType.PersonalRepresentative),
    )
    const allowExplicitDelegationGrant = delegationTypes?.includes(
      AuthDelegationType.Custom,
    )

    if (allowExplicitDelegationGrant) {
      delegationTypes.push(AuthDelegationType.GeneralMandate)
    }

    if (grantToProcuringHolders) {
      delegationTypes.push(AuthDelegationType.ExecutiveDirector)
    }

    // add delegation type rows
    await Promise.all(
      delegationTypes.map((delegationType) =>
        this.apiScopeDelegationType.upsert(
          {
            apiScopeName,
            delegationType,
          },
          { transaction },
        ),
      ),
    )

    // update boolean fields
    if (
      grantToLegalGuardians ||
      grantToPersonalRepresentatives ||
      grantToProcuringHolders ||
      allowExplicitDelegationGrant
    ) {
      await this.apiScope.update(
        {
          ...(grantToLegalGuardians ? { grantToLegalGuardians } : {}),
          ...(grantToPersonalRepresentatives
            ? { grantToPersonalRepresentatives }
            : {}),
          ...(grantToProcuringHolders ? { grantToProcuringHolders } : {}),
          ...(allowExplicitDelegationGrant
            ? { allowExplicitDelegationGrant }
            : {}),
        },
        {
          transaction,
          where: {
            name: apiScopeName,
          },
        },
      )
    }
  }

  private async removeScopeDelegationTypes({
    apiScopeName,
    delegationTypes = [],
    transaction,
  }: {
    apiScopeName: string
    delegationTypes?: string[]
    transaction: Transaction
  }) {
    // boolean fields
    const grantToProcuringHolders = delegationTypes?.includes(
      AuthDelegationType.ProcurationHolder,
    )
      ? false
      : undefined
    const grantToLegalGuardians = delegationTypes?.includes(
      AuthDelegationType.LegalGuardian,
    )
      ? false
      : undefined
    const grantToPersonalRepresentatives = delegationTypes?.some(
      (delegationType) =>
        delegationType.startsWith(AuthDelegationType.PersonalRepresentative),
    )
      ? false
      : undefined
    const allowExplicitDelegationGrant = delegationTypes?.includes(
      AuthDelegationType.Custom,
    )
      ? false
      : undefined

    if (delegationTypes.includes(AuthDelegationType.Custom)) {
      delegationTypes.push(AuthDelegationType.GeneralMandate)
    }

    if (delegationTypes.includes(AuthDelegationType.ProcurationHolder)) {
      delegationTypes.push(AuthDelegationType.ExecutiveDirector)
    }

    // remove delegation type rows
    await Promise.all(
      delegationTypes.map((delegationType) =>
        this.apiScopeDelegationType.destroy({
          transaction,
          where: {
            apiScopeName,
            delegationType: { [Op.startsWith]: delegationType },
          },
        }),
      ),
    )

    // update boolean fields
    if (
      grantToLegalGuardians === false ||
      grantToPersonalRepresentatives === false ||
      grantToProcuringHolders === false ||
      allowExplicitDelegationGrant === false
    ) {
      await this.apiScope.update(
        {
          grantToLegalGuardians,
          grantToPersonalRepresentatives,
          grantToProcuringHolders,
          allowExplicitDelegationGrant,
        },
        {
          transaction,
          where: {
            name: apiScopeName,
          },
        },
      )
    }
  }

  private isSuperAdmin = (user: User) => {
    return user.scope.includes(AdminPortalScope.idsAdminSuperUser)
  }
}
