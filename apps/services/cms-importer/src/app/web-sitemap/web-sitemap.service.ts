import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { WebSitemapConfig } from './web-sitemap.config'

@Injectable()
export class WebSitemapService {
  constructor(
    @Inject(WebSitemapConfig.KEY)
    private readonly config: ConfigType<typeof WebSitemapConfig>,
    private readonly s3Service: S3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) { }

  public async run() {
    this.logger.info('Web sitemap worker starting...')

    const sitemapContent = Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://island.is</loc>
        <lastmod>2024-01-01</lastmod>
      </url>
    </urlset>`)

    const url = await this.s3Service.uploadFile(
      sitemapContent,
      { bucket: this.config.s3Bucket, key: 'sitemap.xml' },
      {
        ContentType: 'application/xml',
        ACL: 'public-read',
      },
    )
    this.logger.info(`Web sitemap uploaded to: ${url}`)

    this.logger.info('Web sitemap worker finished.')
  }
}
