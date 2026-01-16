import { Injectable } from '@nestjs/common'
import { Inject, LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { ContentfulRepository } from '@island.is/cms'
import { S3Service } from '@island.is/nest/aws'
import { environment } from '../../../environments/environment'
import * as types from '@island.is/cms/lib/generated/contentfulTypes'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

@Injectable()
export class SitemapGeneratorService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly contentfulRepository: ContentfulRepository,
    private readonly s3Service: S3Service,
  ) {}

  async generateAndUploadSitemap(): Promise<void> {
    this.logger.info('Starting sitemap generation')

    try {
      const urls: SitemapUrl[] = []

      // Fetch all content types that should be in the sitemap
      const [articles, news, organizationPages, anchorPages, lifeEventPages] =
        await Promise.all([
          this.fetchAllArticles(),
          this.fetchAllNews(),
          this.fetchAllOrganizationPages(),
          this.fetchAllAnchorPages(),
          this.fetchAllLifeEventPages(),
        ])

      // Generate URLs for articles
      for (const article of articles) {
        const slugIs = this.getLocalizedField(article.fields.slug, 'is-IS')
        const slugEn = this.getLocalizedField(article.fields.slug, 'en')
        
        if (slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/${slugIs}`,
            lastmod: article.sys.updatedAt,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }
        // Add English version if exists and different
        if (slugEn && slugEn !== slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/en/${slugEn}`,
            lastmod: article.sys.updatedAt,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }
      }

      // Generate URLs for news
      for (const newsItem of news) {
        const slugIs = this.getLocalizedField(newsItem.fields.slug, 'is-IS')
        const slugEn = this.getLocalizedField(newsItem.fields.slug, 'en')
        
        if (slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/frett/${slugIs}`,
            lastmod: newsItem.sys.updatedAt,
            changefreq: 'daily',
            priority: '0.7',
          })
        }
        // Add English version if exists and different
        if (slugEn && slugEn !== slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/en/news/${slugEn}`,
            lastmod: newsItem.sys.updatedAt,
            changefreq: 'daily',
            priority: '0.7',
          })
        }
      }

      // Generate URLs for organization pages
      for (const orgPage of organizationPages) {
        const slugIs = this.getLocalizedField(orgPage.fields.slug, 'is-IS')
        const slugEn = this.getLocalizedField(orgPage.fields.slug, 'en')
        
        if (slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/s/${slugIs}`,
            lastmod: orgPage.sys.updatedAt,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }
        // Add English version if exists and different
        if (slugEn && slugEn !== slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/en/o/${slugEn}`,
            lastmod: orgPage.sys.updatedAt,
            changefreq: 'weekly',
            priority: '0.8',
          })
        }
      }

      // Generate URLs for anchor pages
      for (const anchorPage of anchorPages) {
        const slugIs = this.getLocalizedField(anchorPage.fields.slug, 'is-IS')
        const pageTypeIs = this.getLocalizedField(anchorPage.fields.pageType, 'is-IS')
        
        if (slugIs) {
          let path = ''
          if (pageTypeIs === 'Landing page') {
            path = `/stafraent-island/${slugIs}`
          } else if (pageTypeIs === 'Article') {
            path = `/${slugIs}`
          } else {
            path = `/stafraent-island/${slugIs}`
          }
          urls.push({
            loc: `${environment.sitemapBaseUrl}${path}`,
            lastmod: anchorPage.sys.updatedAt,
            changefreq: 'weekly',
            priority: '0.7',
          })
        }
      }

      // Generate URLs for life event pages
      for (const lifeEventPage of lifeEventPages) {
        const slugIs = this.getLocalizedField(lifeEventPage.fields.slug, 'is-IS')
        const slugEn = this.getLocalizedField(lifeEventPage.fields.slug, 'en')
        
        if (slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/${slugIs}`,
            lastmod: lifeEventPage.sys.updatedAt,
            changefreq: 'monthly',
            priority: '0.6',
          })
        }
        // Add English version if exists and different
        if (slugEn && slugEn !== slugIs) {
          urls.push({
            loc: `${environment.sitemapBaseUrl}/en/${slugEn}`,
            lastmod: lifeEventPage.sys.updatedAt,
            changefreq: 'monthly',
            priority: '0.6',
          })
        }
      }

      // Generate sitemap XML
      const sitemapXml = this.generateSitemapXml(urls)

      // Upload to S3
      const s3Key = 'sitemap.xml'
      await this.s3Service.uploadFile(
        Buffer.from(sitemapXml, 'utf-8'),
        {
          bucket: environment.s3Bucket,
          key: s3Key,
        },
        {
          ContentType: 'application/xml',
        },
      )

      this.logger.info(
        `Successfully generated and uploaded sitemap with ${urls.length} URLs to s3://${environment.s3Bucket}/${s3Key}`,
      )
    } catch (error) {
      this.logger.error('Error generating sitemap', error)
      throw error
    }
  }

  private async fetchAllArticles(): Promise<types.IArticle[]> {
    const allArticles: types.IArticle[] = []
    let skip = 0
    const limit = 1000

    while (true) {
      const result = await this.contentfulRepository.getClient().getEntries<
        types.IArticleFields
      >({
        content_type: 'article',
        limit,
        skip,
        locale: '*',
        'fields.slug[exists]': true,
      })

      allArticles.push(...(result.items as types.IArticle[]))

      if (result.items.length < limit) {
        break
      }
      skip += limit
    }

    return allArticles
  }

  private async fetchAllNews(): Promise<types.INews[]> {
    const allNews: types.INews[] = []
    let skip = 0
    const limit = 1000

    while (true) {
      const result = await this.contentfulRepository.getClient().getEntries<
        types.INewsFields
      >({
        content_type: 'news',
        limit,
        skip,
        locale: '*',
        'fields.slug[exists]': true,
      })

      allNews.push(...(result.items as types.INews[]))

      if (result.items.length < limit) {
        break
      }
      skip += limit
    }

    return allNews
  }

  private async fetchAllOrganizationPages(): Promise<
    types.IOrganizationPage[]
  > {
    const allPages: types.IOrganizationPage[] = []
    let skip = 0
    const limit = 1000

    while (true) {
      const result = await this.contentfulRepository.getClient().getEntries<
        types.IOrganizationPageFields
      >({
        content_type: 'organizationPage',
        limit,
        skip,
        locale: '*',
        'fields.slug[exists]': true,
      })

      allPages.push(...(result.items as types.IOrganizationPage[]))

      if (result.items.length < limit) {
        break
      }
      skip += limit
    }

    return allPages
  }

  private async fetchAllAnchorPages(): Promise<types.IAnchorPage[]> {
    const allPages: types.IAnchorPage[] = []
    let skip = 0
    const limit = 1000

    while (true) {
      const result = await this.contentfulRepository.getClient().getEntries<
        types.IAnchorPageFields
      >({
        content_type: 'anchorPage',
        limit,
        skip,
        locale: '*',
        'fields.slug[exists]': true,
      })

      allPages.push(...(result.items as types.IAnchorPage[]))

      if (result.items.length < limit) {
        break
      }
      skip += limit
    }

    return allPages
  }

  private async fetchAllLifeEventPages(): Promise<types.ILifeEventPage[]> {
    const allPages: types.ILifeEventPage[] = []
    let skip = 0
    const limit = 1000

    while (true) {
      const result = await this.contentfulRepository.getClient().getEntries<
        types.ILifeEventPageFields
      >({
        content_type: 'lifeEventPage',
        limit,
        skip,
        locale: '*',
        'fields.slug[exists]': true,
      })

      allPages.push(...(result.items as types.ILifeEventPage[]))

      if (result.items.length < limit) {
        break
      }
      skip += limit
    }

    return allPages
  }

  private generateSitemapXml(urls: SitemapUrl[]): string {
    const urlElements = urls
      .map((url) => {
        const lastmod = url.lastmod
          ? `<lastmod>${new Date(url.lastmod).toISOString()}</lastmod>`
          : ''
        const changefreq = url.changefreq
          ? `<changefreq>${url.changefreq}</changefreq>`
          : ''
        const priority = url.priority ? `<priority>${url.priority}</priority>` : ''

        return `  <url>
    <loc>${this.escapeXml(url.loc)}</loc>${lastmod ? `\n    ${lastmod}` : ''}${changefreq ? `\n    ${changefreq}` : ''}${priority ? `\n    ${priority}` : ''}
  </url>`
      })
      .join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  private getLocalizedField(
    field: string | Record<string, string> | undefined,
    locale: string,
  ): string | undefined {
    if (!field) {
      return undefined
    }
    if (typeof field === 'string') {
      return field
    }
    return field[locale] || field['is-IS'] || field['en']
  }
}
