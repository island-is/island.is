import { ClientAllowedCorsOriginDTO } from '../entities/dtos/client-allowed-cors-origin.dto';
import { ClientPostLogoutRedirectUriDTO } from '../entities/dtos/client-post-logout-redirect-uri.dto';
import { ClientSecretDTO } from '../entities/dtos/client-secret.dto';
import { ApiScope } from '../entities/models/api-scope.model';
import { ClientAllowedCorsOrigin } from '../entities/models/client-allowed-cors-origin.model';
import { ClientPostLogoutRedirectUri } from '../entities/models/client-post-logout-redirect-uri.model';
import { ClientSecret } from '../entities/models/client-secret.model';
import { Client } from '../entities/models/client.model';
import { BaseService } from './BaseService';

export class ClientService extends BaseService {
  /** Gets all clients with paging */
  static async findAndCountAll(
    page: number,
    count: number
  ): Promise<{ rows: Client[]; count: number } | null> {
    return BaseService.GET(`clients/?page=${page}&count=${count}`);
  }

  /** Deletes client */
  static async deleteClient(clientId: string): Promise<number | null> {
    return BaseService.DELETE(`clients/${clientId}`);
  }

  /** Adds Allowed CORS origin for client */
  static async addAllowedCorsOrigin(
    corsOrigin: ClientAllowedCorsOriginDTO
  ): Promise<ClientAllowedCorsOrigin | null> {
    return BaseService.POST('cors', corsOrigin);
  }

  /** Removes an allowed cors origin for client */
  static async removeAllowedCorsOrigin(
    clientId: string,
    origin: string
  ): Promise<number | null> {
    return BaseService.DELETE(`cors/${clientId}/${encodeURIComponent(origin)}`);
  }

  /** Finds available scopes for AdminUI to select allowed scopes */
  static async FindAvailabeScopes(): Promise<ApiScope[] | null> {
    return BaseService.GET(`client-allowed-scope`);
  }

  /** Add secret to Client */
  static async addClientSecret(
    clientSecret: ClientSecretDTO
  ): Promise<ClientSecret | null> {
    return BaseService.POST('client-secret', clientSecret);
  }

  /** Remove a secret from Client */
  static async removeClientSecret(
    clientSecret: ClientSecretDTO
  ): Promise<number | null> {
    return BaseService.DELETE('client-secret', clientSecret);
  }

  /** Adds an post logout uri to client */
  static async addPostLogoutRedirectUri(
    postLogoutUri: ClientPostLogoutRedirectUriDTO
  ): Promise<ClientPostLogoutRedirectUri | null> {
    return BaseService.POST(`client-post-logout-redirect-uri`, postLogoutUri);
  }

  /** Removes an post logout uri from client */
  static async removePostLogoutRedirectUri(
    clientId: string,
    redirectUri: string
  ): Promise<number | null> {
    return BaseService.DELETE(
      `client-post-logout-redirect-uri/${clientId}/${encodeURIComponent(
        redirectUri
      )}`
    );
  }
}
