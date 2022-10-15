import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { InjectModel } from '@nestjs/sequelize'
import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import { PersonalRepresentativeRightType } from '../personal-representative/models/personal-representative-right-type.model'
import { PersonalRepresentativeRight } from '../personal-representative/models/personal-representative-right.model'
import { PersonalRepresentativeScopePermission } from '../personal-representative/models/personal-representative-scope-permission.model'
import { PersonalRepresentative } from '../personal-representative/models/personal-representative.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { IdentityResource } from '../resources/models/identity-resource.model'
import { DelegationConfig } from './DelegationConfig'
import { UpdateDelegationScopeDTO } from './dto/delegation-scope.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'

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
        where: { delegationId: delegationId, scopeName: scopeNames },
      })
    }

    return this.delegationScopeModel.destroy({
      where: { delegationId: delegationId },
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

  async findAllValidCustomScopesTo(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<DelegationScope[]> {
    const today = startOfDay(new Date())

    return this.delegationScopeModel.findAll({
      where: {
        [Op.and]: [
          { validFrom: { [Op.lte]: today } },
          { validTo: { [Op.or]: [{ [Op.eq]: null }, { [Op.gte]: today }] } },
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
            allowExplicitDelegationGrant: true,
          },
        },
      ],
    })
  }

  async findAllProcurationScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        grantToProcuringHolders: true,
        alsoForDelegatedUser: false,
      },
    })

    return apiScopes.map((s) => s.name)
  }

  async findAllLegalGuardianScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        grantToLegalGuardians: true,
        alsoForDelegatedUser: false,
      },
    })

    return apiScopes.map((s) => s.name)
  }

  async findPersonalRepresentativeScopes(
    toNationalId: string,
    fromNationalId: string,
  ): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        enabled: true,
        grantToPersonalRepresentatives: true,
        alsoForDelegatedUser: false,
      },
      include: [
        {
          model: PersonalRepresentativeScopePermission,
          required: true,
          include: [
            {
              model: PersonalRepresentativeRightType,
              required: true,
              where: {
                validFrom: {
                  [Op.or]: { [Op.eq]: null, [Op.lt]: new Date() },
                },
                validTo: {
                  [Op.or]: { [Op.eq]: null, [Op.gt]: new Date() },
                },
              },
              include: [
                {
                  model: PersonalRepresentativeRight,
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
        },
      ],
    })

    return apiScopes.map((s) => s.name)
  }

  async findAllAutomaticScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        automaticDelegationGrant: true,
      },
    })

    const identityResources = await this.identityResourceModel.findAll({
      attributes: ['name'],
      where: {
        automaticDelegationGrant: true,
      },
    })

    return [
      ...apiScopes.map((s) => s.name),
      ...identityResources.map((s) => s.name),
    ]
  }
}
