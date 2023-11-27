import { Injectable } from '@nestjs/common'

import { TranslationService } from '../translation/translation.service'
import { Client } from './models/client.model'

@Injectable()
export class ClientsTranslationService {
  constructor(private readonly translationService: TranslationService) {}

  async translateClients(clients: Client[], lang: string): Promise<Client[]> {
    const translationMap = await this.translationService.findTranslationMap(
      'client',
      clients.map((client) => client.clientId),
      false,
      lang,
    )

    if (translationMap.size === 0) {
      return clients
    }

    for (const client of clients) {
      client.clientName =
        translationMap.get(client.clientId)?.get('clientName') ??
        client.clientName
    }

    return clients
  }
}
