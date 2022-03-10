import { ClientAllowedCorsOriginDTO } from '../entities/dtos/client-allowed-cors-origin.dto'
import { ClientAllowedScopeDTO } from '../entities/dtos/client-allowed-scope.dto'
import { ClientClaimDTO } from '../entities/dtos/client-claim.dto'
import ClientDTO from '../entities/dtos/client-dto'
import { ClientGrantTypeDTO } from '../entities/dtos/client-grant-type.dto'
import { ClientPostLogoutRedirectUriDTO } from '../entities/dtos/client-post-logout-redirect-uri.dto'
import { ClientRedirectUriDTO } from '../entities/dtos/client-redirect-uri.dto'
import { ClientSecretDTO } from '../entities/dtos/client-secret.dto'
import { IdpRestrictionDTO } from '../entities/dtos/idp-restriction.dto'
import { ApiScope } from '../entities/models/api-scope.model'
import { ClientAllowedCorsOrigin } from '../entities/models/client-allowed-cors-origin.model'
import { ClientAllowedScope } from '../entities/models/client-allowed-scope.model'
import { ClientClaim } from '../entities/models/client-claim.model'
import { ClientGrantType } from '../entities/models/client-grant-type.model'
import { ClientIdpRestrictions } from '../entities/models/client-idp-restrictions.model'
import { ClientPostLogoutRedirectUri } from '../entities/models/client-post-logout-redirect-uri.model'
import { ClientRedirectUri } from '../entities/models/client-redirect-uri.model'
import { ClientSecret } from '../entities/models/client-secret.model'
import { Client } from '../entities/models/client.model'
import { IdpProvider } from '../entities/models/IdpProvider.model'
import { BaseService } from './BaseService'

export class ClientService extends BaseService {
  /** Gets all clients with paging */
  static async findAndCountAll(
    searchString: string,
    page: number,
    count: number,
  ): Promise<{ rows: Client[]; count: number } | null> {
    return BaseService.GET(
      `clients/?searchString=${encodeURIComponent(
        searchString,
      )}&page=${page}&count=${count}`,
    )
  }

  /** Gets a client by it's id */
  static async findClientById(id: string): Promise<Client | null> {
    return BaseService.GET(`clients/${encodeURIComponent(id)}`)
  }

  /** Creates a new client */
  static async create(client: ClientDTO): Promise<Client | null> {
    return BaseService.POST('clients', client)
  }

  /** Updates an existing client */
  static async update(client: ClientDTO, id: string): Promise<Client | null> {
    delete client.clientId
    return BaseService.PUT(`clients/${encodeURIComponent(id)}`, client)
  }

  /** Sets default grant type and allowed scope */
  static async setDefaults(client: Client, baseUrl?: string): Promise<boolean> {
    let response = true
    const scopeResponse = ClientService.addAllowedScope({
      clientId: client.clientId,
      scopeName: 'openid',
    })
    if (!scopeResponse) response = false
    if (client.clientType === 'machine') {
      const grantResponse = ClientService.addGrantType({
        clientId: client.clientId,
        grantType: 'client_credentials',
      })
      if (!grantResponse) response = false
    } else {
      const grantResponse = ClientService.addGrantType({
        clientId: client.clientId,
        grantType: 'authorization_code',
      })
      if (!grantResponse) response = false
    }

    if (baseUrl) {
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.substr(0, baseUrl.length - 2)
      }
      const callBackUri = ClientService.addRedirectUri({
        clientId: client.clientId,
        redirectUri: baseUrl + '/signin-oidc',
      })
      if (!callBackUri) {
        response = false
      }

      const postLogOutUri = ClientService.addPostLogoutRedirectUri({
        clientId: client.clientId,
        redirectUri: baseUrl,
      })
      if (!postLogOutUri) {
        response = false
      }

      const corsOrigin = ClientService.addAllowedCorsOrigin({
        clientId: client.clientId,
        origin: baseUrl,
      })
      if (!corsOrigin) {
        response = false
      }
    }

    return response
  }

  /** Deletes client */
  static async delete(clientId: string): Promise<number | null> {
    return BaseService.DELETE(`clients/${encodeURIComponent(clientId)}`)
  }

  /** Adds Allowed CORS origin for client */
  static async addAllowedCorsOrigin(
    corsOrigin: ClientAllowedCorsOriginDTO,
  ): Promise<ClientAllowedCorsOrigin | null> {
    return BaseService.POST('cors', corsOrigin)
  }

  /** Removes an allowed cors origin for client */
  static async removeAllowedCorsOrigin(
    clientId: string,
    origin: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `cors/${encodeURIComponent(clientId)}/${encodeURIComponent(origin)}`,
    )
  }

  /** Finds available scopes for AdminUI to select allowed scopes */
  static async findAvailabeScopes(): Promise<ApiScope[] | null> {
    return BaseService.GET(`client-allowed-scope`)
  }

  /** Add secret to Client */
  static async addClientSecret(
    clientSecret: ClientSecretDTO,
  ): Promise<ClientSecret | null> {
    return BaseService.POST('client-secret', clientSecret)
  }

  /** Remove a secret from Client */
  static async removeClientSecret(
    clientSecret: ClientSecretDTO,
  ): Promise<number | null> {
    return BaseService.DELETE('client-secret', clientSecret)
  }

  /** Adds an post logout uri to client */
  static async addPostLogoutRedirectUri(
    postLogoutUri: ClientPostLogoutRedirectUriDTO,
  ): Promise<ClientPostLogoutRedirectUri | null> {
    return BaseService.POST(`client-post-logout-redirect-uri`, postLogoutUri)
  }

  /** Removes an post logout uri from client */
  static async removePostLogoutRedirectUri(
    clientId: string,
    redirectUri: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `client-post-logout-redirect-uri/${encodeURIComponent(
        clientId,
      )}/${encodeURIComponent(redirectUri)}`,
    )
  }

  /** Adds an claim to client */
  static async addClaim(claim: ClientClaimDTO): Promise<ClientClaim | null> {
    return BaseService.POST(`client-claim`, claim)
  }

  /** Removes an claim from client */
  static async removeClaim(
    clientId: string,
    claimType: string,
    claimValue: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `client-claim/${encodeURIComponent(clientId)}/${encodeURIComponent(
        claimType,
      )}/${encodeURIComponent(claimValue)}`,
    )
  }

  /** Adds an allowed scope to client */
  static async addAllowedScope(
    clientAllowedScope: ClientAllowedScopeDTO,
  ): Promise<ClientAllowedScope | null> {
    return BaseService.POST(`client-allowed-scope`, clientAllowedScope)
  }

  /** Removes an allowed scope from client */
  static async removeAllowedScope(
    clientId: string,
    scopeName: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `client-allowed-scope/${encodeURIComponent(
        clientId,
      )}/${encodeURIComponent(scopeName)}`,
    )
  }

  /** Adds a grant type to client */
  static async addGrantType(
    grantTypeObj: ClientGrantTypeDTO,
  ): Promise<ClientGrantType | null> {
    return BaseService.POST(`client-grant-type`, grantTypeObj)
  }

  /** Removes a grant type for client */
  static async removeGrantType(
    clientId: string,
    grantType: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `client-grant-type/${encodeURIComponent(clientId)}/${encodeURIComponent(
        grantType,
      )}`,
    )
  }

  /** Adds an redirect uri for client */
  static async addRedirectUri(
    redirectObject: ClientRedirectUriDTO,
  ): Promise<ClientRedirectUri | null> {
    return BaseService.POST(`redirect-uri`, redirectObject)
  }

  /** Removes an redirect uri for client */
  static async removeRedirectUri(
    clientId: string,
    redirectUri: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `redirect-uri/${encodeURIComponent(clientId)}/${encodeURIComponent(
        redirectUri,
      )}`,
    )
  }

  /** Adds IDP restriction to client */
  static async addIdpRestriction(
    clientIdpRestriction: IdpRestrictionDTO,
  ): Promise<ClientIdpRestrictions | null> {
    return BaseService.POST(`idp-restriction`, clientIdpRestriction)
  }

  /** Removes an IDP restriction for a client */
  static async removeIdpRestriction(
    clientId: string,
    name: string,
  ): Promise<number | null> {
    return BaseService.DELETE(
      `idp-restriction/${encodeURIComponent(clientId)}/${encodeURIComponent(
        name,
      )}`,
    )
  }

  /** Get IDP providers that can be restricted by client */
  static async findAllIdpProviders(): Promise<IdpProvider[] | null> {
    return BaseService.GET(`idp-restriction`)
  }

  static async getClientsCsv(): Promise<any[] | null> {
    const result = await BaseService.GET(
      `clients?page=${1}&count=${Number.MAX_SAFE_INTEGER}`,
    )
    return result.rows.map((r) => ClientService.toClientCsv(r))
  }

  static toClientCsv = (client: Client): any[] => {
    return [
      client.clientId,
      client.clientType,
      client.clientName,
      client.description,
      client.nationalId,
      client.contactEmail,
      client.created,
      client.modified,
      client.enabled,
      client.archived,
    ]
  }

  static getClientsCsvHeaders(): string[] {
    return [
      'ClientId',
      'ClientType',
      'ClientName',
      'Description',
      'NationalId',
      'Contact',
      'Created',
      'Modified',
      'Enabled',
      'Archived',
    ]
  }
}
