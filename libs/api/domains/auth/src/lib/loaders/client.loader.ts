import { Injectable } from '@nestjs/common'
import DataLoader from 'dataloader'

import { NestDataLoader } from '@island.is/nest/dataloader'

import { ClientInput } from '../dto/client.input'
import { Client } from '../models/client.model'

export type ClientDataLoader = DataLoader<ClientInput, Client>

@Injectable()
export class ClientLoader implements NestDataLoader<ClientInput, Client> {
  keyFn(input: ClientInput): string {
    return `${input.lang}##${input.clientId}`
  }

  async loadClients(inputs: readonly ClientInput[]): Promise<Array<Client>> {
    // Todo: Add call to client endpoint in delegation api when ready.

    return inputs.map((input) => ({
      id: input.clientId,
      name: input.clientId,
    }))
  }

  generateDataLoader(): ClientDataLoader {
    return new DataLoader(this.loadClients.bind(this), {
      cacheKeyFn: this.keyFn,
    })
  }
}
