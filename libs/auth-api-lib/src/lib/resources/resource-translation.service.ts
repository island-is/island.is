import { Injectable } from '@nestjs/common'

import { TranslationService } from '../translation/translation.service'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { Domain } from './models/domain.model'
import { IdentityResource } from './models/identity-resource.model'

@Injectable()
export class ResourceTranslationService {
  constructor(private readonly translationService: TranslationService) {}

  async translateIdentityResources(
    scopes: IdentityResource[],
    language: string,
  ): Promise<IdentityResource[]> {
    const translationMap = await this.translationService.findTranslationMap(
      'identityresource',
      scopes.map((scope) => scope.name),
      false,
      language,
    )

    for (const scope of scopes) {
      scope.displayName =
        translationMap.get(scope.name)?.get('displayName') ?? scope.displayName
      scope.description =
        translationMap.get(scope.name)?.get('description') ?? scope.description
    }

    return scopes
  }

  async translateApiScopes(
    scopes: ApiScope[],
    language: string,
  ): Promise<ApiScope[]> {
    const translationMap = await this.translationService.findTranslationMap(
      'apiscope',
      scopes.map((scope) => scope.name),
      false,
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
    groups: ApiScopeGroup[],
    language: string,
  ): Promise<ApiScopeGroup[]> {
    const translationMap = await this.translationService.findTranslationMap(
      'apiscopegroup',
      groups.map((group) => group.id),
      false,
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
    domains: Domain[],
    language: string,
  ): Promise<Domain[]> {
    const translationMap = await this.translationService.findTranslationMap(
      'domain',
      domains.map((domain) => domain.name),
      false,
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
    return (await this.translateDomains([domain], language))[0]
  }
}
