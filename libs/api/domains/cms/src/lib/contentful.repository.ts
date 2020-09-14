import { Injectable } from '@nestjs/common'
import { createClient, EntryCollection, ContentfulClientApi } from 'contentful'
import { logger } from '@island.is/logging'

const space = '2nfa4y6hpvvz'
const accessToken = 'YGVeSb9CHYwJXrknZL2Xd1RqGcpBZSbn5L7lO8LxDI4'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContentfulQuery = any

const validLocales = ['is-IS', 'en']
const localeMap = {
  is: 'is-IS',
  en: 'en',
}

type Result<T> = Promise<EntryCollection<T>>

@Injectable()
export class ContentfulRepository {
  private client: ContentfulClientApi

  constructor() {
    logger.debug('Created Contentful repository')
  }

  getClient(): ContentfulClientApi {
    if (!space || !accessToken) {
      throw new Error('Missing Contentful environment variables')
    }

    if (this.client) {
      return this.client
    }

    return createClient({
      space,
      accessToken,
      environment: 'master',
      host: 'cdn.contentful.com' || 'preview.contentful.com',
    })
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
  ): Result<Fields> {
    let code = languageCode ?? 'is-IS'
    if (localeMap[code]) {
      code = localeMap[code]
    }

    return this.getClient().getEntries({
      locale: validLocales.includes(code) ? code : 'is-IS',
      include: 4,
      ...query,
    })
  }
}
