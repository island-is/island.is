import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import { AuthDelegationProvider } from '@island.is/shared/types'

import { PersonalRepresentativeDelegationTypeModel } from '../personal-representative/models/personal-representative-delegation-type.model'
import { PersonalRepresentative } from '../personal-representative/models/personal-representative.model'
import { ApiScopeDelegationType } from '../resources/models/api-scope-delegation-type.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { IdentityResource } from '../resources/models/identity-resource.model'
import { DelegationProviderService } from './delegation-provider.service'
import { DelegationConfig } from './DelegationConfig'
import { UpdateDelegationScopeDTO } from './dto/delegation-scope.dto'
import { DelegationProviderModel } from './models/delegation-provider.model'
import { DelegationScope } from './models/delegation-scope.model'
import { DelegationTypeModel } from './models/delegation-type.model'
import { Delegation } from './models/delegation.model'

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
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
    private delegationProviderService: DelegationProviderService,
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
  ): Promise<number> {
    if (scopeNames) {
      return this.delegationScopeModel.destroy({
        where: { delegationId, scopeName: scopeNames },
      })
    }

    return this.delegationScopeModel.destroy({
      where: { delegationId },
    })
  }

  async findByDelegationId(delegationId: string): Promise<DelegationScope[]> {
    return this.delegationScopeModel.findAll({
      where: { delegationId },
    })
  }

  async findAll(delegationId: string): Promise<DelegationScope[]> {
    return this.delegationScopeModel.findAll({
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
    const today = startOfDay(new Date())

    return this.delegationScopeModel.findAll({
      where: {
        [Op.and]: [
          { validFrom: { [Op.lte]: today } },
          {
            validTo: { [Op.or]: [{ [Op.is]: undefined }, { [Op.gte]: today }] },
          },
        ],
      },
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

  private async findAllNationalRegistryScopes(): Promise<string[]> {
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
      scopePromises.push(this.findAllNationalRegistryScopes())
    }

    if (providers.includes(AuthDelegationProvider.CompanyRegistry)) {
      scopePromises.push(this.findAllCompanyRegistryScopes())
    }

    if (
      providers.includes(AuthDelegationProvider.PersonalRepresentativeRegistry)
    )
      scopePromises.push(
        this.findPersonalRepresentativeRegistryScopes(
          user.nationalId,
          fromNationalId,
          delegationTypes,
        ),
      )

    if (providers.includes(AuthDelegationProvider.Custom))
      scopePromises.push(
        this.findValidCustomScopesTo(user.nationalId, fromNationalId).then(
          (delegationScopes: DelegationScope[]) =>
            delegationScopes.map((ds) => ds.scopeName),
        ),
      )

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
