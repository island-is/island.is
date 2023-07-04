import { IdentityResource } from '@island.is/auth-api-lib'

import { IdentityResourceDTO } from './identity-resource.dto'

export class IdentityResourceMapper {
  public static toIdentityResourceDTO(
    model: IdentityResource,
  ): IdentityResourceDTO {
    return {
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      showInDiscoveryDocument: model.showInDiscoveryDocument,
      automaticDelegationGrant: model.automaticDelegationGrant,
      userClaims: model.userClaims,
      enabled: model.enabled,
      required: model.required,
      emphasize: model.emphasize,
      archived: model.archived,
      created: model.created,
      modified: model.modified,
      domain: model.domain,
    }
  }
}
