import { ContentfulClientApi, createClient } from 'contentful';
import { Page, ContentfulString } from './contentful.types'

class ContentfulApi {
  client: ContentfulClientApi;

  constructor() {
    this.client = createClient({
      space: "jtzqkuaxipis",
      accessToken: "N6X1O7qgBQ_FqxQx0O-keh3tJDrEhV8myczR3w-ZbS0"
    });
  }

  /* PUBLIC FUNCTIONS */
  public async fetchPageBySlug(slug, locale): Promise<Page> {
    return await this.client.getEntries({
      content_type: 'page',
      locale: locale,
      'fields.pageId': slug
    })
    .then(entries => {
      return this.convertPage(entries.items[0]);
    });
  }
  
  /* HELPER FUNCTIONS */
  private convertPage = (rawData): Page => {
    const rawPage = rawData.fields;

    return {
      id: rawPage.pageId,
      strings: rawPage.pageStrings.map(st => this.convertString(st))
    }
  }

  private convertString = (rawData): ContentfulString => {
    const rawString = rawData.fields;

    return {
      id: rawString.customId,
      text: rawString.text
    }
  }
}

export default ContentfulApi;