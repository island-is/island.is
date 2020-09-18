import { ContentfulClientApi, createClient } from 'contentful';
import { Button, StaticPage } from './contentful.types'

class ContentfulApi {
  client: ContentfulClientApi;

  constructor() {
    this.client = createClient({
      space: "jtzqkuaxipis",
      accessToken: "N6X1O7qgBQ_FqxQx0O-keh3tJDrEhV8myczR3w-ZbS0"
    });
  }

  /* PUBLIC FUNCTIONS */
  public async fetchStaticPageBySlug(slug, locale): Promise<StaticPage> {
    return await this.client.getEntries({
      content_type: 'staticPage',
      locale: locale,
      'fields.slug': slug
    })
    .then(entries => {
      return this.convertPage(entries.items[0]);
    });
  }
  
  /* HELPER FUNCTIONS */
  private convertPage = (rawData): StaticPage => {
    const rawPage = rawData.fields;

    return {
      id: rawData.sys.id,
      title: rawPage.title,
      slug: rawPage.slug,
      introText: ('introText' in rawPage) ? rawPage.introText : null,
      body: ('body' in rawPage) ? rawPage.body : null,
      buttons: ('buttons' in rawPage) ? rawPage.buttons.map(button => this.convertButton(button)) : null
    }
  }

  private convertButton = (rawData): Button => {
    const rawButton = rawData.fields;

    return {
      id: rawButton.id,
      label: rawButton.label,
      linkUrl: rawButton.linkUrl
    }
  }
}

export default ContentfulApi;