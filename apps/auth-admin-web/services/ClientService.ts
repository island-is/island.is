import { ClientAllowedCorsOriginDTO } from '../entities/dtos/client-allowed-cors-origin.dto';
import { ApiScope } from '../entities/models/api-scope.model';
import { ClientAllowedCorsOrigin } from '../entities/models/client-allowed-cors-origin.model';
import { Client } from '../entities/models/client.model';
import api from './api';
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
}
