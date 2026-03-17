import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { WebSitemapConfig } from './web-sitemap.config'
import { ManagementClientService } from '../repositories/cms/managementClient/managementClient.service'
import { generateSitemapUrlString, type SitemapUrl } from './utils'

@Injectable()
export class WebSitemapService {
  constructor(
    @Inject(WebSitemapConfig.KEY)
    private readonly config: ConfigType<typeof WebSitemapConfig>,
    private readonly s3Service: S3Service,
    private readonly managementClient: ManagementClientService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  private async uploadXmlFile(fileContent: string, fileName: string) {
    if (process.env.NODE_ENV === 'development') {
      // TODO: Remove this when we're done testing
      const fs = await import('fs')
      fs.default.writeFileSync(fileName, fileContent)
      return fileName
    }

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

    const frontpageResponse = await this.managementClient.getEntries({
      content_type: 'frontpage',
      limit: 1,
      select: 'sys',
    })

    const urls: SitemapUrl[] = []

    if (frontpageResponse.ok) {
      const frontpageEntry = frontpageResponse.data.items[0]
      const lastModified = frontpageEntry.sys.publishedAt
      urls.push({
        loc: { is: 'https://island.is', en: 'https://island.is/en' },
        lastmod: lastModified,
      })
    }

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${urls.map(generateSitemapUrlString).join('')}
    </urlset>`

    const url = await this.uploadXmlFile(sitemapContent, 'sitemap.xml')
    this.logger.info(`Web sitemap uploaded to: ${url}`)

    this.logger.info('Web sitemap worker finished.')
  }
}
