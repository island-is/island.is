import { logger } from '@island.is/logging'
import { NestFactory } from '@nestjs/core'
import { WebSitemapModule } from './web-sitemap.module'
import { WebSitemapService } from './web-sitemap.service'

export const webSitemapWorker = async () => {
    try {
        logger.info('Web sitemap worker job initiating...')
        const app = await NestFactory.createApplicationContext(WebSitemapModule)
        app.enableShutdownHooks()
        await app.get(WebSitemapService).run()
        await app.close()
        logger.info('Web sitemap worker finished successfully.')
        process.exit(0)
    } catch (error) {
        logger.error('Web sitemap worker encountered an error:', error)
        process.exit(1)
    }
}