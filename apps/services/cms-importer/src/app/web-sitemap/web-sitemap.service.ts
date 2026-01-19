import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

@Injectable()
export class WebSitemapService {
    constructor(/* inject your dependencies */) { }

    public async run() {
        logger.info('Web sitemap worker starting...')
        // Your import logic here
        logger.info('Web sitemap worker finished.')
    }
}