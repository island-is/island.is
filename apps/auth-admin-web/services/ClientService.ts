import { Client } from '../entities/models/client.model';
import api from './api';
import { BaseService } from './BaseService';

export class ClientService extends BaseService {
  static async getClients(
    page: number,
    count: number
  ): Promise<{ rows: Client[]; count: number } | null> {
    try {
      const response = await api.get(`clients/?page=${page}&count=${count}`);
      return BaseService.handleResponse(response);
    } catch (error) {
      BaseService.handleError(error);
      return null;
    }
  }
}
