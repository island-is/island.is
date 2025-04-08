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

  async getLocales() {
    const locales = await this.getClient().getLocales()
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

    return this.getClient().getEntries({
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

    return this.getClient().getEntry(id, {
      locale: validLocales.includes(code) ? code : 'is-IS',
      ...query,
    })
  }
}
