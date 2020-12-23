import { ApiResourceScopeDTO } from '../entities/dtos/api-resource-allowed-scope.dto';
import { ApiResourceSecretDTO } from '../entities/dtos/api-resource-secret.dto';
import { ApiResourcesDTO } from '../entities/dtos/api-resources-dto';
import { ApiScopesDTO } from '../entities/dtos/api-scopes-dto';
import IdentityResourcesDTO from '../entities/dtos/identity-resources.dto';
import { ApiResourceScope } from '../entities/models/api-resource-scope.model';
import { ApiResourceSecret } from '../entities/models/api-resource-secret.model';
import { ApiResourceUserClaim } from '../entities/models/api-resource-user-claim.model';
import { ApiResource } from '../entities/models/api-resource.model';
import { ApiScope } from '../entities/models/api-scope.model';
import { IdentityResourceUserClaim } from '../entities/models/identity-resource-user-claim.model';
import { IdentityResource } from '../entities/models/identity-resource.model';
import { BaseService } from './BaseService';

export class ResourcesService extends BaseService {
  /** Gets API scope by name */
  static async getApiResourceByName(name: string): Promise<ApiResource | null> {
    return BaseService.GET(`api-resource/${name}`);
  }

  /** Gets API scope by name */
  static async getApiScopeByName(name: string): Promise<ApiScope | null> {
    return BaseService.GET(`api-scope/${name}`);
  }

  /** Updates an existing Api Scope */
  static async updateApiResource(
    apiResource: ApiResourcesDTO,
    name: string
  ): Promise<ApiResource | null> {
    return BaseService.PUT(`api-resource/${name}`, apiResource);
  }

  /** Update an Api Scope */
  static async updateApiScope(apiScope: ApiScopesDTO): Promise<ApiScope> {
    return BaseService.PUT(`api-scope/${apiScope.name}`, apiScope);
  }

  /** Gets Identity resource by name */
  static async getIdentityResourceByName(
    name: string
  ): Promise<IdentityResource | null> {
    return BaseService.GET(`identity-resource/${name}`);
  }

  /** Creates a new identity resource */
  static async createIdentityResource(
    identityResource: IdentityResourcesDTO
  ): Promise<IdentityResource | null> {
    return BaseService.POST(`identity-resource`, identityResource);
  }

  /** Updates an existing Identity resource */
  static async updateIdentityResource(
    identityResource: IdentityResourcesDTO,
    name: string
  ): Promise<IdentityResource | null> {
    return BaseService.PUT(`identity-resource/${name}`, identityResource);
  }

  /** Gets user claims for a resource */
  static async getResourceUserClaims(name: string): Promise<any | null> {
    return BaseService.GET(`user-claims/${name}`);
  }

  /** Add User Claim to Identity Resource */
  static async addIdentityResourceUserClaim(
    identityResourceName: string,
    claimName: string
  ): Promise<IdentityResourceUserClaim | null> {
    return BaseService.POST(
      `identity-resource-user-claims/${identityResourceName}/${claimName}`
    );
  }

  /** Removes User claim from Identity resource */
  static async removeIdentityResourceUserClaim(
    identityResourceName: string,
    claimName: string
  ): Promise<number> {
    return BaseService.DELETE(
      `identity-resource-user-claims/${identityResourceName}/${claimName}`
    );
  }

  /** Adds user claim to Api Scope */
  static async addApiScopeUserClaim(
    apiScopeName: string,
    claimName: string
  ): Promise<IdentityResourceUserClaim | null> {
    return BaseService.POST(
      `api-scope-user-claims/${apiScopeName}/${claimName}`
    );
  }

  /** Removes user claim from Api Scope */
  static async removeApiScopeUserClaim(
    apiScopeName: string,
    claimName: string
  ): Promise<number> {
    return BaseService.DELETE(
      `api-scope-user-claims/${apiScopeName}/${claimName}`
    );
  }

  /** Creates a new Api Resource */
  static async createApiResource(
    apiResource: ApiResourcesDTO
  ): Promise<ApiResource> {
    return BaseService.POST('api-resource', apiResource);
  }

  /** Deletes an API resource */
  static async deleteApiResource(name: string): Promise<number> {
    return BaseService.DELETE(`api-resource/${name}`);
  }

  /** Get's all Api resources and total count of rows */
  static async findAndCountAllApiResources(
    page: number,
    count: number
  ): Promise<{
    rows: ApiResource[];
    count: number;
  } | null> {
    return BaseService.GET(`api-resources?page=${page}&count=${count}`);
  }

  /** Creates a new Api Scope */
  static async createApiScope(
    apiScope: ApiScopesDTO
  ): Promise<ApiScope | null> {
    return BaseService.POST('api-scope', apiScope);
  }

  /** Get's all Api scopes and total count of rows */
  static async findAndCountAllApiScopes(
    page: number,
    count: number
  ): Promise<{
    rows: ApiScope[];
    count: number;
  } | null> {
    return BaseService.GET(`api-scopes?page=${page}&count=${count}`);
  }

  /** Deletes an API scope */
  static async deleteApiScope(name: string): Promise<number> {
    return BaseService.DELETE(`api-scope/${name}`);
  }

  /** Get's all identity resources and total count of rows */
  static async findAndCountAllIdentityResources(
    page: number,
    count: number
  ): Promise<{
    rows: IdentityResource[];
    count: number;
  } | null> {
    return BaseService.GET(`identity-resources?page=${page}&count=${count}`);
  }

  /** Deletes an identity resource by name */
  static async deleteIdentityResource(name: string): Promise<number> {
    return BaseService.DELETE(`identity-resource/${name}`);
  }

  /** Adds claim to Api resource */
  static async addApiResourceUserClaim(
    apiResourceName: string,
    claimName: string
  ): Promise<ApiResourceUserClaim> {
    return BaseService.POST(
      `api-resource-claims/${apiResourceName}/${claimName}`
    );
  }

  /** Removes user claim from Api Resource */
  async removeApiResourceUserClaim(
    apiResourceName: string,
    claimName: string
  ): Promise<number | null> {
    return BaseService.DELETE(
      `api-resource-claims/${apiResourceName}/${claimName}`
    );
  }

  /** Add secret to ApiResource */
  async addApiResourceSecret(
    apiSecret: ApiResourceSecretDTO
  ): Promise<ApiResourceSecret | null> {
    return BaseService.POST(`api-resource-secret`, apiSecret);
  }

  /** Remove a secret from Api Resource */
  async removeApiResourceSecret(
    apiSecret: ApiResourceSecretDTO
  ): Promise<number | null> {
    return BaseService.POST('api-resource-secret', apiSecret);
  }

  /** Adds an allowed scope to api resource */
  static async addApiResourceAllowedScope(
    resourceAllowedScope: ApiResourceScopeDTO
  ): Promise<ApiResourceScope | null> {
    return BaseService.POST(
      'api-resources-allowed-scope',
      resourceAllowedScope
    );
  }

  /** Removes an allowed scope from api Resource */
  static async removeApiResourceAllowedScope(
    apiResourceName: string,
    scopeName: string
  ): Promise<number | null> {
    return BaseService.DELETE(
      `api-resources-allowed-scope/${apiResourceName}/${scopeName}`
    );
  }
}
