import { Injectable } from '@nestjs/common'
import DataLoader from 'dataloader'

import { NestDataLoader } from '@island.is/nest/dataloader'

import { Client } from '../models/client.model'

export type ClientDataLoader = DataLoader<string, Client>

@Injectable()
export class ClientLoader implements NestDataLoader<string, Client> {
  async loadClients(
    clientIds: readonly string[],
  ): Promise<Array<Client>> {

    // Todo: Add call to client endpoint in delegation api when ready.

    return clientIds.map((clientId) => ({
        id: clientId,
      })
    )
  }

  generateDataLoader(): ClientDataLoader {
    return new DataLoader(this.loadClients.bind(this))
  }
}
