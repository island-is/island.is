import { Injectable } from '@nestjs/common'
import fs from 'fs'
import path from 'path'
import { logger } from '@island.is/logging'
import { CmsRepository } from '../../../../platform/cms.repository'
import {
  getExistingSlugsByLinkedEntry,
  syncCreateOnly,
} from '../../../../platform/sync-strategies'
import { makeTagMetadata } from '../../../../platform/localization'
import { LyfjastofnunRepository } from '../../lyfjastofnun.repository'
import { WpPost } from '../../lyfjastofnun.types'
import { extractFirstImageUrl, extractIntro } from '../../lyfjastofnun.utils'
import { LYFJASTOFNUN_ORG_ID, LYFJASTOFNUN_OWNER_TAG } from '../../lyfjastofnun.constants'
import { LOCALE } from '../../../../constants'
import { cleanImageTitle, guessImageContentType } from './utils'
import { buildNewsEntry } from './news.mapper'
import { IMAGE_BANK_DIR, IMPORT_LIMIT, NEWS_CONTENT_TYPE } from './constants'

interface Link {
  assetId: string
  summary?: string | null
}

@Injectable()
export class LyfjastofnunNewsImportService {
  constructor(
    private readonly cmsRepository: CmsRepository,
    private readonly lyfjastofnunRepository: LyfjastofnunRepository,
  ) {}

  async run({
    publish,
    slug,
  }: { publish?: boolean; slug?: string } = {}): Promise<void> {
    await syncCreateOnly<WpPost, Link>({
      cmsRepository: this.cmsRepository,
      contentType: NEWS_CONTENT_TYPE,
      logLabel: 'Lyfjastofnun news import',
      publish,
      getItems: async () => {
        const posts = await this.lyfjastofnunRepository.getPosts()
        const filtered = slug ? posts.filter((p) => p.slug === slug) : posts
        return filtered.slice(0, slug ? filtered.length : IMPORT_LIMIT)
      },
      getExistingKeys: () =>
        getExistingSlugsByLinkedEntry(
          this.cmsRepository,
          NEWS_CONTENT_TYPE,
          LYFJASTOFNUN_ORG_ID,
        ),
      keyOf: (post) => post.slug,
      resolveLink: async (post, publish): Promise<Link | undefined> => {
        if (!extractIntro(post)) {
          logger.warn('Skipping post, no intro or content available', {
            slug: post.slug,
          })
          return undefined
        }

        const assetId = await this.uploadImage(post, publish)
        if (!assetId) {
          logger.warn('Skipping post, could not upload image', {
            slug: post.slug,
          })
          return undefined
        }

        const summary = await this.lyfjastofnunRepository.scrapePostSummary(
          post.link,
        )
        if (summary) logger.info('Scraped post summary', { slug: post.slug })

        return { assetId, summary }
      },
      mapEntry: (post, link) => buildNewsEntry(post, link.assetId, link.summary),
    })
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
