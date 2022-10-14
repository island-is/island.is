import { Injectable } from '@nestjs/common'

import { TranslationService } from '../translation/translation.service'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { Domain } from './models/domain.model'

@Injectable()
export class ResourceTranslationService {
  constructor(private readonly translationService: TranslationService) {}

  async translateApiScopes(
    scopes: Array<ApiScope>,
    language: string,
  ): Promise<Array<ApiScope>> {
    const translationMap = await this.translationService.findTranslationMap(
      'apiscope',
      scopes.map((scope) => scope.name),
      language,
    )

    const groups: ApiScopeGroup[] = []
    for (const scope of scopes) {
      scope.displayName =
        translationMap.get(scope.name)?.get('displayName') ?? scope.displayName
      scope.description =
        translationMap.get(scope.name)?.get('description') ?? scope.description

      if (scope.group) {
        groups.push(scope.group)
      }
    }

    await this.translateApiScopeGroups(groups, language)
    return scopes
  }

  async translateApiScopeGroups(
    groups: Array<ApiScopeGroup>,
    language: string,
  ): Promise<Array<ApiScopeGroup>> {
    const translationMap = await this.translationService.findTranslationMap(
      'apiscopegroup',
      groups.map((group) => group.id),
      language,
    )

    for (const group of groups) {
      group.displayName =
        translationMap.get(group.id)?.get('displayName') ?? group.displayName
      group.description =
        translationMap.get(group.id)?.get('description') ?? group.description
    }
    return groups
  }

  async translateDomains(
    domains: Array<Domain>,
    language: string,
  ): Promise<Array<Domain>> {
    const translationMap = await this.translationService.findTranslationMap(
      'domain',
      domains.map((domain) => domain.name),
      language,
    )

    for (const domain of domains) {
      domain.displayName =
        translationMap.get(domain.name)?.get('displayName') ??
        domain.displayName
      domain.description =
        translationMap.get(domain.name)?.get('description') ??
        domain.description
    }
    return domains
  }

  async translateDomain(domain: Domain, language: string): Promise<Domain> {
    const translationMap = await this.translationService.findTranslationMap(
      'domain',
      [domain.name],
      language,
    )

    domain.displayName =
      translationMap.get(domain.name)?.get('displayName') ?? domain.displayName
    domain.description =
      translationMap.get(domain.name)?.get('description') ?? domain.description

    return domain
  }
}
