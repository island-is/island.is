import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'

export interface AttachmentPresignedUrl {
  key: string
  url: string
}

interface AttachmentPresignedUrlsResponse {
  attachments: AttachmentPresignedUrl[]
}

@Injectable()
export class ApplicationSystemApiService {
  private readonly baseUrl: string
  private cachedToken: string | null = null
  private tokenExpiresAt = 0

  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    this.baseUrl = environment.applicationSystemApiUrl
  }

  private async getAccessToken(): Promise<string | null> {
    const now = Date.now()
    if (this.cachedToken && now < this.tokenExpiresAt) {
      return this.cachedToken
    }

    const { clientId, clientSecret, tokenUrl } =
      environment.applicationSystemApiAuth

    if (!clientId || !clientSecret || !tokenUrl) {
      this.logger.warn(
        'Application system API auth not fully configured (missing clientId, clientSecret, or tokenUrl)',
      )
      return null
    }

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          scope: '@island.is/applications:read',
        }).toString(),
      })

      if (!response.ok) {
        this.logger.warn(
          `Failed to get access token for application-system-api: ${response.status}`,
        )
        return null
      }

      const data = await response.json()
      this.cachedToken = data.access_token
      this.tokenExpiresAt = now + (data.expires_in - 60) * 1000
      return this.cachedToken
    } catch (error) {
      this.logger.error(
        'Error obtaining access token for application-system-api',
        error,
      )
      return null
    }
  }

  async getPresignedUrlsForApplication(
    applicationSystemId: string,
  ): Promise<Map<string, string>> {
    if (!this.baseUrl) {
      this.logger.warn(
        'APPLICATION_SYSTEM_API_URL not configured, cannot fetch presigned URLs',
      )
      return new Map()
    }

    const token = await this.getAccessToken()
    if (!token) {
      return new Map()
    }

    const url = `${this.baseUrl}/applications/${applicationSystemId}/attachments/presigned-urls`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        this.logger.warn(
          `Failed to fetch presigned URLs from application-system-api: ${response.status} ${response.statusText}`,
        )
        return new Map()
      }

      const data: AttachmentPresignedUrlsResponse = await response.json()
      const urlMap = new Map<string, string>()

      for (const attachment of data.attachments) {
        urlMap.set(attachment.key, attachment.url)
      }

      return urlMap
    } catch (error) {
      this.logger.error(
        'Error fetching presigned URLs from application-system-api',
        error,
      )
      return new Map()
    }
  }
}
