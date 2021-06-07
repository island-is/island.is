import fetch from 'node-fetch'
import { TicketResponse } from './freshdesk.type'

export interface FreshdeskConfig {
  domain: string
  key: string
}

export class freshdeskApi {
  private readonly api: string
  private readonly key: string
  private readonly params: object

  constructor(freshdeskConfig: FreshdeskConfig) {
    this.api = `${freshdeskConfig.domain}/api/v2`
    this.key = freshdeskConfig.key

    const token = Buffer.from(`${this.key}:X`).toString('base64')

    this.params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }
  }

  async getTickets(): Promise<TicketResponse[]> {
    const response = await fetch(`${this.api}/tickets`, this.params)
    return response.json()
  }
}

export function freshdesk(): string {
  return 'freshdesk'
}
