import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isCompany } from 'kennitala'
import { Op, and, or } from 'sequelize'
import { Includeable } from 'sequelize/types/model'

import { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationScope } from '../delegations/models/delegation-scope.model'
import { Delegation } from '../delegations/models/delegation.model'
import { DelegationDirection } from '../delegations/types/delegationDirection'
import { ApiScopeListDTO } from './dto/api-scope-list.dto'
import { ScopeTreeDTO } from './dto/scope-tree.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScopeUserAccess } from './models/api-scope-user-access.model'
import { ApiScope } from './models/api-scope.model'
import { Domain } from './models/domain.model'
import { ResourceTranslationService } from './resource-translation.service'
import { col } from './utils/col'
import { mapToScopeTree } from './utils/scope-tree.mapper'

import type { Attributes, WhereOptions } from 'sequelize'

@Injectable()
export class DelegationResourcesService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(Domain)
    private domainModel: typeof Domain,
    private resourceTranslationService: ResourceTranslationService,
  ) {}

  async findAllDomains(
    user: User,
    {
      language,
      direction,
      domainNames,
      supportsDelegations,
    }: {
      language?: string
      direction?: DelegationDirection
      domainNames?: string[]
      supportsDelegations?: boolean
    },
  ): Promise<Domain[]> {
    const onlyDelegations =
      supportsDelegations || direction === DelegationDirection.OUTGOING

    const domainNameFilter: WhereOptions<Domain> = domainNames
      ? { name: domainNames }
      : {}

    const domains = await this.domainModel.findAll({
      where: onlyDelegations
        ? and(
            ...(await this.apiScopeFilter({
              user,
              prefix: 'scopes',
              direction,
            })),
            domainNameFilter,
          )
        : domainNameFilter,
      include: onlyDelegations
        ? [
            {
              model: ApiScope,
              attributes: [],
              required: true,
              duplicating: false,
              include: [...this.apiScopeInclude(user, direction)],
            },
          ]
        : [],
    })

    if (language) {
      return this.resourceTranslationService.translateDomains(domains, language)
    }

    return domains
  }

  async findOneDomain(
    user: User,
    domainName: string,
    language?: string,
  ): Promise<Domain> {
    const domain = await this.domainModel.findOne({
      where: and(
        {
          name: domainName,
        },
        ...(await this.apiScopeFilter({ user, prefix: 'scopes' })),
      ),
      include: [
        {
          model: ApiScope,
          attributes: [],
          required: true,
          duplicating: false,
          subQuery: false,
          include: [...this.apiScopeInclude(user)],
        },
      ],
    })

    if (!domain) {
      throw new NoContentException()
    }

    if (language) {
      return this.resourceTranslationService.translateDomain(domain, language)
    }

    return domain
  }

  async findScopes(
    user: User,
    domainName: string,
    language?: string,
    direction?: DelegationDirection,
  ): Promise<ApiScopeListDTO[]> {
    const scopes = await this.findScopesInternal({
      user,
      domainName,
      direction,
      language,
    })
    return scopes.map((node) => new ApiScopeListDTO(node))
  }

  async findScopeTree(
    user: User,
    domainName: string,
    language?: string,
    direction?: DelegationDirection,
  ): Promise<ScopeTreeDTO[]> {
    const scopes = await this.findScopesInternal({
      user,
      domainName,
      direction,
      language,
    })

    return mapToScopeTree(scopes)
  }

  async findScopeNames(
    user: User,
    domainName: string,
    direction?: DelegationDirection,
  ) {
    const scopes = await this.findScopesInternal({
      user,
      domainName,
      direction,
      attributes: ['name'],
    })
    return scopes.map((scope) => scope.name)
  }

  async validateScopeAccess(
    user: User,
    domainName: string,
    direction: DelegationDirection,
    scopesToCheck: Array<string>,
  ): Promise<boolean> {
    const userScopes = await this.findScopeNames(user, domainName, direction)
    if (userScopes.length === 0) {
      return false
    }

    return scopesToCheck.every((scopeName) => userScopes.includes(scopeName))
  }

  async apiScopeFilter({
    user,
    prefix,
    direction,
  }: {
    user: User
    prefix?: string
    direction?: DelegationDirection
  }) {
    const apiScopeFilter: Array<WhereOptions<ApiScope>> = [
      {
        [col(prefix, 'allowExplicitDelegationGrant')]: true,
        [col(prefix, 'enabled')]: true,
      },
    ]

    if (direction === DelegationDirection.OUTGOING) {
      apiScopeFilter.push(
        ...(await this.skipScopeFilter(user, prefix)),
        ...this.accessControlFilter(user, prefix),
        ...this.delegationTypeFilter(user, prefix),
        ...this.grantToAuthenticatedUserFilter(user, prefix),
      )
    }

    return apiScopeFilter
  }

  apiScopeInclude(user: User, direction?: DelegationDirection) {
    if (direction === DelegationDirection.OUTGOING) {
      return [
        this.accessControlInclude(user),
        ...this.delegationTypeInclude(user),
      ]
    } else {
      return []
    }
  }

  private async findScopesInternal({
    user,
    domainName,
    language,
    direction,
    attributes,
  }: {
    user: User
    domainName: string
    language?: string
    direction?: DelegationDirection
    attributes?: Array<keyof Attributes<ApiScope>>
  }): Promise<ApiScope[]> {
    const scopes = await this.apiScopeModel.findAll({
      attributes: attributes as string[],
      where: and(
        {
          domainName,
        },
        ...(await this.apiScopeFilter({ user, direction })),
      ),
      include: [ApiScopeGroup, ...this.apiScopeInclude(user, direction)],
      order: [
        ['group_id', 'ASC NULLS FIRST'],
        ['order', 'ASC'],
      ],
    })

    if (language) {
      await this.resourceTranslationService.translateApiScopes(scopes, language)
    }

    return scopes
  }

  private async skipScopeFilter(
    user: User,
    prefix?: string,
  ): Promise<Array<WhereOptions<ApiScope>>> {
    const skipScopes = await this.apiScopeModel
      .findAll({
        attributes: ['name', 'customDelegationOnlyFor'],
        where: {
          customDelegationOnlyFor: {
            [Op.not]: null,
          },
        },
      })
      .then((scopes) =>
        scopes
          .filter(
            (scopeRule) =>
              !this.scopeRuleMatchesUser(
                user,
                scopeRule.customDelegationOnlyFor || [],
              ),
          )
          .map((scopeRule) => scopeRule.name),
      )

    return skipScopes.length === 0
      ? []
      : [{ [col(prefix, 'name')]: { [Op.notIn]: skipScopes } }]
  }

  private accessControlInclude(user: User): Includeable {
    return {
      attributes: [],
      model: ApiScopeUserAccess,
      where: {
        nationalId: user.nationalId,
      },
      duplicating: false,
      required: false,
    }
  }

  private accessControlFilter(
    user: User,
    prefix?: string,
  ): Array<WhereOptions<ApiScope>> {
    return [
      // isAccessControlled != true or apiScopeUserAccesses.nationalId == user.nationalId
      or(
        { [col(prefix, 'isAccessControlled')]: { [Op.ne]: true } },
        {
          [col(prefix, 'apiScopeUserAccesses', 'nationalId')]: user.nationalId,
        },
      ),
    ]
  }

  private delegationTypeInclude(user: User): Includeable[] {
    if (
      !user.delegationType ||
      !user.actor ||
      !user.delegationType.includes(AuthDelegationType.Custom)
    ) {
      return []
    }

    return [
      {
        attributes: [],
        model: DelegationScope,
        required: false,
        duplicating: false,
        include: [
          {
            attributes: [],
            model: Delegation,
            where: {
              fromNationalId: user.nationalId,
              toNationalId: user.actor.nationalId,
            },
            required: false,
            duplicating: false,
          },
        ],
      },
    ]
  }

  private delegationTypeFilter(user: User, prefix?: string) {
    if (!user.delegationType || !user.actor) {
      return []
    }

    // We currently only support access control for company (delegation) actors.
    // Actors for individuals should not have the scope required to reach this
    // point, but we assert it just to be safe.
    if (!isCompany(user.nationalId)) {
      throw new ForbiddenException(
        'Actors for individuals should not be able to manage delegations.',
      )
    }

    const delegationOr: Array<WhereOptions<ApiScope>> = []
    if (user.delegationType.includes(AuthDelegationType.ProcurationHolder)) {
      delegationOr.push({ [col(prefix, 'grantToProcuringHolders')]: true })
    }
    if (user.delegationType.includes(AuthDelegationType.Custom)) {
      delegationOr.push({
        [col(prefix, 'delegationScopes', 'delegation', 'toNationalId')]:
          user.actor.nationalId,
      })
    }
    return [or(...delegationOr)]
  }

  private grantToAuthenticatedUserFilter(
    user: User,
    prefix?: string,
  ): Array<WhereOptions<ApiScope>> {
    const isAuthenticatedUser = !user.actor
    if (isAuthenticatedUser) {
      return [
        {
          [col(prefix, 'grantToAuthenticatedUser')]: true,
        },
      ]
    }

    return []
  }

  private scopeRuleMatchesUser(
    { delegationType }: User,
    onlyForDelegationType: string[],
  ) {
    if (!delegationType) {
      return false
    }
    for (let i = 0; i < delegationType.length; i++) {
      for (let j = 0; j < onlyForDelegationType.length; j++) {
        if (delegationType[i] === onlyForDelegationType[j]) {
          return true
        }
      }
    }
    return false
  }
}
