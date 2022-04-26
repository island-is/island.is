import { uuid } from 'uuidv4'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import {
  ScopeType,
  UpdateDelegationScopeDTO,
} from '../entities/dto/delegation-scope.dto'
import { DelegationScope } from '../entities/models/delegation-scope.model'
import { Delegation } from '../entities/models/delegation.model'
import { Op } from 'sequelize'
import { ApiScope } from '../entities/models/api-scope.model'
import { IdentityResource } from '../entities/models/identity-resource.model'
import startOfDay from 'date-fns/startOfDay'
import {
  PersonalRepresentative,
  PersonalRepresentativeRight,
  PersonalRepresentativeRightType,
  PersonalRepresentativeScopePermission,
} from '../personal-representative'

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
        where: { delegationId: delegationId, scopeName: scopeNames },
      })
    }

    return this.delegationScopeModel.destroy({
      where: { delegationId: delegationId },
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
