import { ApiResourcesDTO } from '../entities/dtos/api-resources-dto';
import { ApiScopesDTO } from '../entities/dtos/api-scopes-dto';
import IdentityResourcesDTO from '../entities/dtos/identity-resources.dto';
import { ApiResource } from '../entities/models/api-resource.model';
import { ApiScope } from '../entities/models/api-scope.model';
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

  /** */
  static async addResourceUserClaim(
    identityResourceName: string,
    claimName: string
  ): Promise<IdentityResourceUserClaim> {
    return BaseService.POST(`user-claims/${identityResourceName}/${claimName}`);
  }

  static async removeResourceUserClaim(
    identityResourceName: string,
    claimName: string
  ): Promise<number> {
    return BaseService.DELETE(
      `user-claims/${identityResourceName}/${claimName}`
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
}
