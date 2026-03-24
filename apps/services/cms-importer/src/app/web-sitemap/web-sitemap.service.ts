import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { WebSitemapConfig } from './web-sitemap.config'
import {
  generateSitemapUrlString,
  SitemapUrl,
  type SitemapUrlFetcher,
} from './utils'
import { FrontpageRepository } from '../repositories/web-sitemap/content-types/frontpage.repository'
import { ArticleRepository } from '../repositories/web-sitemap/content-types/article.repository'
import { OrganizationPageRepository } from '../repositories/web-sitemap/content-types/organization-page.repository'
import { OrganizationSubpageRepository } from '../repositories/web-sitemap/content-types/organization-subpage.repository'
import { OrganizationParentSubpageRepository } from '../repositories/web-sitemap/content-types/organization-parent-subpage.repository'
import { ProjectPageRepository } from '../repositories/web-sitemap/content-types/project-page.repository'
import { ManualRepository } from '../repositories/web-sitemap/content-types/manual.repository'
import { ArticleCategoryRepository } from '../repositories/web-sitemap/content-types/article-category.repository'
import { LifeEventRepository } from '../repositories/web-sitemap/content-types/life-event.repository'
import { FrontpageNewsRepository } from '../repositories/web-sitemap/content-types/frontpage-news.repository'
import { OrganizationNewsRepository } from '../repositories/web-sitemap/content-types/organization-news.repository'
import { ProjectNewsRepository } from '../repositories/web-sitemap/content-types/project-news.repository'
import { ServiceWebRepository } from '../repositories/web-sitemap/content-types/service-web.repository'

@Injectable()
export class WebSitemapService {
  private readonly fetchers: SitemapUrlFetcher[]

  constructor(
    @Inject(WebSitemapConfig.KEY)
    private readonly config: ConfigType<typeof WebSitemapConfig>,
    private readonly s3Service: S3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    // Fetchers
    private readonly frontpageRepository: FrontpageRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly organizationPageRepository: OrganizationPageRepository,
    private readonly organizationSubpageRepository: OrganizationSubpageRepository,
    private readonly organizationParentSubpageRepository: OrganizationParentSubpageRepository,
    private readonly projectPageRepository: ProjectPageRepository,
    private readonly manualRepository: ManualRepository,
    private readonly articleCategoryRepository: ArticleCategoryRepository,
    private readonly lifeEventRepository: LifeEventRepository,
    private readonly frontpageNewsRepository: FrontpageNewsRepository,
    private readonly organizationNewsRepository: OrganizationNewsRepository,
    private readonly projectNewsRepository: ProjectNewsRepository,
    private readonly serviceWebRepository: ServiceWebRepository,
  ) {
    this.fetchers = [
      this.frontpageRepository,
      this.articleRepository,
      this.organizationPageRepository,
      this.organizationSubpageRepository,
      this.organizationParentSubpageRepository,
      this.projectPageRepository,
      this.manualRepository,
      this.articleCategoryRepository,
      this.lifeEventRepository,
      this.frontpageNewsRepository,
      this.organizationNewsRepository,
      this.projectNewsRepository,
      this.serviceWebRepository,
    ]
  }

  private async uploadXmlFile(fileContent: string, fileName: string) {
    return this.s3Service.uploadFile(
      Buffer.from(fileContent),
      { bucket: this.config.s3Bucket, key: fileName },
      {
        ContentType: 'application/xml',
      },
    )
  }

  public async run() {
    this.logger.info('Web sitemap worker starting...')

    const itemsPerPage = 100
    const maxUrlsPerFile = 2000

    const s3FileUrls: string[] = []
    const urls: SitemapUrl[] = []

    const flushSitemapUrlsToFile = async () => {
      const fileName = `${s3FileUrls.length + 1}.xml`
      await this.uploadXmlFile(
        `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
          ${urls.map(generateSitemapUrlString).join('')}
        </urlset>`,
        fileName,
      )
      this.logger.info(`${fileName} uploaded`)
      s3FileUrls.push(`https://island.is/sitemap/${fileName}`)
      urls.length = 0
    }

    for (const fetcher of this.fetchers) {
      let pageIndex = 0
      while (pageIndex >= 0) {
        const response = await fetcher.getSitemapUrls(itemsPerPage, pageIndex)
        pageIndex = response.nextPageIndex
        urls.push(...response.urls)
        if (urls.length >= maxUrlsPerFile) await flushSitemapUrlsToFile()
      }
    }

    if (urls.length > 0) await flushSitemapUrlsToFile()

    const timestamp = new Date().toISOString()

    await this.uploadXmlFile(
      `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${s3FileUrls
          .map(
            (fileUrl) =>
              `<sitemap><loc>${fileUrl}</loc><lastmod>${timestamp}</lastmod></sitemap>`,
          )
          .join('')}
      </sitemapindex>`,
      'sitemap.xml',
    )

    this.logger.info('Web sitemap worker finished.')
  }
}
