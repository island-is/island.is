import { bootstrap, processJob } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
import { SitemapGeneratorService } from './app/modules/sitemap-generator/sitemap-generator.service'

const job = processJob()

if (job === 'worker') {
  bootstrap({
    appModule: AppModule,
    name: 'services-sitemap-generator',
  }).then(async ({ app }) => {
    const sitemapGeneratorService = await app.resolve(SitemapGeneratorService)
    await sitemapGeneratorService.generateAndUploadSitemap()
    process.exit(0)
  })
} else {
  bootstrap({
    appModule: AppModule,
    name: 'services-sitemap-generator',
  })
}
