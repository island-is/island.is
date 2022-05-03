import {
  MagicBellCreateResponse,
  Message,
} from '../notifications/dto/createNotification.dto'
import { Inject, Injectable } from '@nestjs/common'
import { CreateNotificationResponse } from '../notifications/dto/createNotification.response'

export const MAGICBELL_API_SECRET = Symbol('MAGICBELL_API_SECRET')
export const MAGICBELL_API_KEY = Symbol('MAGICBELL_API_KEY')

@Injectable()
export class MagicBellService {
  /* TODO Use injected api keys rather than environment keys
  constructor(
    @Inject(MAGICBELL_API_KEY) private readonly apiKey: string,
    @Inject(MAGICBELL_API_SECRET) private readonly apiSecret: string,
  ) {}
  */

  async createNotification(
    message: Message,
  ): Promise<CreateNotificationResponse> {
    const { notification }: MagicBellCreateResponse = await fetch(
      'https://api.magicbell.com/notifications',
      {
        method: 'POST',
        headers: {
          'X-MAGICBELL-API-KEY': process.env.MAGICBELL_API_KEY ?? '',
          'X-MAGICBELL-API-SECRET': process.env.MAGICBELL_API_SECRET ?? '',
        },
        body: JSON.stringify({
          notification: {
            title: message,
            recipients: [
              {
                id: message.recipient,
              },
            ],
          },
        }),
      },
    ).then((r) => r.json())
    return { id: notification.id }
  }
}
