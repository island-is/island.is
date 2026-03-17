import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { WebSitemapConfig } from './web-sitemap.config'
import { WebSitemapRepository } from '../repositories/web-sitemap/web-sitemap.repository'
import { generateSitemapUrlString } from './utils'

@Injectable()
export class WebSitemapService {
  constructor(
    @Inject(WebSitemapConfig.KEY)
    private readonly config: ConfigType<typeof WebSitemapConfig>,
    private readonly s3Service: S3Service,
    private readonly webSitemapRepository: WebSitemapRepository,
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

    const sitemapFiles: { fileUrl: string }[] = []

    let response: Awaited<
      ReturnType<typeof this.webSitemapRepository.getSitemapUrls>
    > | null = null
    do {
      response = await this.webSitemapRepository.getSitemapUrls(
        response?.nextFetcherIndex ?? 0,
        response?.nextPageIndex ?? 0,
      )
      if (response.urls.length === 0) break
      const fileName = `sitemap-${sitemapFiles.length + 1}.xml`
      await this.uploadXmlFile(
        `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
          ${response.urls.map(generateSitemapUrlString).join('')}
        </urlset>`,
        fileName,
      )
      this.logger.info(`${fileName} uploaded`)
      sitemapFiles.push({
        fileUrl: `https://island.is/sitemap/${fileName}`,
      })
    } while (response.nextFetcherIndex >= 0)

    const timestamp = new Date().toISOString()

    await this.uploadXmlFile(
      `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapFiles
          .map(
            ({ fileUrl }) =>
              `<sitemap><loc>${fileUrl}</loc><lastmod>${timestamp}</lastmod></sitemap>`,
          )
          .join('')}
      </sitemapindex>`,
      'sitemap.xml',
    )

    this.logger.info('Web sitemap worker finished.')
  }
}
