import { Module } from '@nestjs/common'
import { SitemapGeneratorService } from './sitemap-generator.service'

@Module({
  providers: [SitemapGeneratorService],
  exports: [SitemapGeneratorService],
})
export class SitemapGeneratorModule {}
