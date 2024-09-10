import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { Request, Response } from 'express'
import fetch from 'node-fetch'
import { BffConfig } from '../../bff.config'
import { CryptoService } from '../../services/crypto.service'
import { isExpired } from '../../utils/isExpired'
import { AuthService } from '../auth/auth.service'
import { CachedTokenResponse } from '../auth/auth.types'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'

const whiteListedHeaders = ['access-control-allow-origin']

@Injectable()
export class ProxyService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,

    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
    private readonly authService: AuthService,
    private readonly cryptoService: CryptoService,
  ) {}

  /**
   * Prepares necessary data for proxying a request to the target GraphQL API.
   * - Gets the cached token response from the cache service
   * - Refreshes the token if it is expired
   * - Decrypts the access token
   */
  private async prepareProxyRequest(sid: string, req: Request) {
    let cachedTokenResponse = await this.cacheService.get<CachedTokenResponse>(
      this.cacheService.createSessionKeyType('current', sid),
    )

    if (isExpired(cachedTokenResponse.accessTokenExp)) {
      const tokenResponse = await this.idsService.refreshToken(
        cachedTokenResponse.refresh_token,
      )
      cachedTokenResponse = await this.authService.updateTokenCache(
        tokenResponse,
      )
    }

    const targetUrl = `${this.config.graphqlApiEndpont}?${
      req.url.split('?')[1]
    }`
    const decryptedAccessToken = this.cryptoService.decrypt(
      cachedTokenResponse.access_token,
    )

    return {
      targetUrl,
      decryptedAccessToken,
    }
  }

  /**
   * Proxies an incoming HTTP request to a target GraphQL API, handling authentication, token refresh,
   * and response streaming. This method checks for a valid session ID (sid) from cookies, retrieves
   * the cached authentication token, and refreshes it if expired. It then forwards the request
   * to the target GraphQL API using the appropriate headers, including the refreshed token.
   * The response from the target API is streamed back to the client, preserving headers
   * and managing any errors that occur during the streaming process.
   */
  public async proxyRequest({
    req,
    res,
  }: {
    req: Request
    res: Response
  }): Promise<void> {
    const sid = req.cookies['sid']

    if (!sid) {
      throw new UnauthorizedException()
    }

    try {
      const { targetUrl, decryptedAccessToken } =
        await this.prepareProxyRequest(sid, req)

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${decryptedAccessToken}`,
        },
        body: JSON.stringify(req.body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Set the status code of the response
      res.status(response.status)

      response.headers.forEach((value, key) => {
        // Only set headers that are not in the whiteListedHeaders array
        if (!whiteListedHeaders.includes(key.toLowerCase())) {
          res.setHeader(key, value)
        }
      })

      // Pipe the response body directly to the client
      response.body.pipe(res)

      response.body.on('error', (err) => {
        this.logger.error('Proxy stream error:', err)

        // This check ensures that `res.end()` is only called if the response has not already been ended.
        if (!res.writableEnded) {
          // Ensure the response is properly ended if an error occurs
          res.end('An error occurred while streaming data.')
        }
      })

      // Make sure to end the response when the stream ends,
      // so that the client knows the request is complete.
      response.body.on('end', () => {
        if (!res.writableEnded) {
          res.end()
        }
      })
    } catch (error) {
      this.logger.error('Error during proxy request processing: ', error)

      res.status(error.status || 500).send('Failed to proxy request')
    }
  }
}
