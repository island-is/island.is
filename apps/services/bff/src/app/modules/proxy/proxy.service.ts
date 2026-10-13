import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import AgentKeepAlive, { HttpsAgent } from 'agentkeepalive'
import type { Request, Response } from 'express'
import fetch from 'node-fetch'
import { BffConfig } from '../../bff.config'
import { CryptoService } from '../../services/crypto.service'

import { AGENT_DEFAULT_FREE_SOCKET_TIMEOUT } from '@island.is/shared/constants'
import { ErrorService } from '../../services/error.service'
import { SessionCookieService } from '../../services/sessionCookie.service'
import { hasTimestampExpiredInMS } from '../../utils/has-timestamp-expired-in-ms'
import { validateUri } from '../../utils/validate-uri'
import { CachedTokenResponse } from '../auth/auth.types'
import { TokenRefreshService } from '../auth/token-refresh.service'
import { CacheService } from '../cache/cache.service'
import { ApiProxyDto } from './dto/api-proxy.dto'

const droppedResponseHeaders = [
  'access-control-allow-origin',
  'content-encoding',
]

// maxFreeSockets tracks maxSockets so the idle pool isn't capped at agentkeepalive's default 256.
const buildAgentOptions = (maxSockets: number): AgentKeepAlive.HttpOptions => ({
  keepAlive: true,
  timeout: 0,
  freeSocketTimeout: AGENT_DEFAULT_FREE_SOCKET_TIMEOUT,
  maxSockets,
  maxFreeSockets: maxSockets,
})

@Injectable()
export class ProxyService {
  private readonly customAgent: AgentKeepAlive
  /**
   * Separate HTTPS agent: node-fetch reuses the HTTP agent on HTTPS redirects,
   * causing ERR_INVALID_PROTOCOL. See node-fetch#571.
   */
  private readonly customHttpsAgent: HttpsAgent

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,

    private readonly cacheService: CacheService,
    private readonly cryptoService: CryptoService,
    private readonly tokenRefreshService: TokenRefreshService,
    private readonly errorService: ErrorService,
    private readonly sessionCookieService: SessionCookieService,
  ) {
    const agentOptions = buildAgentOptions(this.config.proxyMaxSockets)
    this.customAgent = new AgentKeepAlive(agentOptions)
    this.customHttpsAgent = new HttpsAgent(agentOptions)
  }

  /**
   * This method gets access token from the cache by session ID(sid).
   * - If the token is expired, it will attempt to update tokens with the refresh token from cache.
   * - Then access token is decrypted and returned.
   */
  private async getAccessToken({
    req,
    res,
  }: {
    req: Request
    res: Response
  }): Promise<string> {
    const sid = this.sessionCookieService.get(req)

    if (!sid) {
      throw new UnauthorizedException()
    }

    const tokenResponseKey = this.cacheService.createSessionKeyType(
      'current',
      sid,
    )

    try {
      let cachedTokenResponse: CachedTokenResponse | null =
        await this.cacheService.get<CachedTokenResponse>(
          tokenResponseKey,
          false,
        )

      if (
        cachedTokenResponse &&
        hasTimestampExpiredInMS(cachedTokenResponse.accessTokenExp)
      ) {
        cachedTokenResponse = await this.tokenRefreshService.refreshToken({
          cacheKey: sid,
          encryptedRefreshToken: cachedTokenResponse.encryptedRefreshToken,
        })
      }

      if (!cachedTokenResponse) {
        throw new UnauthorizedException()
      }

      return this.cryptoService.decrypt(
        cachedTokenResponse.encryptedAccessToken,
      )
    } catch (error) {
      return this.errorService.handleAuthorizedError({
        error,
        res,
        tokenResponseKey,
        operation: `${ProxyService.name}.getAccessToken`,
      })
    }
  }

  /**
   * This method proxies the request to the target URL and streams the response back to the client.
   */
  public async executeStreamRequest({
    targetUrl,
    accessToken,
    req,
    res,
    body,
  }: {
    targetUrl: string
    accessToken: string
    req: Request
    res: Response
    body?: Record<string, unknown>
  }) {
    try {
      const reqHeaderContentType = req.headers['content-type']
      const finalBody = body ?? req.body

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': reqHeaderContentType || 'application/json',
          Authorization: `Bearer ${accessToken}`,
          ...(req.headers['user-agent'] && {
            'user-agent': req.headers['user-agent'],
          }),
          ...((req.headers['x-forwarded-for'] ?? req.ip) && {
            'x-forwarded-for': String(req.headers['x-forwarded-for'] ?? req.ip),
          }),
        },
        body: finalBody ? JSON.stringify(finalBody) : undefined,
        agent: (parsedUrl) => {
          if (parsedUrl.protocol == 'http:') {
            return this.customAgent
          }

          return this.customHttpsAgent
        },
      })

      // Set the status code of the response
      res.status(response.status)

      response.headers.forEach((value, key) => {
        // Only set headers that are not in the droppedResponseHeaders array
        if (!droppedResponseHeaders.includes(key.toLowerCase())) {
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
          res.end()
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

      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to proxy request')
    }
  }

  /**
   * Proxies an incoming HTTP POST request to a target GraphQL API, handling authentication, token refresh,
   * and response streaming.
   */
  public async proxyGraphQLRequest({
    req,
    res,
  }: {
    req: Request
    res: Response
  }): Promise<void> {
    const accessToken = await this.getAccessToken({ req, res })
    const queryString = req.url.split('?')[1]
    const targetUrl = `${this.config.graphqlApiEndpoint}${
      queryString ? `?${queryString}` : ''
    }`

    this.executeStreamRequest({
      accessToken,
      targetUrl,
      req,
      res,
    })
  }

  /**
   * Prepares the request for proxying to an external API by validating the URL and getting the access token.
   */
  private prepareApiProxyRequest({
    req,
    res,
    url,
  }: {
    req: Request
    res: Response
    url: string
  }): Promise<string> {
    if (!validateUri(url, this.config.allowedExternalApiUrls)) {
      this.logger.error('Invalid external api url provided:', url)

      throw new BadRequestException('Proxing url failed!')
    }

    return this.getAccessToken({ req, res })
  }

  /**
   * Forwards an incoming HTTP GET request to the specified URL (provided in the query string),
   * managing authentication, refreshing tokens if needed, and streaming the response back to the client.
   */
  public async forwardGetApiRequest({
    req,
    res,
    query,
  }: {
    req: Request
    res: Response
    query: ApiProxyDto
  }): Promise<void> {
    const { url } = query
    const accessToken = await this.prepareApiProxyRequest({ req, res, url })

    this.executeStreamRequest({
      accessToken,
      targetUrl: url,
      req,
      res,
    })
  }

  /**
   * Forwards an incoming HTTP POST request to the specified URL (provided in the query string),
   * managing authentication, refreshing tokens if needed, and streaming the response back to the client.
   */
  async forwardPostApiRequest({
    req,
    res,
    query,
    body,
  }: {
    req: Request
    res: Response
    query: ApiProxyDto
    body: Record<string, unknown>
  }) {
    const { url } = query
    const accessToken = await this.prepareApiProxyRequest({ req, res, url })

    this.executeStreamRequest({
      accessToken,
      targetUrl: url,
      req,
      res,
      body,
    })
  }
}
