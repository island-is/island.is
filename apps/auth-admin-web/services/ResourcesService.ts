/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ApiResourceScopeDTO } from '../entities/dtos/api-resource-allowed-scope.dto'
import { ApiResourceSecretDTO } from '../entities/dtos/api-resource-secret.dto'
import { ApiResourcesDTO } from '../entities/dtos/api-resources-dto'
import { ApiScopeDTO } from '../entities/dtos/api-scope-dto'
import IdentityResourceDTO from '../entities/dtos/identity-resource.dto'
import { UserClaimDTO } from '../entities/dtos/user-claim-dto'
import { ApiResourceScope } from '../entities/models/api-resource-scope.model'
import { ApiResourceSecret } from '../entities/models/api-resource-secret.model'
import { ApiResourceUserClaim } from '../entities/models/api-resource-user-claim.model'
import { ApiResource } from '../entities/models/api-resource.model'
import { ApiScopeUserClaim } from '../entities/models/api-scope-user-claim.model'
import { ApiScope } from '../entities/models/api-scope.model'
import { IdentityResourceUserClaim } from '../entities/models/identity-resource-user-claim.model'
import { IdentityResource } from '../entities/models/identity-resource.model'
import { BaseService } from './BaseService'

export class ResourcesService extends BaseService {
  /** Gets API scope by name */
  static async getApiResourceByName(name: string): Promise<ApiResource | null> {
    return BaseService.GET(`api-resource/${encodeURIComponent(name)}`)
  }

  /** Gets all identity resource user claims */
  static async findAllIdentityResourceUserClaims(): Promise<
    IdentityResourceUserClaim[] | undefined
  > {
    return BaseService.GET('identity-resource-user-claim')
  }

  /** Gets all identity resource user claims */
  static async findAllApiScopeUserClaims(): Promise<
    ApiScopeUserClaim[] | undefined
  > {
    return BaseService.GET('api-scope-user-claim')
  }

  /** Gets all Api resource user claims */
  static async findAllApiResourceUserClaims(): Promise<
    ApiResourceUserClaim[] | undefined
  > {
    return BaseService.GET('api-resource-user-claim')
  }

  /** Creates a new claim for ApiResource */
  static async createApiResourceUserClaim(
    claim: UserClaimDTO,
  ): Promise<ApiResourceUserClaim | undefined> {
    return BaseService.POST('api-resource-user-claim', claim)
  }

  /** Creates a new claim for ApiScope */
  static async createApiScopeUserClaim(
    claim: UserClaimDTO,
  ): Promise<ApiResourceUserClaim | undefined> {
    return BaseService.POST('api-scope-user-claim', claim)
  }

  /** Creates a new claim for Identity Resource */
  static async createIdentityResourceUserClaim(
    claim: UserClaimDTO,
  ): Promise<ApiResourceUserClaim | undefined> {
    return BaseService.POST('identity-resource-user-claim', claim)
  }

  /** Gets API scope by name */
  static async getApiScopeByName(name: string): Promise<ApiScope | null> {
    return BaseService.GET(`api-scope/${encodeURIComponent(name)}`)
  }

  /** Gets if scope name or identity resource name is availabe */
  static async isScopeNameAvailable(name): Promise<boolean> {
    return BaseService.GET(
      `is-scope-name-available/${encodeURIComponent(name)}`,
    )
  }

  /** Updates an existing Api Scope */
  static async updateApiResource(
    apiResource: ApiResourcesDTO,
    name: string,
  ): Promise<ApiResource | null> {
    return BaseService.PUT(
      `api-resource/${encodeURIComponent(name)}`,
      apiResource,
    )
  }

  /** Update an Api Scope */
  static async updateApiScope(apiScope: ApiScopeDTO): Promise<ApiScope> {
    return BaseService.PUT(
      `api-scope/${encodeURIComponent(apiScope.name)}`,
      apiScope,
    )
  }

  /** Finds all access controlled Api scopes */
  static async findAllAccessControlledApiScopes(): Promise<ApiScope[] | null> {
    return BaseService.GET('access-controlled-scopes')
  }

  /** Gets Identity resource by name */
  static async getIdentityResourceByName(
    name: string,
  ): Promise<IdentityResource | null> {
    return BaseService.GET(`identity-resource/${encodeURIComponent(name)}`)
  }

  /** Creates a new identity resource */
  static async createIdentityResource(
    identityResource: IdentityResourceDTO,
  ): Promise<IdentityResource | null> {
    return BaseService.POST(`identity-resource`, identityResource)
  }

  /** Updates an existing Identity resource */
  static async updateIdentityResource(
    identityResource: IdentityResourceDTO,
    name: string,
  ): Promise<IdentityResource | null> {
    return BaseService.PUT(
      `identity-resource/${encodeURIComponent(name)}`,
      identityResource,
    )
  }

  /** Add User Claim to Identity Resource */
  static async addIdentityResourceUserClaim(
    identityResourceName: string,
    claimName: string,
  ): Promise<IdentityResourceUserClaim | null> {
    return BaseService.POST(
      `identity-resource-user-claims/${encodeURIComponent(
        identityResourceName,
      )}/${encodeURIComponent(claimName)}`,
    )
  }

  /** Removes User claim from Identity resource */
  static async removeIdentityResourceUserClaim(
    identityResourceName: string,
    claimName: string,
  ): Promise<number> {
    return BaseService.DELETE(
      `identity-resource-user-claims/${encodeURIComponent(
        identityResourceName,
      )}/${encodeURIComponent(claimName)}`,
    )
  }

  /** Adds user claim to Api Scope */
  static async addApiScopeUserClaim(
    apiScopeName: string,
    claimName: string,
  ): Promise<IdentityResourceUserClaim | null> {
    return BaseService.POST(
      `api-scope-user-claims/${encodeURIComponent(
        apiScopeName,
      )}/${encodeURIComponent(claimName)}`,
    )
  }

  /** Removes user claim from Api Scope */
  static async removeApiScopeUserClaim(
    apiScopeName: string,
    claimName: string,
  ): Promise<number> {
    return BaseService.DELETE(
      `api-scope-user-claims/${encodeURIComponent(
        apiScopeName,
      )}/${encodeURIComponent(claimName)}`,
    )
  }

  /** Creates a new Api Resource */
  static async createApiResource(
    apiResource: ApiResourcesDTO,
  ): Promise<ApiResource> {
    return BaseService.POST('api-resource', apiResource)
  }

  /** Deletes an API resource */
  static async deleteApiResource(name: string): Promise<number> {
    return BaseService.DELETE(`api-resource/${encodeURIComponent(name)}`)
  }

  /** Get's all Api resources and total count of rows */
  static async findAndCountAllApiResources(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{
    rows: ApiResource[]
    count: number
  } | null> {
    return BaseService.GET(
      `api-resources?searchString=${searchString}&page=${page}&count=${count}`,
    )
  }

  /** Creates a new Api Scope */
  static async createApiScope(apiScope: ApiScopeDTO): Promise<ApiScope | null> {
    return BaseService.POST('api-scope', apiScope)
  }

  /** Get's all Api scopes and total count of rows */
  static async findAndCountAllApiScopes(
    page: number,
    count: number,
  ): Promise<{
    rows: ApiScope[]
    count: number
  } | null> {
    return BaseService.GET(`api-scopes?page=${page}&count=${count}`)
  }

  /** Deletes an API scope */
  static async deleteApiScope(name: string): Promise<number> {
    return BaseService.DELETE(`api-scope/${encodeURIComponent(name)}`)
  }

  /** Get's all identity resources and total count of rows */
  static async findAndCountAllIdentityResources(
    page: number,
    count: number,
  ): Promise<{
    rows: IdentityResource[]
    count: number
  } | null> {
    return BaseService.GET(`identity-resources?page=${page}&count=${count}`)
  }

  /** Deletes an identity resource by name */
  static async deleteIdentityResource(name: string): Promise<number> {
    return BaseService.DELETE(`identity-resource/${encodeURIComponent(name)}`)
  }

  /** Adds claim to Api resource */
  static async addApiResourceUserClaim(
    apiResourceName: string,
    claimName: string,
  ): Promise<ApiResourceUserClaim> {
    return BaseService.POST(
      `api-resource-claims/${encodeURIComponent(
        apiResourceName,
      )}/${encodeURIComponent(claimName)}`,
    )
  }

  /** Removes user claim from Api Resource */
  static async removeApiResourceUserClaim(
    apiResourceName: string,
    claimName: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `api-resource-claims/${encodeURIComponent(
        apiResourceName,
      )}/${encodeURIComponent(claimName)}`,
    )
  }

  /** Add secret to ApiResource */
  static async addApiResourceSecret(
    apiSecret: ApiResourceSecretDTO,
  ): Promise<ApiResourceSecret | null> {
    return BaseService.POST('api-resource-secret', apiSecret)
  }

  /** Remove a secret from Api Resource */
  static async removeApiResourceSecret(
    apiSecret: ApiResourceSecretDTO,
  ): Promise<number | null> {
    return BaseService.DELETE('api-resource-secret', apiSecret)
  }

  /** Adds an allowed scope to api resource */
  static async addApiResourceAllowedScope(
    resourceAllowedScope: ApiResourceScopeDTO,
  ): Promise<ApiResourceScope | null> {
    return BaseService.POST('api-resources-allowed-scope', resourceAllowedScope)
  }

  /** Removes an allowed scope from api Resource */
  static async removeApiResourceAllowedScope(
    apiResourceName: string,
    scopeName: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `api-resources-allowed-scope/${encodeURIComponent(
        apiResourceName,
      )}/${encodeURIComponent(scopeName)}`,
    )
  }

  static async getApiResourcesCsv(): Promise<any[] | null> {
    const result = await BaseService.GET(
      `api-resources?page=${1}&count=${Number.MAX_SAFE_INTEGER}`,
    )
    return result.rows.map((r) => ResourcesService.toApiResourceCsv(r))
  }

  static toApiResourceCsv = (apiResource: ApiResource): any[] => {
    return [
      apiResource.name,
      apiResource.displayName,
      apiResource.nationalId,
      apiResource.contactEmail,
      apiResource.created,
      apiResource.modified,
      apiResource.enabled,
      apiResource.archived,
    ]
  }

  static getApiResourcesCsvHeaders(): string[] {
    return [
      'Name',
      'DisplayName',
      'NationalId',
      'Contact',
      'Created',
      'Modified',
      'Enabled',
      'Archived',
    ]
  }
}
