import { Injectable } from '@nestjs/common'
import {
  createClient,
  EntryCollection,
  Entry,
  ContentfulClientApi,
  ClientLogLevel,
} from 'contentful'
import Agent, { HttpsAgent } from 'agentkeepalive'
import { logger } from '@island.is/logging'
import { AGENT_DEFAULTS } from '@island.is/shared/constants'

const space = '8k0h54kbe6bj'
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentfulQuery = any

const validLocales = ['is-IS', 'en', '*']
export const localeMap: { [key: string]: string } = {
  is: 'is-IS',
  en: 'en',
}

type Result<T> = Promise<EntryCollection<T>>

const MAX_RETRIES = 3
const DEFAULT_LIMIT = 100

// The SDK throws errors whose message is a JSON string containing the response status and message
const parseErrorData = (
  error: unknown,
): { status?: number; message?: string } | null => {
  if (!(error instanceof Error)) return null
  try {
    return JSON.parse(error.message)
  } catch {
    return null
  }
}

const isResponseTooBig = (error: unknown) =>
  Boolean(parseErrorData(error)?.message?.includes('Response size too big'))

const isRetryable = (error: unknown) => {
  const status = parseErrorData(error)?.status
  if (status) {
    return status === 429 || status >= 500
  }
  // Errors without a response are connection errors (timeouts are not retried)
  const code = (error as { code?: string })?.code
  return Boolean(code) && code !== 'ECONNABORTED'
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

@Injectable()
export class ContentfulRepository {
  private client!: ContentfulClientApi

  constructor() {
    logger.debug('Created Contentful repository')
  }

  getClient(): ContentfulClientApi {
    if (!accessToken) {
      throw new Error(
        'Missing Contentful environment variables: CONTENTFUL_ACCESS_TOKEN',
      )
    }

    if (!this.client) {
      this.client = createClient({
        space,
        accessToken,
        httpAgent: new Agent(AGENT_DEFAULTS),
        httpsAgent: new HttpsAgent(AGENT_DEFAULTS),
        environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
        host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
        removeUnresolved: true,
        // The SDK's built-in retry ignores retryLimit with our axios version and retries forever,
        // so we handle retries ourselves in withRetry
        retryOnError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logHandler(level: ClientLogLevel, data: any) {
          switch (level) {
            case 'error':
              logger.error(`Contentful API: ${level} - ${data}`)
              break
            case 'warning':
              logger.warn(`Contentful API: ${level} - ${data}`)
              break
            case 'info':
            default:
              logger.info(`Contentful API: ${level} - ${data}`)
          }
        },
      })
    }

    return this.client
  }

  private async withRetry<T>(
    request: () => Promise<T>,
    attempt = 0,
  ): Promise<T> {
    try {
      return await request()
    } catch (error) {
      if (attempt >= MAX_RETRIES || !isRetryable(error)) {
        throw error
      }
      const wait = 2 ** attempt * 500 + Math.random() * 500
      logger.warn(
        `Contentful request failed (${
          parseErrorData(error)?.status ?? (error as { code?: string })?.code
        }), retrying in ${Math.round(wait)} ms (attempt ${
          attempt + 1
        } of ${MAX_RETRIES})`,
      )
      await delay(wait)
      return this.withRetry(request, attempt + 1)
    }
  }

  // Contentful rejects responses larger than 7MB, so if that happens we split the request into smaller chunks
  private async getEntries<Fields>(query: ContentfulQuery): Result<Fields> {
    try {
      return await this.withRetry(() =>
        this.getClient().getEntries<Fields>(query),
      )
    } catch (error) {
      const limit: number = query.limit ?? DEFAULT_LIMIT
      if (!isResponseTooBig(error) || limit <= 1) {
        throw error
      }

      const skip: number = query.skip ?? 0
      const chunkSize = Math.ceil(limit / 2)
      logger.warn(
        `Contentful response too big for limit ${limit}, splitting into chunks of ${chunkSize}`,
      )

      const first = await this.getEntries<Fields>({
        ...query,
        skip,
        limit: chunkSize,
      })
      const items = [...first.items]

      if (first.total > skip + chunkSize) {
        const second = await this.getEntries<Fields>({
          ...query,
          skip: skip + chunkSize,
          limit: limit - chunkSize,
        })
        items.push(...second.items)
      }

      return { ...first, items, skip, limit }
    }
  }

  async getLocales() {
    const locales = await this.withRetry(() => this.getClient().getLocales())
    return locales.items.map(({ code, name, fallbackCode }) => ({
      code,
      name,
      fallbackCode,
    }))
  }

  async getLocalizedEntries<Fields>(
    languageCode: undefined | null | string,
    query: ContentfulQuery,
    include = 4,
  ): Result<Fields> {
    let code = languageCode ?? 'is-IS'

    if (localeMap[code]) {
      code = localeMap[code]
    }

    return this.getEntries<Fields>({
      locale: validLocales.includes(code) ? code : 'is-IS',
      include,
      ...query,
    })
  }

  async getLocalizedEntry<Fields>(
    id: string,
    languageCode: undefined | null | string,
    query: ContentfulQuery,
  ): Promise<Entry<Fields>> {
    let code = languageCode ?? 'is-IS'

    if (localeMap[code]) {
      code = localeMap[code]
    }

    return this.withRetry(() =>
      this.getClient().getEntry<Fields>(id, {
        locale: validLocales.includes(code) ? code : 'is-IS',
        ...query,
      }),
    )
  }
}
