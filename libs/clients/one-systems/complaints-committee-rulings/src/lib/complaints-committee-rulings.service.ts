import { Inject, Injectable } from '@nestjs/common'
import type { ConfigType } from '@island.is/nest/config'
import {
  AuthApi,
  RulingsApi,
  GetRulingsRequest,
  Configuration,
} from '../../gen/fetch'
import { FetchError, createEnhancedFetch } from '@island.is/clients/middlewares'
import { ComplaintsCommitteeRulingsClientConfig } from './complaints-committee-rulings.config'

export interface ComplaintsCommitteeRuling {
  id: string
  title: string
  description: string
  publishedDate: Date
}

export interface ComplaintsCommitteeRulingsResponse {
  rulings: ComplaintsCommitteeRuling[]
  totalCount: number
}

@Injectable()
export class ComplaintsCommitteeRulingsClientService {
  private accessToken: string | null = null
  private tokenExpiry: Date | null = null

  constructor(
    private readonly authApi: AuthApi,
    @Inject(ComplaintsCommitteeRulingsClientConfig.KEY)
    private readonly config: ConfigType<
      typeof ComplaintsCommitteeRulingsClientConfig
    >,
  ) {}

  private async ensureAuthenticated(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken
    }

    // Get new token
    const response = await this.authApi.getAuthToken({
      xAPIKEY: this.config.apiKey,
    })

    this.accessToken = response.accessToken ?? null

    // Set token expiry to 55 minutes (assuming 1 hour token lifetime)
    this.tokenExpiry = new Date(Date.now() + 55 * 60 * 1000)

    if (!this.accessToken) {
      throw new Error('Failed to obtain access token')
    }

    return this.accessToken
  }

  private createAuthenticatedRulingsApi(token: string): RulingsApi {
    const config = new Configuration({
      fetchApi: createEnhancedFetch({
        name: 'clients-complaints-committee-rulings',
        logErrorResponseBody: true,
      }),
      basePath: `${this.config.basePath}/OneRulings`,
      accessToken: token,
      headers: {
        Accept: 'application/json',
      },
    })
    return new RulingsApi(config)
  }

  async getRulings(
    input: GetRulingsRequest,
    isRetry = false,
  ): Promise<ComplaintsCommitteeRulingsResponse> {
    try {
      const token = await this.ensureAuthenticated()
      const rulingsApi = this.createAuthenticatedRulingsApi(token)

      const response = await rulingsApi.getRulings(input)

      return {
        rulings: (response.rulings ?? []).map((ruling) => ({
          id: ruling.id ?? '',
          title: ruling.title ?? '',
          description: ruling.description ?? '',
          publishedDate: ruling.publishedDate
            ? new Date(ruling.publishedDate)
            : new Date(),
        })),
        totalCount: response.totalCount ?? 0,
      }
    } catch (error) {
      if (error instanceof FetchError && error.status === 401 && !isRetry) {
        // Token might be invalid, clear it and retry once
        this.accessToken = null
        this.tokenExpiry = null
        return this.getRulings(input, true)
      }
      throw error
    }
  }

  async getRulingPdf(id: string): Promise<string> {
    try {
      const token = await this.ensureAuthenticated()

      // Fetch PDF as binary directly (bypass generated client which treats response as text)
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10_000)
      const response = await fetch(
        `${this.config.basePath}/OneRulings/api/rulings/${encodeURIComponent(
          id,
        )}/pdf`,
        {
          method: 'GET',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/pdf',
          },
        },
      )
      clearTimeout(timeout)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Ruling with id ${id} not found`)
        }
        throw new Error(`Failed to fetch PDF: ${response.status}`)
      }

      // Get as ArrayBuffer and convert to base64
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer).toString('base64')
    } catch (error) {
      if (error instanceof FetchError && error.status === 404) {
        throw new Error(`Ruling with id ${id} not found`)
      }
      throw error
    }
  }
}
