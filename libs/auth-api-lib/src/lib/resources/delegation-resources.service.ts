import { ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import startOfDay from 'date-fns/startOfDay'
import { isCompany } from 'kennitala'
import { and, Op, or } from 'sequelize'
import { Includeable } from 'sequelize/types/model'

import { User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import { AuthDelegationType } from '@island.is/shared/types'

import { DelegationConfig } from '../delegations/DelegationConfig'
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
import type { ConfigType } from '@island.is/nest/config'
import { ApiScopeDelegationType } from './models/api-scope-delegation-type.model'

type DelegationConfigType = ConfigType<typeof DelegationConfig>
type ScopeRule = DelegationConfigType['customScopeRules'] extends Array<
  infer ScopeRule
>
  ? ScopeRule
  : never

@Injectable()
export class DelegationResourcesService {
  constructor(
    @InjectModel(ApiScope)
    private apiScopeModel: typeof ApiScope,
    @InjectModel(Domain)
    private domainModel: typeof Domain,
    @InjectModel(DelegationScope)
    private delegationScopeModel: typeof DelegationScope,
    @InjectModel(ApiScopeDelegationType)
    private apiScopeDelegationTypeModel: typeof ApiScopeDelegationType,
    private resourceTranslationService: ResourceTranslationService,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
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

    return domains.sort((a, b) => a.name.localeCompare(b.name, 'is'))
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
    domainName: string | null,
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
    domainName: string | null,
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
    domainName: string | null,
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
        ...this.skipScopeFilter(user, prefix),
        ...this.accessControlFilter(user, prefix),
        ...(await this.delegationTypeFilter(user, prefix)),
        ...this.grantToAuthenticatedUserFilter(user, prefix),
      )
    }

    return apiScopeFilter
  }

  apiScopeInclude(user: User, direction?: DelegationDirection) {
    if (direction === DelegationDirection.OUTGOING) {
      return [this.accessControlInclude(user)]
    } else {
      return []
    }
  }

  async findScopesInternal({
    user,
    domainName,
    language,
    direction,
    attributes,
    additionalIncludes = [],
  }: {
    user: User
    domainName?: string | null
    language?: string
    direction?: DelegationDirection
    attributes?: Array<keyof Attributes<ApiScope>>
    additionalIncludes?: Includeable[]
  }): Promise<ApiScope[]> {
    const filters = await this.apiScopeFilter({ user, direction })

    const scopes = await this.apiScopeModel.findAll({
      attributes: attributes as string[],
      // Use !== undefined to preserve backwards compatibility:
      // - When domainName is a string or null: apply the filter (OLD behavior)
      // - When domainName is undefined: no domain filter (NEW behavior for categories)
      where: and(domainName !== undefined ? { domainName } : {}, ...filters),
      include: [
        ApiScopeGroup,
        ...this.apiScopeInclude(user, direction),
        ...additionalIncludes,
      ],
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

  private skipScopeFilter(
    user: User,
    prefix?: string,
  ): Array<WhereOptions<ApiScope>> {
    const skipScopes = this.delegationConfig.customScopeRules
      .filter((scopeRule) => !this.scopeRuleMatchesUser(user, scopeRule))
      .map((scopeRule) => scopeRule.scopeName)
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

  private async delegationTypeFilter(user: User, prefix?: string) {
    if (!user.delegationType) {
      return []
    }

    // We currently only support access control for company (delegation) actors.
    // Actors for individuals should not have the scope required to reach this
    // point, but we assert it just to be safe.
    // EDIT: This is no longer true, as we now support LegalRepresentative delegations for individuals.
    if (!isCompany(user.nationalId)) {
      if (
        !user.delegationType.includes(AuthDelegationType.LegalRepresentative)
      ) {
        throw new ForbiddenException(
          'Actors for individuals should not be able to manage delegations.',
        )
      }
    }

    const delegationOr: Array<WhereOptions<ApiScope>> = []
    if (user.delegationType.includes(AuthDelegationType.LegalRepresentative)) {
      const scopes = await this.apiScopeDelegationTypeModel.findAll({
        attributes: ['apiScopeName'],
        where: {
          delegationType: AuthDelegationType.LegalRepresentative,
        },
      })

      delegationOr.push({
        [col(prefix, 'name')]: scopes.map((scope) => scope.apiScopeName),
      })
    }
    if (user.delegationType.includes(AuthDelegationType.ProcurationHolder)) {
      delegationOr.push({ [col(prefix, 'grantToProcuringHolders')]: true })
    }
    if (user.delegationType.includes(AuthDelegationType.Custom)) {
      const scopeNames = await this.findActorCustomDelegationScopes(user)
      delegationOr.push({
        [col(prefix, 'name')]: scopeNames,
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
    { onlyForDelegationType }: ScopeRule,
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

  private async findActorCustomDelegationScopes(user: User): Promise<string[]> {
    if (!user.actor) {
      return []
    }

    const today = startOfDay(new Date())
    const delegationScopes = await this.delegationScopeModel.findAll({
      attributes: ['scopeName'],
      include: {
        attributes: [],
        model: Delegation,
        where: {
          fromNationalId: user.nationalId,
          toNationalId: user.actor.nationalId,
        },
      },
      where: {
        validFrom: { [Op.lte]: today },
        validTo: or({ [Op.is]: undefined }, { [Op.gte]: today }),
      },
      group: 'scopeName',
    })
    return delegationScopes.map((delegationScope) => delegationScope.scopeName)
  }
}
