import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import type {
  Filterable,
  Includeable,
  Order,
  WhereOptions,
  Projectable,
} from 'sequelize'
import { literal, Op } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { ConfigType } from '@island.is/nest/config'
import { NoContentException } from '@island.is/nest/problem'

import { ApiScopeListDTO } from './dto/api-scope-list.dto'
import { ApiScopeTreeDTO } from './dto/api-scope-tree.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { Domain } from './models/domain.model'
import { ResourceTranslationService } from './resource-translation.service'
import { ApiScopeUserAccess } from './models/api-scope-user-access.model'
import { DelegationScope } from '../delegations/models/delegation-scope.model'
import { Delegation } from '../delegations/models/delegation.model'
import { DelegationConfig } from '../delegations/DelegationConfig'

interface ApiScopeQueryOptions extends Filterable<ApiScope>, Projectable {
  include?: Includeable[]
  order?: Order
}

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
    private resourceTranslationService: ResourceTranslationService,
    @Inject(DelegationConfig.KEY)
    private delegationConfig: ConfigType<typeof DelegationConfig>,
  ) {}

  async findAllDomains(user: User, language?: string): Promise<Domain[]> {
    const domains = await this.domainModel.findAll({
      include: [
        this.wrapApiScopeQuery(user, 'scopes->', {
          attributes: [],
          model: ApiScope,
        }),
      ],
      logging: true,
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
      where: {
        name: domainName,
      },
      include: [
        this.wrapApiScopeQuery(user, 'scopes->', {
          attributes: [],
          model: ApiScope,
        }),
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

  // Scope is visible:
  // AND: [
  //  - allowExplicitDelegationGrant: true,
  //  - OR: [
  //    - isAccessControlled: false,
  //    - ApiScopeUserAccess.nationalId: nationalId,
  //  ],
  //  IS COMPANY:
  //  - grantToProcuringHolders: true,
  private async findScopesInternal(
    user: User,
    domainName: string,
    language?: string,
  ): Promise<ApiScope[]> {
    const scopes = await this.apiScopeModel.findAll(
      this.wrapApiScopeQuery(user, '', {
        where: {
          domainName,
        },
        include: [ApiScopeGroup],
        order: [
          ['group_id', 'ASC NULLS FIRST'],
          ['order', 'ASC'],
        ],
        logging: true,
      }),
    )

    if (language) {
      await this.resourceTranslationService.translateApiScopes(scopes, language)
    }

    return scopes
  }

  async findScopes(
    user: User,
    domainName: string,
    language?: string,
  ): Promise<ApiScopeTreeDTO[]> {
    const scopes = await this.findScopesInternal(user, domainName, language)
    return scopes.map((node) => new ApiScopeListDTO(node))
  }

  async findScopeTree(
    user: User,
    domainName: string,
    language?: string,
  ): Promise<ApiScopeTreeDTO[]> {
    const scopes = await this.findScopesInternal(user, domainName, language)

    const groupChildren = new Map<string, ApiScopeTreeDTO[]>()
    const scopeTree: Array<ApiScope | ApiScopeGroup> = []

    for (const scope of scopes) {
      if (scope.group) {
        let children = groupChildren.get(scope.group.name)
        if (!children) {
          scopeTree.push(scope.group)
          children = []
          groupChildren.set(scope.group.name, children)
        }
        children.push(new ApiScopeTreeDTO(scope))
      } else {
        scopeTree.push(scope)
      }
    }

    return scopeTree
      .sort((a, b) => a.order - b.order)
      .map((node) => ({
        ...new ApiScopeTreeDTO(node),
        children: groupChildren.get(node.name),
      }))
  }

  private wrapApiScopeQuery<T extends ApiScopeQueryOptions>(
    user: User,
    prefix: string,
    queryOptions: T,
  ): T {
    const skipScopes = this.delegationConfig.customScopeRules
      .filter((scopeRule) => !this.scopeRuleMatchesUser(user, scopeRule))
      .map((scopeRule) => scopeRule.scopeName)

    let where = queryOptions.where ?? { [Op.and]: [] }
    if (!Array.isArray(where[Op.and as never])) {
      where = { [Op.and]: [where] }
    }
    const whereAnd = where[Op.and as never] as Array<WhereOptions>
    whereAnd.push({
      allowExplicitDelegationGrant: true,
      enabled: true,
      ...(skipScopes.length > 0 ? { name: { [Op.notIn]: skipScopes } } : {}),
      [Op.or]: [
        { isAccessControlled: { [Op.ne]: true } },
        { [`$${prefix}apiScopeUserAccesses.scope$`]: { [Op.ne]: null } },
      ],
    })

    let include = queryOptions.include ?? []
    if (!Array.isArray(include)) {
      include = [include]
    }
    include.push({
      attributes: [],
      model: ApiScopeUserAccess,
      where: {
        nationalId: user.nationalId,
      },
      required: false,
    })

    // Currently only supporting access control for company delegations.
    if (user.delegationType && user.actor) {
      const delegationOr: Array<WhereOptions<ApiScope>> = []
      whereAnd.push({ [Op.or]: delegationOr })
      if (user.delegationType.includes('ProcurationHolder')) {
        delegationOr.push({ grantToProcuringHolders: true })
      }
      if (user.delegationType.includes('LegalGuardian')) {
        delegationOr.push(literal('false'))
      }
      if (user.delegationType.includes('PersonalRepresentative')) {
        delegationOr.push(literal('false'))
      }
      if (user.delegationType.includes('Custom')) {
        include.push({
          attributes: [],
          model: DelegationScope,
          required: false,
          include: [
            {
              attributes: [],
              model: Delegation,
              where: {
                fromNationalId: user.nationalId,
                toNationalId: user.actor.nationalId,
              },
              required: false,
            },
          ],
        })
        delegationOr.push({
          [`$${prefix}delegationScopes->delegation.to_national_id$`]: {
            [Op.ne]: null,
          },
        })
      }
    }

    queryOptions.where = where
    queryOptions.include = include
    return queryOptions
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
}
