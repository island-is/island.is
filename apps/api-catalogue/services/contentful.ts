import { ContentfulClientApi, createClient } from 'contentful'
import { Page, ContentfulString } from './contentful.types'

class ContentfulApi {
  client: ContentfulClientApi

  constructor() {
    this.client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    })
  }

  /* PUBLIC FUNCTIONS */
  public async fetchPageBySlug(slug, locale): Promise<Page> {
    return await this.client
      .getEntries({
        content_type: 'page',
        locale: locale,
        'fields.pageId': slug,
      })
      .then((entries) => {
        return this.convertPage(entries.items[0])
      })
  }

  /* HELPER FUNCTIONS */
  private convertPage = (rawData): Page => {
    const rawPage = rawData.fields

    return {
      id: rawPage.pageId,
      strings: rawPage.pageStrings.map((st) => this.convertString(st)),
    }
  }

  private convertString = (rawData): ContentfulString => {
    const rawString = rawData.fields

    return {
      id: rawString.customId,
      text: rawString.text,
    }
  }
}

export default ContentfulApi
