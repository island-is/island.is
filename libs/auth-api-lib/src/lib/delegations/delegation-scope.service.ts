import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'
import * as kennitala from 'kennitala'
import { Op, Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { SyslumennService } from '@island.is/clients/syslumenn'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

import { PersonalRepresentativeDelegationTypeModel } from '../personal-representative/models/personal-representative-delegation-type.model'
import { PersonalRepresentative } from '../personal-representative/models/personal-representative.model'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { IdentityResource } from '../resources/models/identity-resource.model'
import { DelegationProviderService } from './delegation-provider.service'
import { DelegationConfig } from './DelegationConfig'
import { ApiScopeInfo } from './delegations-incoming.service'
import { DelegationsIndexService } from './delegations-index.service'
import { UpdateDelegationScopeDTO } from './dto/delegation-scope.dto'
import { DelegationDelegationType } from './models/delegation-delegation-type.model'
import { DelegationScope } from './models/delegation-scope.model'
import { DelegationTypeModel } from './models/delegation-type.model'
import { Delegation } from './models/delegation.model'
import { DelegationValidity } from './types/delegationValidity'
import filterByCustomScopeRule from './utils/filterByScopeCustomScopeRule'
import { getScopeValidityWhereClause } from './utils/scopes'
import { validateDistrictCommissionersDelegations } from './utils/delegations'

import type { User } from '@island.is/auth-nest-tools'
@Injectable()
export class DelegationScopeService {
  constructor(
    @InjectModel(DelegationScope)
    private delegationScopeModel: typeof DelegationScope,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private delegationProviderService: DelegationProviderService,
    private readonly syslumennService: SyslumennService,
    private readonly delegationsIndexService: DelegationsIndexService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async createOrUpdate(
    delegationId: string,
    scopes?: UpdateDelegationScopeDTO[],
  ): Promise<DelegationScope[]> {
    if (scopes && scopes.length > 0) {
      await this.delete(
        delegationId,
        scopes.map((s) => s.name),
      )
      return this.createMany(delegationId, scopes)
    }

    return []
  }

  async createMany(
    delegationId: string,
    scopes: UpdateDelegationScopeDTO[],
  ): Promise<DelegationScope[]> {
    const validFrom = startOfDay(new Date())
    const defaultValidTo = addDays(
      validFrom,
      this.delegationConfig.defaultValidityPeriodInDays,
    )
    const delegationScopes = scopes.map((scope) => ({
      id: uuid(),
      validFrom,
      validTo: scope.validTo ? startOfDay(scope.validTo) : defaultValidTo,
      scopeName: scope.name,
      delegationId,
    }))

    await this.delegationScopeModel.bulkCreate(delegationScopes)
    return this.delegationScopeModel.findAll({
      where: {
        id: delegationScopes.map((s) => s.id),
      },
      include: [ApiScope],
    })
  }

  async delete(
    delegationId: string,
    scopeNames?: string[] | null,
    transaction?: Transaction,
  ): Promise<number> {
    if (scopeNames) {
      return this.delegationScopeModel.destroy({
        where: { delegationId, scopeName: scopeNames },
        transaction,
      })
    }

    return this.delegationScopeModel.destroy({
      where: { delegationId },
      transaction,
    })
  }

  async findByDelegationId(delegationId: string): Promise<DelegationScope[]> {
    return this.delegationScopeModel.findAll({
      where: { delegationId },
    })
  }

  async findAll(delegationId: string): Promise<DelegationScope[]> {
    return this.delegationScopeModel.findAll({
      useMaster: true,
      where: { delegationId },
      include: [
        {
          model: ApiScope,
          where: {
            enabled: true,
            allowExplicitDelegationGrant: true,
          },
        },
      ],
    })
  }

  private findValidCustomScopesTo(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<DelegationScope[]> {
    return this.delegationScopeModel.findAll({
      where: getScopeValidityWhereClause(DelegationValidity.NOW),
      include: [
        {
          model: Delegation,
          where: {
            toNationalId: toNationalId,
            fromNationalId: fromNationalId,
          },
        },
        {
          model: ApiScope,
          where: {
            enabled: true,
          },
          include: [
            {
              model: ApiScopeDelegationType,
              include: [
                {
                  model: DelegationTypeModel,
                  where: { provider: AuthDelegationProvider.Custom },
                },
              ],
            },
          ],
        },
      ],
    })
  }

  private async findValidGeneralMandateScopesTo(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<string[]> {
    const today = startOfDay(new Date())

    const delegations = await this.delegationModel.findAll({
      where: {
        toNationalId,
        fromNationalId,
      },
      include: [
        {
          model: DelegationDelegationType,
          required: true,
          where: {
            delegationTypeId: AuthDelegationType.GeneralMandate,
            validTo: {
              [Op.or]: [{ [Op.is]: undefined }, { [Op.gte]: today }],
            },
          },
        },
      ],
    })

    if (delegations.length === 0) return []

    return this.apiScopeModel
      .findAll({
        attributes: ['name'],
        where: {
          enabled: true,
        },
        include: [
          {
            model: ApiScopeDelegationType,
            where: {
              delegationType: {
                [Op.or]: kennitala.isCompany(fromNationalId)
                  ? [
                      AuthDelegationType.GeneralMandate,
                      AuthDelegationType.ProcurationHolder,
                    ]
                  : [AuthDelegationType.GeneralMandate],
              },
            },
          },
        ],
      })
      .then((apiScopes) =>
        apiScopes
          .filter((scope) =>
            // Remove scopes that are not allowed for the delegation type
            filterByCustomScopeRule(
              scope,
              [AuthDelegationType.GeneralMandate],
              this.delegationConfig.customScopeRules,
            ),
          )
          .map((apiScope) => apiScope.name),
      )
  }

  private async findAllNationalRegistryScopes(
    delegationTypes: string[],
  ): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      include: [
        {
          model: ApiScopeDelegationType,
          required: true,
          include: [
            {
              model: DelegationTypeModel,
              where: {
                provider: AuthDelegationProvider.NationalRegistry,
                id: delegationTypes,
              },
            },
          ],
        },
      ],
      where: {
        enabled: true,
        alsoForDelegatedUser: false,
      },
      attributes: ['name'],
    })
    return apiScopes.map((s) => s.name)
  }

  private async findAllCompanyRegistryScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      include: [
        {
          model: ApiScopeDelegationType,
          required: true,
          include: [
            {
              model: DelegationTypeModel,
              where: {
                provider: AuthDelegationProvider.CompanyRegistry,
              },
            },
          ],
        },
      ],
      where: {
        enabled: true,
        alsoForDelegatedUser: false,
      },
      attributes: ['name'],
    })
    return apiScopes.map((s) => s.name)
  }

  private async findPersonalRepresentativeRegistryScopes(
    toNationalId: string,
    fromNationalId: string,
    delegationTypes: string[],
  ): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        enabled: true,
        alsoForDelegatedUser: false,
      },
      include: [
        {
          model: DelegationTypeModel,
          required: true,
          where: {
            id: delegationTypes,
            provider: AuthDelegationProvider.PersonalRepresentativeRegistry,
          },
          include: [
            {
              model: PersonalRepresentativeDelegationTypeModel,
              required: true,
              include: [
                {
                  model: PersonalRepresentative,
                  required: true,
                  where: {
                    nationalIdPersonalRepresentative: toNationalId,
                    nationalIdRepresentedPerson: fromNationalId,
                  },
                },
              ],
            },
          ],
        },
      ],
    })

    return apiScopes.map((s) => s.name)
  }

  private async findDistrictCommissionersRegistryScopesTo(
    user: User,
    fromNationalId: string,
    delegationTypes: string[],
  ): Promise<string[]> {
    const { validTypes } = await validateDistrictCommissionersDelegations({
      user,
      fromNationalId,
      delegationTypes: delegationTypes as AuthDelegationType[],
      featureFlagService: this.featureFlagService,
      syslumennService: this.syslumennService,
      delegationsIndexService: this.delegationsIndexService,
    })

    if (validTypes.length === 0) {
      return []
    }

    // Return all enabled scopes for valid delegation types
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        enabled: true,
      },
      include: [
        {
          model: DelegationTypeModel,
          required: true,
          where: {
            id: {
              [Op.in]: validTypes,
            },
            provider: AuthDelegationProvider.DistrictCommissionersRegistry,
          },
        },
      ],
    })

    return apiScopes.map((s) => s.name)
  }

  private async findAllAutomaticScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        enabled: true,
        automaticDelegationGrant: true,
      },
    })

    const identityResources = await this.identityResourceModel.findAll({
      attributes: ['name'],
      where: {
        enabled: true,
        automaticDelegationGrant: true,
      },
    })

    return [
      ...apiScopes.map((s) => s.name),
      ...identityResources.map((s) => s.name),
    ]
  }

  async findAllScopesTo(
    user: User,
    fromNationalId: string,
    delegationTypes: string[],
  ): Promise<string[]> {
    const scopePromises = []

    const providers: string[] =
      await this.delegationProviderService.findProviders(delegationTypes)

    if (providers.includes(AuthDelegationProvider.NationalRegistry)) {
      scopePromises.push(this.findAllNationalRegistryScopes(delegationTypes))
    }

    if (providers.includes(AuthDelegationProvider.CompanyRegistry)) {
      scopePromises.push(this.findAllCompanyRegistryScopes())
    }

    if (
      providers.includes(AuthDelegationProvider.PersonalRepresentativeRegistry)
    ) {
      scopePromises.push(
        this.findPersonalRepresentativeRegistryScopes(
          user.nationalId,
          fromNationalId,
          delegationTypes,
        ),
      )
    }

    if (delegationTypes?.includes(AuthDelegationType.Custom)) {
      scopePromises.push(
        this.findValidCustomScopesTo(user.nationalId, fromNationalId).then(
          (delegationScopes: DelegationScope[]) =>
            delegationScopes.map((ds) => ds.scopeName),
        ),
      )
    }

    if (delegationTypes?.includes(AuthDelegationType.GeneralMandate)) {
      scopePromises.push(
        this.findValidGeneralMandateScopesTo(user.nationalId, fromNationalId),
      )
    }

    if (
      providers.includes(AuthDelegationProvider.DistrictCommissionersRegistry)
    ) {
      scopePromises.push(
        this.findDistrictCommissionersRegistryScopesTo(
          user,
          fromNationalId,
          delegationTypes,
        ),
      )
    }

    const scopeSets = await Promise.all(scopePromises)

    let scopes = ([] as string[]).concat(...scopeSets)

    if (
      scopes.length > 0 ||
      providers.includes(AuthDelegationProvider.NationalRegistry) ||
      providers.includes(AuthDelegationProvider.CompanyRegistry)
    ) {
      scopes = [...scopes, ...(await this.findAllAutomaticScopes())]
    }

    return [...new Set(scopes)]
  }
}
