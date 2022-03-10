import { Injectable } from '@nestjs/common'
import { createClient, EntryCollection, ContentfulClientApi } from 'contentful'
import { logger } from '@island.is/logging'

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

    if (this.client) {
      return this.client
    }

    return createClient({
      space,
      accessToken,
      environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
      host: process.env.CONTENTFUL_HOST || 'preview.contentful.com',
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
