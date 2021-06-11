import fetch from 'node-fetch'
import { CategoryResponse, SearchResponse } from './freshdesk.type'

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

  async getCategories(): Promise<CategoryResponse[]> {
    const response = await fetch(
      `${this.api}/solutions/categories`,
      this.params,
    )

    return response.json()
  }

  async search(term: string): Promise<SearchResponse[]> {
    const response = await fetch(
      `${this.api}/search/solutions?term=${term}`,
      this.params,
    )

    return response.json()
  }
}
