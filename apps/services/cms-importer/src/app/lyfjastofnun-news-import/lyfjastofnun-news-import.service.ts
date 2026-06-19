import { Injectable } from '@nestjs/common'
import fs from 'fs'
import path from 'path'
import { logger } from '@island.is/logging'
import { CmsRepository } from '../repositories/cms/cms.repository'
import { LyfjastofnunWordpressRepository } from '../repositories/lyfjastofnun-wordpress/wordpress.repository'
import { WpPost } from '../repositories/lyfjastofnun-wordpress/wordpress.types'
import { buildNewsEntry } from './mapper'
import { LOCALE } from '../constants'
import { makeTagMetadata } from '../repositories/cms/mapper'
import { EntryCreationDto } from '../repositories/cms/cms.types'
import { cleanImageTitle, guessImageContentType } from '../utils'
import {
  extractFirstImageUrl,
  extractIntro,
} from '../repositories/lyfjastofnun-wordpress/wordpress.utils'
import {
  IMAGE_BANK_DIR,
  IMPORT_LIMIT,
  LYFJASTOFNUN_OWNER_TAG,
  LYFJASTOFNUN_ORG_ID,
  NEWS_CONTENT_TYPE,
} from './constants'

@Injectable()
export class LyfjastofnunNewsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly wordpressRepository: LyfjastofnunWordpressRepository,
  ) {}

  async run({
    publish = false,
    slug,
  }: { publish?: boolean; slug?: string } = {}): Promise<void> {
    logger.info('Lyfjastofnun news import starting...', { publish, slug })

    const existingSlugs = await this.getExistingSlugs()
    logger.info('Fetched existing news slugs', { count: existingSlugs.size })

    const posts = await this.wordpressRepository.getPosts()
    const filtered = slug ? posts.filter((p) => p.slug === slug) : posts
    const limited = filtered.slice(0, slug ? filtered.length : IMPORT_LIMIT)
    logger.info('Processing posts', {
      total: posts.length,
      limit: IMPORT_LIMIT,
    })

    let skipped = 0
    const dtos: EntryCreationDto[] = []

    for (const post of limited) {
      const slug = post.slug

      if (existingSlugs.has(slug)) {
        logger.info('Skipping post, slug already exists in Contentful', {
          slug,
        })
        skipped++
        continue
      }

      if (!extractIntro(post)) {
        logger.warn('Skipping post, no intro or content available', { slug })
        skipped++
        continue
      }

      const assetId = await this.uploadImage(post, publish)
      if (!assetId) {
        logger.warn('Skipping post, could not upload image', { slug })
        skipped++
        continue
      }

      const summary = await this.wordpressRepository.scrapePostSummary(
        post.link,
      )
      if (summary) logger.info('Scraped post summary', { slug })

      dtos.push(buildNewsEntry(post, assetId, summary))
    }

    const results = await this.cmsRepository.createEntries(
      dtos,
      NEWS_CONTENT_TYPE,
      publish,
    )
    const created = results.filter((r) => r.status === 'success').length
    const failed = results.filter((r) => r.status === 'error').length

    if (failed > 0) logger.warn('Some entries failed to create', { failed })
    logger.info('Lyfjastofnun news import finished', {
      created,
      skipped,
      failed,
    })
  }

  private async getExistingSlugs(): Promise<Set<string>> {
    const entries = await this.cmsRepository.getContentByTypeAndLinkedEntry(
      NEWS_CONTENT_TYPE,
      LYFJASTOFNUN_ORG_ID,
    )
    const slugs = new Set<string>()

    for (const entry of entries) {
      const slug = entry.fields['slug']?.[LOCALE]
      if (slug) slugs.add(slug)
    }

    return slugs
  }

  private async uploadImage(
    post: WpPost,
    publish: boolean,
  ): Promise<string | null> {
    const inlineUrl = extractFirstImageUrl(post.content?.rendered ?? '')
    if (inlineUrl) {
      return this.uploadRemoteImage(inlineUrl, post.slug, publish)
    }
    return this.uploadImageFromBank(post.slug, publish)
  }

  private async uploadRemoteImage(
    imageUrl: string,
    slug: string,
    publish: boolean,
  ): Promise<string | null> {
    const fileName = imageUrl.split('/').pop()?.split('?')[0] ?? `${slug}.jpg`
    const title = cleanImageTitle(fileName)

    const existing = await this.cmsRepository.findAssetByFileName(fileName)
    if (existing) {
      logger.info('Inline image already exists in Contentful, reusing', {
        slug,
        assetId: existing.sys.id,
      })
      return existing.sys.id
    }

    logger.info('Uploading inline image', { slug, imageUrl })

    const asset = await this.cmsRepository.createAsset(
      {
        metadata: makeTagMetadata(LYFJASTOFNUN_OWNER_TAG),
        fields: {
          title: { [LOCALE]: title },
          file: {
            [LOCALE]: {
              contentType: guessImageContentType(fileName),
              fileName,
              upload: imageUrl,
            },
          },
        },
      },
      publish,
    )

    if (!asset) {
      logger.warn('Failed to upload inline image', { slug })
      return null
    }

    logger.info('Inline image uploaded', { slug, assetId: asset.sys.id })
    return asset.sys.id
  }

  private async uploadImageFromBank(
    slug: string,
    publish: boolean,
  ): Promise<string | null> {
    const bankFile = this.pickRandomBankImage()
    if (!bankFile) {
      logger.warn('Image bank is empty', { slug })
      return null
    }

    const { filePath, fileName } = bankFile
    const title = cleanImageTitle(fileName)

    const existing = await this.cmsRepository.findAssetByFileName(fileName)
    if (existing) {
      logger.info('Bank image already exists in Contentful, reusing', {
        slug,
        assetId: existing.sys.id,
      })
      return existing.sys.id
    }

    logger.info('Uploading image from bank', { slug, fileName })

    const asset = await this.cmsRepository.createLocalAsset(
      {
        fields: {
          title: { [LOCALE]: title },
          description: { [LOCALE]: '' },
          file: {
            [LOCALE]: {
              contentType: guessImageContentType(fileName),
              fileName,
              file: fs.createReadStream(filePath),
            },
          },
        },
      },
      [LYFJASTOFNUN_OWNER_TAG],
      publish,
    )

    if (!asset) {
      logger.warn('Failed to upload bank image', { slug, fileName })
      return null
    }

    logger.info('Bank image uploaded', {
      slug,
      assetId: asset.sys.id,
      fileName,
    })
    return asset.sys.id
  }

  private pickRandomBankImage(): { filePath: string; fileName: string } | null {
    if (!fs.existsSync(IMAGE_BANK_DIR)) return null

    const files = fs
      .readdirSync(IMAGE_BANK_DIR)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|jfif)$/i.test(f))
    if (!files.length) return null

    const fileName = files[Math.floor(Math.random() * files.length)]
    return { filePath: path.join(IMAGE_BANK_DIR, fileName), fileName }
  }
}
