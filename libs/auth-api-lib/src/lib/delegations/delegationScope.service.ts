import { uuid } from 'uuidv4'
import { Op } from 'sequelize'
import startOfDay from 'date-fns/startOfDay'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { ScopeType, UpdateDelegationScopeDTO } from './dto/delegation-scope.dto'
import { DelegationScope } from './models/delegation-scope.model'
import { Delegation } from './models/delegation.model'
import { ApiScope } from '../resources/models/api-scope.model'
import { IdentityResource } from '../resources/models/identity-resource.model'
import { PersonalRepresentativeScopePermission } from '../personal-representative/models/personal-representative-scope-permission.model'
import { PersonalRepresentativeRightType } from '../personal-representative/models/personal-representative-right-type.model'
import { PersonalRepresentativeRight } from '../personal-representative/models/personal-representative-right.model'
import { PersonalRepresentative } from '../personal-representative/models/personal-representative.model'

@Injectable()
export class DelegationScopeService {
  constructor(
    @InjectModel(DelegationScope)
    private delegationScopeModel: typeof DelegationScope,
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(IdentityResource)
    private identityResourceModel: typeof IdentityResource,
  ) {}

  async createOrUpdate(
    delegationId: string,
    allowedScopes: string[],
    scopes?: UpdateDelegationScopeDTO[],
  ): Promise<DelegationScope[]> {
    await this.delete(delegationId, allowedScopes)

    if (scopes && scopes.length > 0) {
      return this.createMany(delegationId, scopes)
    }

    return []
  }

  async createMany(
    delegationId: string,
    scopes: UpdateDelegationScopeDTO[],
  ): Promise<DelegationScope[]> {
    const validFrom = startOfDay(new Date())
    return this.delegationScopeModel.bulkCreate(
      scopes.map((delegationScope) => ({
        id: uuid(),
        validFrom,
        validTo: delegationScope.validTo
          ? startOfDay(delegationScope.validTo)
          : undefined,
        scopeName:
          delegationScope.type === ScopeType.ApiScope
            ? delegationScope.name
            : undefined,
        identityResourceName:
          delegationScope.type === ScopeType.IdentityResource
            ? delegationScope.name
            : undefined,
        delegationId,
      })),
    )
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
          required: false,
        },
        {
          model: IdentityResource,
          where: {
            allowExplicitDelegationGrant: true,
          },
          required: false,
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

    const identityResources = await this.identityResourceModel.findAll({
      attributes: ['name'],
      where: {
        grantToProcuringHolders: true,
        alsoForDelegatedUser: false,
      },
    })

    return [
      ...apiScopes.map((s) => s.name),
      ...identityResources.map((s) => s.name),
    ]
  }

  async findAllLegalGuardianScopes(): Promise<string[]> {
    const apiScopes = await this.apiScopeModel.findAll({
      attributes: ['name'],
      where: {
        grantToLegalGuardians: true,
        alsoForDelegatedUser: false,
      },
    })

    const identityResources = await this.identityResourceModel.findAll({
      attributes: ['name'],
      where: {
        grantToLegalGuardians: true,
        alsoForDelegatedUser: false,
      },
    })

    return [
      ...apiScopes.map((s) => s.name),
      ...identityResources.map((s) => s.name),
    ]
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
